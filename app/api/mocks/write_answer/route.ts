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
    const { mock_question_id, audio_file_url, userMockId } = await req.json();
    console.log("User req for write answer:", userId, audio_file_url);

    if (!mock_question_id || !audio_file_url || !userMockId) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 200 },  // Always return 2xx if mock answer is written
      );
    }

    // Create a new mock answer
    const answer = await prisma.mockAnswers.create({
      data: {
        mock_question_id,
        audio_file_url,
        user_mock_id: userMockId,
        user_id: userId,
      },
    });

    console.log('UserID request to Write Answer:', userId, answer.id);

    // Fetch userMock to get the associated mockId
    const userMock = await prisma.userMocks.findUnique({
      where: { id: userMockId },
      select: { mock_id: true },
    });

    if (!userMock || !userMock.mock_id) {
      return NextResponse.json(
        { message: 'Answer saved, but mock ID could not be verified.' },
        { status: 200 },  // Ensure 2xx response if answer saved
      );
    }

    // Fetch mock to get no_of_qa and count answers
    const mock = await prisma.mocks.findUnique({
      where: { id: userMock.mock_id },
      select: {
        no_of_qa: true,
        MockAnswers: {
          where: { user_mock_id: userMockId },
          select: { id: true },
        },
      },
    });

    if (!mock) {
      return NextResponse.json(
        { message: 'Answer saved, but mock details not found.' },
        { status: 200 },  // Ensure 2xx response if answer saved
      );
    }

    // Check if the user has answered all questions
    const answeredQuestionsCount = mock.MockAnswers.length;

    if (answeredQuestionsCount + 1 >= mock.no_of_qa) {
      // All questions answered, return 202 status
      return NextResponse.json(
        { message: 'Test completed successfully' },
        { status: 202 },
      );
    } else {
      // Return 200 for successful answer submission
      return NextResponse.json(
        { message: 'Answer saved successfully' },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error('Error saving answer:', error);

    // Always ensure response is 2xx if the answer was saved
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 },
    );
  }
}
