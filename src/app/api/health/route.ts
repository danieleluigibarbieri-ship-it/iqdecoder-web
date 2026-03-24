import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data: supabaseData, error: supabaseError } = await supabaseAdmin
      .from('attempts')
      .select('count')
      .limit(1);

    // Test Stripe connection
    let stripeStatus = 'unknown';
    try {
      await stripe.balance.retrieve();
      stripeStatus = 'connected';
    } catch (stripeError) {
      stripeStatus = 'error';
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        supabase: supabaseError ? 'error' : 'connected',
        stripe: stripeStatus,
      },
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
