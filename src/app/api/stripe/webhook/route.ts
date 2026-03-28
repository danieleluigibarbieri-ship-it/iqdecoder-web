import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeWebhookSecret } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

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
    const webhookSecret = getStripeWebhookSecret();
    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ ok: false, error: "Missing stripe signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: error instanceof Error ? error.message : "Invalid signature" },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const attemptId = session.metadata?.attempt_id;

      if (attemptId) {
        const { data: current } = await supabase
          .from("iq_attempts")
          .select("id, status")
          .eq("id", attemptId)
          .single();

        if (current && current.status !== "paid") {
          const paymentIntentId =
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
          const updatePayload: Record<string, unknown> = {
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: paymentIntentId,
          };

          for (let i = 0; i < 6; i += 1) {
            const updateRes = await supabase.from("iq_attempts").update(updatePayload).eq("id", attemptId);
            if (!updateRes.error) break;

            const missing = extractMissingColumn(getErrorMessage(updateRes.error));
            if (!missing || !(missing in updatePayload)) throw updateRes.error;
            delete updatePayload[missing];
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
