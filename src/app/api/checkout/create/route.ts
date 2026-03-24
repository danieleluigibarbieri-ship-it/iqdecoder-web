import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, email, successUrl, cancelUrl } = body;

    if (!attemptId) {
      return NextResponse.json(
        { error: 'Attempt ID is required' },
        { status: 400 }
      );
    }

    // Verify attempt exists
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('attempt_id', attemptId)
      .eq('status', 'succeeded')
      .single();

    if (existingPayment) {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        paymentId: existingPayment.id,
        reportUrl: `/api/result/${attemptId}`,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'IQDecoder Report Completo',
              description: `Report dettagliato del tuo test IQ (punteggio: ${attempt.score}/100)`,
            },
            unit_amount: 990, // €9.90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/result?success=true&attemptId=${attemptId}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/result?canceled=true`,
      client_reference_id: attemptId,
      customer_email: email || attempt.email,
      metadata: {
        attempt_id: attemptId,
        session_id: attempt.session_id,
        score: attempt.score.toString(),
      },
    });

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        attempt_id: attemptId,
        stripe_payment_intent_id: session.payment_intent?.toString() || '',
        stripe_checkout_session_id: session.id,
        amount: 990,
        currency: 'eur',
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      // Continue anyway - webhook will handle it
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      paymentId: payment?.id,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
