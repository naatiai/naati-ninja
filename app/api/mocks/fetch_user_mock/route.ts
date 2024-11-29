import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mockId } = await req.json();
    console.log('Request from User for Mock:', userId, mockId);

    if (!mockId) {
      return NextResponse.json({ error: 'Missing mockID' }, { status: 400 });
    }

    const userMock = await prisma.userMocks.findFirst({
      where: {
        mock_id: mockId,
        user_id: userId,
      },
    });

    if (!userMock) {
      return NextResponse.json(
        { error: 'UserMock not found for the provided mockID and user' },
        { status: 202 },
      );
    }

    // Return both userId and userMock
    return NextResponse.json({ userId, userMock });
  } catch (error: any) {
    console.error('Error fetching userMock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
