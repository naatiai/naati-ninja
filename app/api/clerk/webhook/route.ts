import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendEmail } from '../../utils/zoho/mail';

const BLOCKED_DOMAINS = ['adroitandco.in'];
const BLOCKED_PREFIX_KEYWORDS = ['deol', 'indu', 'sam'];

export async function POST(req: Request) {
  const now = new Date().toISOString();

  try {
    const { type, data } = await req.json();

    if (type !== 'user.created') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 },
      );
    }

    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('Email not found in the payload:', data);
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    console.log('Processing new user:', email);

    const [prefix, domain] = email.toLowerCase().split('@');
    const isBlockedDomain = BLOCKED_DOMAINS.includes(domain);
    const isBlockedPrefix = BLOCKED_PREFIX_KEYWORDS.some((keyword) =>
      prefix.includes(keyword),
    );

    // Prepare the subscriber data for Sender.net
    const subscriberData = {
      email,
      firstname: first_name,
      lastname: last_name,
      groups: [process.env.SENDER_GROUP_ID],
    };

    const senderResponse = await fetch(
      'https://api.sender.net/v2/subscribers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
        },
        body: JSON.stringify(subscriberData),
      },
    );

    if (!senderResponse.ok) {
      const errorData = await senderResponse.json();
      console.error('Error from Sender.net:', errorData);
      return NextResponse.json(
        { error: 'Error creating subscriber' },
        { status: senderResponse.status },
      );
    }

    const result = await senderResponse.json();
    console.log('Subscriber created successfully:', result);

    // Skip subscription creation if domain or prefix is blocked
    if (isBlockedDomain || isBlockedPrefix) {
      console.log(
        `Skipping subscription due to blocklist. Domain: ${domain}, Prefix: ${prefix}`,
      );
    } else {
      try {
        const existingSub = await prisma.subscriptions.findFirst({
          where: { user_id: id },
        });

        if (existingSub) {
          const updatedSub = await prisma.subscriptions.update({
            where: { id: existingSub.id },
            data: {
              mocks_available: existingSub.mocks_available + 1,
              payment_required: true, // free mock
            },
          });
          console.log('Subscription updated:', updatedSub.id);
        } else {
          const newSub = await prisma.subscriptions.create({
            data: {
              user_id: id,
              mocks_available: 1,
              mocks_used: 0,
              payment_required: true, // free mock
            },
          });
          console.log('Subscription created:', newSub.id);
        }
      } catch (dbError) {
        const errorMessage =
          'Database error during subscription creation/update';
        console.error('Error Activating Sub:', errorMessage, dbError);
        await sendEmail(
          `[ALERT] ${errorMessage} at ${now}`,
          `Error: ${JSON.stringify(dbError)}`,
        );
      }
    }

    return NextResponse.json(
      { message: 'Subscriber created successfully', result },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling Clerk webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
