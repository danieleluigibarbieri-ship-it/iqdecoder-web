import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const attemptId = params.attemptId;
    const sessionId = request.headers.get('x-session-id') || request.cookies.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 401 }
      );
    }

    // Get attempt
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('session_id', sessionId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: 'Attempt not found or access denied' },
        { status: 404 }
      );
    }

    // Check payment status
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('attempt_id', attemptId)
      .eq('status', 'succeeded')
      .single();

    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('attempt_id', attemptId)
      .single();

    const hasPaid = !!payment;
    const hasReport = !!report;
    const pdfUrl = report?.pdf_url;

    // Generate simple PDF URL if paid but no PDF yet (simulate)
    let generatedPdfUrl = null;
    if (hasPaid && !pdfUrl) {
      generatedPdfUrl = `/api/pdf/${attemptId}?token=${Buffer.from(`${attemptId}:${sessionId}`).toString('base64')}`;
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        percentile: attempt.percentile,
        answers: attempt.answers,
        created_at: attempt.created_at,
      },
      payment: hasPaid ? {
        id: payment?.id,
        status: payment?.status,
        amount: payment?.amount,
        currency: payment?.currency,
        paid_at: payment?.updated_at,
      } : null,
      report: hasReport ? {
        id: report?.id,
        pdf_url: pdfUrl || generatedPdfUrl,
        accessed_count: report?.accessed_count,
        expires_at: report?.expires_at,
      } : null,
      unlocked: hasPaid,
      access_level: hasPaid ? 'full' : 'preview',
    });

  } catch (error) {
    console.error('Result API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
