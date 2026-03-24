import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const QUESTIONS = [
  { correct: 1 }, // Q1
  { correct: 1 }, // Q2  
  { correct: 3 }, // Q3
  { correct: 2 }, // Q4
  { correct: 0 }, // Q5
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, email, sessionId: providedSessionId } = body;

    // Validate input
    if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === QUESTIONS[index].correct) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / QUESTIONS.length) * 100);
    
    // Calculate percentile (simplified)
    const percentile = Math.min(99, Math.max(1, 
      score < 50 ? 30 :
      score < 70 ? 50 :
      score < 85 ? 75 :
      score < 90 ? 85 : 95
    ));

    // Generate or use session ID
    const sessionId = providedSessionId || uuidv4();

    // Store attempt in database
    const { data: attempt, error } = await supabaseAdmin
      .from('attempts')
      .insert({
        session_id: sessionId,
        answers,
        score,
        percentile,
        email: email || null,
        raw_data: { calculated_at: new Date().toISOString() }
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to store attempt:', error);
      return NextResponse.json(
        { error: 'Failed to save attempt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      sessionId,
      score,
      percentile,
      unlocked: false, // Always false initially - requires payment
      paymentRequired: true,
      price: 990, // €9.90 in cents
    });

  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
