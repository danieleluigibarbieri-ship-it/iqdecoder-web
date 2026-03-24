import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const attemptId = url.searchParams.get('attemptId');
    
    if (!attemptId) {
      return NextResponse.json(
        { error: 'attemptId query parameter required' },
        { status: 400 }
      );
    }

    // Mock response for build
    return NextResponse.json({
      attempt: {
        id: attemptId,
        score: 75,
        percentile: 85,
        answers: [1, 1, 3, 2, 0],
        created_at: new Date().toISOString(),
      },
      payment: null,
      report: null,
      unlocked: false,
      access_level: 'preview',
    });

  } catch (error) {
    console.error('Result API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
