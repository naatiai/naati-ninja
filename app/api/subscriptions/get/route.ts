// src/pages/api/subscriptions/getSubscription.ts
import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch subscription data for the user
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
      },
    });

    // return NextResponse.json(
    //   { subscription: subscription },
    //   { status: 200 },
    // );
    // Check if subscription exists
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 },
      );
    }

    // Return the subscription data
    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 },
    );
  }
}
