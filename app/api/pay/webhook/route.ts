import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { createClerkClient } from '@clerk/nextjs/server';
import { sendEmail } from '../../utils/zoho/mail';

export async function POST(req: NextRequest) {
  const now = new Date().toISOString();

  try {
    const body = await req.json();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      const errorMessage = 'Missing Stripe signature';
      console.error(errorMessage);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Full Request Body: ${JSON.stringify(body)}`,
      );
      return NextResponse.json({ error: errorMessage }, { status: 403 });
    }

    // Handle only 'charge.updated' events
    if (body.type !== 'charge.updated') {
      console.log('Unrecognized event type:', body.type);
      return NextResponse.json({}, { status: 202 });
    }

    const charge = body.data?.object;
    const status = charge?.status;

    if (status !== 'succeeded') {
      const errorMessage = `Charge status not successful: ${status}`;
      console.log(errorMessage);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Full Request Body: ${JSON.stringify(body)}`,
      );
      return NextResponse.json({}, { status: 400 });
    }

    const outcome = charge.outcome?.network_status;
    if (outcome !== 'approved_by_network') {
      const errorMessage = `Payment not approved by network: ${outcome}`;
      console.log(errorMessage);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Full Request Body: ${JSON.stringify(body)}`,
      );
      return NextResponse.json({}, { status: 400 });
    }

    const billing = charge.billing_details;
    const userEmail = billing?.email;

    if (!userEmail) {
      const errorMessage = 'User email not found in billing details';
      console.error(errorMessage);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Full Request Body: ${JSON.stringify(body)}`,
      );
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Verify user with Clerk
    let userId: string;
    try {
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkUsers = await clerkClient.users.getUserList({
        emailAddress: [userEmail],
      });

      if (!clerkUsers || clerkUsers.length === 0) {
        const errorMessage = `No Clerk user found for email: ${userEmail}`;
        console.error(errorMessage);
        await sendEmail(
          `[ALERT] ${errorMessage} at ${now}`,
          `Email: ${userEmail}`,
        );
        return NextResponse.json({ error: errorMessage }, { status: 404 });
      }
      userId = clerkUsers[0].id;
    } catch (clerkError) {
      const errorMessage = 'Error fetching user from Clerk';
      console.error(errorMessage, clerkError);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Error: ${JSON.stringify(clerkError)}`,
      );
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Determine mocks based on amount
    const amountToMocksMap: Record<number, number> = {
      500: 1,
      2000: 5,
      4000: 10,
      5000: 13,
      10100: 35,
    };
    const mocks = amountToMocksMap[charge.amount];

    if (mocks === undefined) {
      const errorMessage = `Invalid charge amount: ${charge.amount}`;
      console.log(errorMessage);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Full Request Body: ${JSON.stringify(body)}`,
      );
      return NextResponse.json(
        { error: 'Invalid charge amount' },
        { status: 400 },
      );
    }

    try {
      // Check if a subscription exists and update/create accordingly
      const existingSub = await prisma.subscriptions.findFirst({
        where: { user_id: userId },
      });

      if (existingSub) {
        const updatedSub = await prisma.subscriptions.update({
          where: { id: existingSub.id },
          data: {
            mocks_available: existingSub.mocks_available + mocks,
          },
        });
        console.log('Subscription updated:', updatedSub.id);
      } else {
        const newSub = await prisma.subscriptions.create({
          data: {
            user_id: userId,
            mocks_available: mocks,
            mocks_used: 0,
          },
        });
        console.log('Subscription created:', newSub.id);
      }
    } catch (dbError) {
      const errorMessage = 'Database error during subscription creation/update';
      console.error(errorMessage, dbError);
      await sendEmail(
        `[ALERT] ${errorMessage} at ${now}`,
        `Error: ${JSON.stringify(dbError)}`,
      );
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Subscription successfully processed' },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = 'Internal server error';
    console.error(errorMessage, error);
    await sendEmail(
      `[ALERT] ${errorMessage} at ${now}`,
      `Error: ${JSON.stringify(error)}`,
    );
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
