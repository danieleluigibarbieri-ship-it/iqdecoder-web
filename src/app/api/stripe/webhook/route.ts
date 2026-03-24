import { NextRequest, NextResponse } from 'next/server';
import { stripe, webhookSecret } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const attemptId = session.metadata?.attemptId;
        const email = session.metadata?.email || session.customer_email;
        const paymentIntentId = session.payment_intent;

        if (!attemptId) {
          console.error('Missing attemptId in session metadata');
          break;
        }

        // Update payment status
        const { error: paymentError } = await supabaseAdmin
          .from('payments')
          .update({
            status: 'succeeded',
            stripe_payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_checkout_session_id', session.id);

        if (paymentError) {
          console.error('Payment update error:', paymentError);
        }

        // Create report record
        const reportId = uuidv4();
        const pdfUrl = `/api/pdf/${attemptId}?token=${Buffer.from(`${attemptId}:${email}`).toString('base64')}`;
        
        const { error: reportError } = await supabaseAdmin
          .from('reports')
          .insert({
            id: reportId,
            attempt_id: attemptId,
            pdf_url: pdfUrl,
            accessed_count: 0,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            created_at: new Date().toISOString(),
          });

        if (reportError) {
          console.error('Report creation error:', reportError);
        }

        console.log(`Payment succeeded for attempt ${attemptId}, report ${reportId} created`);
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as any;
        
        await supabaseAdmin
          .from('payments')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_checkout_session_id', session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
