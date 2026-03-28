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

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());
    const appUrl = getAppUrl();
    const supabase = getSupabaseAdmin();
    const stripe = getStripe();

    const { data: attempt, error: attemptError } = await supabase
      .from("iq_attempts")
      .select("id, public_token, status, locale")
      .eq("public_token", parsed.publicToken)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ ok: false, error: "Attempt not found" }, { status: 404 });
    }

    if (attempt.status !== "completed" && attempt.status !== "paid") {
      return NextResponse.json({ ok: false, error: "Attempt is not ready for checkout" }, { status: 409 });
    }

    if (attempt.status === "paid") {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        resultUrl: `${appUrl}/result/${attempt.public_token}`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/result/${attempt.public_token}?status=success`,
      cancel_url: `${appUrl}/checkout/${attempt.public_token}?status=cancel`,
      customer_email: parsed.email.toLowerCase(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRICE_EUR_CENTS,
            product_data: {
              name: "IQ Decoder Premium Report",
              description: attempt.locale === "it" ? "Report premium completo con PDF" : "Full premium report with PDF",
            },
          },
        },
      ],
      metadata: {
        attempt_id: attempt.id,
        public_token: attempt.public_token,
        full_name: parsed.fullName,
      },
    });

    const { error: updateError } = await supabase
      .from("iq_attempts")
      .update({
        email: parsed.email.toLowerCase(),
        stripe_checkout_session_id: session.id,
        amount_cents: PRICE_EUR_CENTS,
        currency: "eur",
      })
      .eq("id", attempt.id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 },
    );
  }
}
