import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const { mock_id, user_mock_id } = await req.json();

    if (!mock_id || !user_mock_id) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 },
      );
    }

    // Fetch MockQuestions related to the mock_id
    const questions = await prisma.mockQuestions.findMany({
      where: { mock_id },
      select: {
        id: true,
        transcript: true,
        MockAnswers: {
          where: {
            user_mock_id,
            user_id: userId, // Ensures answers belong to the current user
          },
          select: {
            transcript: true,
            is_correct: true,
            score: true,
            max_score: true,
            created_on: true,
          },
        },
      },
      orderBy: {
        order: 'asc', // Order questions by their order field
        // created_on: 'asc', // Order questions by creation date
      },
    });

    // Format the result for readability
    const resultData = questions.map((question) => ({
      questionId: question.id,
      questionTranscript: question.transcript,
      answerTranscript: question.MockAnswers[0]?.transcript || 'N/A', // Default to 'N/A' if no answer
      isCorrect: question.MockAnswers[0]?.is_correct ?? null,
      score: question.MockAnswers[0]?.score ?? null,
      max_score: question.MockAnswers[0]?.max_score ?? null,
      created_on: question.MockAnswers[0]?.created_on ?? null,
    }));

    return NextResponse.json(resultData);
  } catch (error: any) {
    console.error('Error fetching result data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
