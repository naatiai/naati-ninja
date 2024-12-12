import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse input to get the mockId
    const body = await req.json();
    const { mockId } = body;

    if (!mockId) {
      return NextResponse.json(
        { error: 'mockId is required' },
        { status: 400 },
      );
    }

    // Fetch the mock with the given mockId
    const mock = await prisma.mocks.findUnique({
      where: {
        id: mockId,
      },
    });

    if (!mock) {
      return NextResponse.json({ error: 'Mock not found' }, { status: 404 });
    }

    // Fetch the associated userMock
    const userMock = await prisma.userMocks.findFirst({
      where: {
        mock_id: mockId,
        user_id: userId, // Filter by the current user's ID
      },
      select: {
        mock_id: true,
        id: true, // Fetch the userMock id for association
      },
    });

    // Append userMockId to the mock data
    const result = {
      ...mock,
      userMockId: userMock ? userMock.id : null,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching mock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
