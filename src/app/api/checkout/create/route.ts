import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUrl } from "@/lib/env";
import { PRICE_EUR_CENTS } from "@/lib/test";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

const schema = z.object({
  publicToken: z.string().uuid(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email(),
});

const PRODUCT_DESCRIPTION_BY_LOCALE: Record<string, string> = {
  en: "Full premium report with PDF",
  it: "Report premium completo con PDF",
  fr: "Rapport premium complet avec PDF",
  de: "Vollstandiger Premium-Bericht mit PDF",
  es: "Informe premium completo con PDF",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Unknown error";
}

function extractMissingColumn(message: string): string | null {
  const match = message.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());
    const appUrl = getAppUrl();
    const supabase = getSupabaseAdmin();
    const stripe = getStripe();

    const { data: attempt, error: attemptError } = await supabase
      .from("iq_attempts")
      .select("*")
      .eq("public_token", parsed.publicToken)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ ok: false, error: "Attempt not found" }, { status: 404 });
    }

    const attemptStatus = typeof attempt.status === "string" ? attempt.status : "completed";
    const attemptLocale = typeof attempt.locale === "string" ? attempt.locale : "en";
    const attemptToken = typeof attempt.public_token === "string" ? attempt.public_token : parsed.publicToken;
    const productDescription = PRODUCT_DESCRIPTION_BY_LOCALE[attemptLocale] ?? PRODUCT_DESCRIPTION_BY_LOCALE.en;

    if (attemptStatus === "paid") {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        resultUrl: `${appUrl}/result/${attemptToken}`,
      });
    }

    if (typeof attempt.stripe_checkout_session_id === "string" && attempt.stripe_checkout_session_id.length > 0) {
      const existingSession = await stripe.checkout.sessions.retrieve(attempt.stripe_checkout_session_id);
      if (existingSession.status === "open" && existingSession.url) {
        return NextResponse.json({ ok: true, url: existingSession.url, reused: true });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/result/${attemptToken}?status=success`,
      cancel_url: `${appUrl}/checkout/${attemptToken}?status=cancel`,
      customer_email: parsed.email.toLowerCase(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRICE_EUR_CENTS,
            product_data: {
              name: "IQ Decoder Premium Report",
              description: productDescription,
            },
          },
        },
      ],
      metadata: {
        attempt_id: attempt.id,
        public_token: attemptToken,
        full_name: parsed.fullName,
      },
    });

    const updatePayload: Record<string, unknown> = {
      email: parsed.email.toLowerCase(),
      stripe_checkout_session_id: session.id,
      amount_cents: PRICE_EUR_CENTS,
      currency: "eur",
    };

    for (let i = 0; i < 6; i += 1) {
      const updateRes = await supabase.from("iq_attempts").update(updatePayload).eq("id", attempt.id);
      if (!updateRes.error) break;

      const missing = extractMissingColumn(getErrorMessage(updateRes.error));
      if (!missing || !(missing in updatePayload)) throw updateRes.error;
      delete updatePayload[missing];
    }

    if (!session.url) {
      return NextResponse.json({ ok: false, error: "Stripe checkout URL not available" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
