import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // const { mockID, userMockId } = await req.json();
    const { mockId } = await req.json();

    // if (!mockID || !userMockId) {
    if (!mockId) {
      return NextResponse.json(
        { error: 'Missing mockId or userMockId' },
        { status: 400 },
      );
    }

    // Fetch the first unanswered question in the specified order for the user
    const question = await prisma.mockQuestions.findFirst({
      where: {
        mock_id: mockId,
        NOT: {
          MockAnswers: {
            some: {
              // user_mock_id: userMockId,
              user_id: userId,
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        audio_file_url: true,
        order: true,
        transcript: true,
        language: true,
        answer_language: true,
        created_on: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'No unanswered questions found for the provided mockID' },
        { status: 202 },
      );
    }

    return NextResponse.json(question);
  } catch (error: any) {
    console.error('Error fetching next unanswered question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
