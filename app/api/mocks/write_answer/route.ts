import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mock_question_id, audio_file_url, userMockId } = await req.json();
    console.log('User req for write answer:', userId, audio_file_url);

    if (!mock_question_id || !audio_file_url || !userMockId) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 },
      );
    }

    // Save the answer
    const answer = await prisma.mockAnswers.create({
      data: {
        mock_question_id,
        audio_file_url,
        user_mock_id: userMockId,
        user_id: userId,
      },
    });

    console.log('Answer saved for user:', userId, 'Answer ID:', answer.id);

    // Fetch userMock to get mockId and payment info
    const userMock = await prisma.userMocks.findUnique({
      where: { id: userMockId },
      select: {
        mock_id: true,
        needs_payment_before_grading: true,
      },
    });

    if (!userMock?.mock_id) {
      return NextResponse.json(
        { message: 'Answer saved, but mock ID could not be verified.' },
        { status: 200 },
      );
    }

    // Fetch mock's total number of questions
    const mock = await prisma.mocks.findUnique({
      where: { id: userMock.mock_id },
      select: { no_of_qa: true },
    });

    if (!mock) {
      return NextResponse.json(
        { message: 'Answer saved, but mock details not found.' },
        { status: 200 },
      );
    }

    // Count how many answers the user has given so far
    const answeredQuestionsCount = await prisma.mockAnswers.count({
      where: { user_mock_id: userMockId },
    });

    console.log(
      'Answered:',
      answeredQuestionsCount,
      '/',
      mock.no_of_qa,
      'Needs payment:',
      userMock.needs_payment_before_grading,
    );

    // Determine if test is complete
    if (answeredQuestionsCount >= mock.no_of_qa) {
      if (userMock.needs_payment_before_grading) {
        return NextResponse.json(
          {
            message:
              'Test completed successfully. Payment required to view results.',
            payment_required: true,
          },
          { status: 202 },
        );
      } else {
        return NextResponse.json(
          {
            message: 'Test completed successfully. Grading will start.',
            payment_required: false,
          },
          { status: 202 },
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Answer saved successfully.' },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 },
    );
  }
}
