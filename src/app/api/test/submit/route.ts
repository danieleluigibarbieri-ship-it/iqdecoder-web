import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, email, sessionId: providedSessionId } = body;

    // Validate input
    if (!Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Mock calculation
    const score = 75;
    const percentile = 85;
    const attemptId = 'mock-attempt-' + Date.now();

    return NextResponse.json({
      success: true,
      attemptId,
      sessionId: providedSessionId || 'mock-session-' + Date.now(),
      score,
      percentile,
      unlocked: false,
      paymentRequired: true,
      price: 990,
    });

  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
