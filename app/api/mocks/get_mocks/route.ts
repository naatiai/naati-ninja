import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Request from User:', userId);

  try {
    const { language } = await req.json(); // Parse the request body for "language"

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "language" parameter' },
        { status: 400 }
      );
    }

    // Fetch all mocks for the specified language ordered by creation date
    const mocks = await prisma.mocks.findMany({
      where: {
        language: language, // Filter by the provided language
      },
      orderBy: {
        created_on: 'asc',
      },
    });

    // Fetch userMocks with the corresponding mock ids
    const mockIds = mocks.map((mock) => mock.id);
    const userMocks = await prisma.userMocks.findMany({
      where: {
        mock_id: {
          in: mockIds,
        },
        user_id: userId,
      },
      select: {
        mock_id: true,
        id: true, // Fetch the userMock id for association
      },
    });

    // Map over mocks to append associated userMockId
    const mocksList = mocks.map((mock) => {
      const associatedUserMock = userMocks.find(
        (userMock) => userMock.mock_id === mock.id
      );

      return {
        ...mock,
        userMockId: associatedUserMock ? associatedUserMock.id : null,
      };
    });

    return NextResponse.json(mocksList);
  } catch (error: any) {
    console.error('Error fetching mocks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
