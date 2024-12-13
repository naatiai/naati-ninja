import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createClerkClient } from '@clerk/nextjs/server';

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Update to the new version
});

export async function POST(req: NextRequest) {
  try {
    // Get user and input data
    const { userId } = getAuth(req as any);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Fetch user email from Clerk
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerkClient.users.getUser(userId);

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 },
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail,
      currency: 'AUD',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      payment_intent_data: {
        metadata: {
          userId,
        },
      },
      custom_text: {
        submit: {
          message:
            'Thank you for your payment. Please allow a few minutes for the transaction to reflect in your account. For any issues or assistance, feel free to reach out to us at support@naatininja.com',
        },
      },
    });

    // Respond with the session URL
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
