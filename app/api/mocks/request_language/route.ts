import { NextResponse } from 'next/server';
import { sendEmail } from '../../utils/zoho/mail';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/utils/prisma';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: no userId found' },
      { status: 401 },
    );
  }

  try {
    const { language } = await req.json();

    const subject = `New Language Request by ${userId}`;
    const body = `A user has requested support for the language: ${language}`;

    await sendEmail(subject, body);

    const user = await prisma.users.findUnique({
      where: { external_id: userId },
      select: {
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscriberData = {
      email: user.email,
      firstname: user.first_name || '',
      lastname: user.last_name || '',
      language: language,
      groups: ['dy7E7w', process.env.SENDER_GROUP_ID],
    };

    // console.log('Subscriber data:', subscriberData);

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
      const errorText = await senderResponse.text();
      console.error('Failed to add subscriber to Sender:', errorText);
    }
    console.log('Sender Response:', senderResponse);

    return NextResponse.json(
      { message: 'Language request submitted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing language request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
