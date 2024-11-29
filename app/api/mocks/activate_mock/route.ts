// /pages/api/mocks/activate_mock.ts
import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { mockId } = await req.json();
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Request from User for Mock:', userId, mockId);

  try {
    // Fetch the mock to verify it exists
    const mock = await prisma.mocks.findFirst({
      where: { id: mockId },
    });

    if (!mock) {
      return NextResponse.json({ error: 'Mock Not Found' }, { status: 404 });
    }

    // Check if the userMock already exists for this user and mock
    const existingUserMock = await prisma.userMocks.findFirst({
      where: {
        mock_id: mockId,
        user_id: userId,
      },
    });

    // If the userMock exists, return it with the current status
    if (existingUserMock) {
      const { expired, passed } = existingUserMock;

      // Return results if expired or passed
      if (expired || passed) {
        return NextResponse.json(
          { status: 'results', userMock: existingUserMock },
          { status: 200 },
        );
      }

      // If userMock exists but not expired/passed, proceed to testing
      return NextResponse.json(
        { status: 'testing', userMock: existingUserMock },
        { status: 200 },
      );
    }
    // Fetch the user's subscription
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 },
      );
    }

    if (subscription.mocks_available <= 0) {
      return NextResponse.json(
        { error: 'No mocks available in subscription' },
        { status: 400 },
      );
    }

    // Proceed to create a new userMock
    const userMock = await prisma.userMocks.create({
      data: {
        mock_id: mockId,
        user_id: userId,
        attempts_allowed: 1,
        attempts: 0,
        passed: false,
        expired: false,
        created_on: new Date(),
      },
    });

    console.log('User Mock created:', userMock);

    // Update the subscription: decrement mocks_available and increment mocks_used
    await prisma.subscriptions.update({
      where: { id: subscription.id }, // Using subscription.id for the unique identifier
      data: {
        mocks_available: subscription.mocks_available - 1,
        mocks_used: subscription.mocks_used + 1,
      },
    });

    return NextResponse.json({ status: 'testing', userMock }, { status: 201 });
  } catch (error: any) {
    console.error('Error in activate_mock API:', error.message);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
