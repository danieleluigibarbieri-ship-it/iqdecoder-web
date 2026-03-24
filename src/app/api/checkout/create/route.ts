import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, email, successUrl, cancelUrl } = body;

    if (!attemptId || !email) {
      return NextResponse.json(
        { error: 'Attempt ID and email are required' },
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

    // Create Stripe checkout session
    const session = await createCheckoutSession(
      attemptId,
      email,
      successUrl || `${request.nextUrl.origin}/result/${attemptId}?success=true`,
      cancelUrl || `${request.nextUrl.origin}/result/${attemptId}?canceled=true`
    );

    // Create payment record
    const paymentId = uuidv4();
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        id: paymentId,
        attempt_id: attemptId,
        stripe_session_id: session.id,
        amount: 990,
        currency: 'eur',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      // Continue anyway - webhook will update
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      paymentId,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
