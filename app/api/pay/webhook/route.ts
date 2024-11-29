import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { createClerkClient } from '@clerk/nextjs/server';
import { sendEmail } from '../../utils/zoho/mail';

export async function POST(req: NextRequest) {
  const now = new Date().toISOString();
  try {
    const body = await req.json();
    // const sig = req.headers.get('stripe-signature');
    // if (!sig) {
    //   console.error('Missing Stripe signature');
    //   return NextResponse.json(
    //     { error: 'Missing Stripe signature' },
    //     { status: 403 },
    //   );
    // }

    // Only proceed if event is 'charge.updated'
    // if (body.type !== 'charge.updated') {
    //   console.log('Event not recognised:', body.type);
    //   return NextResponse.json({}, { status: 202 });
    // }

    // // Handle successful charge event
    // if (body.data?.object?.status === 'succeeded') {
    //   console.log('Event Captured:', body.type);

    //   const outcome = body.data.object.outcome?.network_status;
    //   if (outcome !== 'approved_by_network') {
    //     console.log('Payment not approved by network:', outcome);
    //     await sendEmail(
    //       `Payment Status was not Successful at ${now}`,
    //       `Full Stripe Request Body: ${JSON.stringify(body)}`,
    //     );
    //     return NextResponse.json({}, { status: 400 });
    //   }

    //   const billing = body.data.object.billing_details;
    //   const userEmail = billing?.email;

    //   // Verify user with Clerk
    //   let userId;
    //   try {
    //     const clerkClient = createClerkClient({
    //       secretKey: process.env.CLERK_SECRET_KEY,
    //     });
    //     const clerkUser = await clerkClient.users.getUserList({
    //       emailAddress: [userEmail],
    //     });
    //     if (!clerkUser || clerkUser.length === 0) {
    //       console.error('User not found for email:', userEmail);
    //       return NextResponse.json(
    //         { error: 'User not found' },
    //         { status: 404 },
    //       );
    //     }
    //     userId = clerkUser[0].id;
    //   } catch (clerkError) {
    //     console.error('Error fetching user from Clerk:', clerkError);
    //     return NextResponse.json(
    //       { error: 'Failed to fetch user from Clerk' },
    //       { status: 500 },
    //     );
    //   }

    //   // Determine plan details based on amount
    //   let plan, docs, reports, chats, days;
    //   if (body.data.object.amount === 500) {
    //     plan = 1;
    //     docs = 1;
    //     reports = 1;
    //     chats = 30;
    //     days = 30;
    //   } else if (body.data.object.amount === 3900) {
    //     plan = 2;
    //     docs = 10;
    //     reports = 10;
    //     chats = 700;
    //     days = 730;
    //   } else {
    //     await sendEmail(
    //       `Invalid Subscription Amount Found at ${now}`,
    //       `Full Stripe Request Body: ${JSON.stringify(body)}`,
    //     );
    //     console.log('Unrecognisable Amount:', body.data.object.amount);
    //     return NextResponse.json({}, { status: 400 });
    //   }

    //   // Create new subscription
    //   try {
    //     const newSub = await prisma.subscriptions.create({
    //       data: {
    //         user_id: userId,
    //         plan,
    //         documents_allowed: docs,
    //         reports_allowed: reports,
    //         messages_allowed: chats,
    //         expires_on: new Date(
    //           new Date().setDate(new Date().getDate() + days),
    //         ),
    //       },
    //     });
    //     console.log('Subscription created:', newSub.id);
    //   } catch (dbError) {
    //     console.error('Error creating subscription:', dbError);
    //     await sendEmail(
    //       `Database Error at ${now}`,
    //       `Error: ${JSON.stringify(dbError)}`,
    //     );
    //     return NextResponse.json({ error: 'Database error' }, { status: 500 });
    //   }

    //   return NextResponse.json({ message: 'Great success' }, { status: 200 });
    // } else {
    //   await sendEmail(
    //     `Event Status was not Successful at ${now}`,
    //     `Full Stripe Request Body: ${JSON.stringify(body)}`,
    //   );
    //   console.log('Event status not successful:', body.data.object.status);
    //   return NextResponse.json({}, { status: 400 });
    // }
  } catch (error) {
    console.error('Internal server error:', error);
    await sendEmail(
      `Error in Subscriptions Webhook at ${now}`,
      `Error: ${JSON.stringify(error)}`,
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
