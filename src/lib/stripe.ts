import Stripe from "stripe";
import { getStripeEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripe() {
  if (stripe) return stripe;
  const env = getStripeEnv();
  stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2026-03-25.dahlia" });
  return stripe;
}
