import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

export const webhookSecret = stripeWebhookSecret;

export async function createCheckoutSession(
  attemptId: string,
  email: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'IQ Test Full Report',
            description: 'Unlock your detailed IQ analysis and PDF report',
          },
          unit_amount: 990, // €9.90
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      attemptId,
      email,
    },
    customer_email: email,
  });

  return session;
}
