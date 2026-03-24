import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

function calculateScore(answers: number[]): { score: number; percentile: number } {
  // Simple scoring: each correct answer = 20 points
  const correctAnswers = [1, 3, 2, 0, 1]; // Example correct answers
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) correct++;
  });
  
  const score = correct * 20;
  // Mock percentile based on normal distribution
  const percentile = Math.min(99, Math.max(1, 50 + (score - 50) * 0.8));
  
  return { score, percentile };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, email } = body;

    if (!Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json(
        { error: 'Invalid answers format. Expected 5 answers.' },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    const attemptId = uuidv4();
    const { score, percentile } = calculateScore(answers);

    // Store attempt in Supabase
    const { error: insertError } = await supabaseAdmin
      .from('attempts')
      .insert({
        id: attemptId,
        session_id: sessionId,
        email: email || null,
        answers,
        score,
        percentile,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save attempt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attemptId,
      sessionId,
      score,
      percentile,
      unlocked: false,
      paymentRequired: true,
      price: 990, // €9.90
    });

  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
