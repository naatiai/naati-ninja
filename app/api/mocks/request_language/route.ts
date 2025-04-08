import { NextResponse } from 'next/server';
import { sendEmail } from '../../utils/zoho/mail';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  try {
    const { language, email, first_name, last_name } = await req.json();

    if (!language || !email || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const subject = `New Language Request by ${userId}`;
    const body = `A user has requested support for the language: ${language}`;

    await sendEmail(subject, body);

    // Add subscriber to Sender.net
    const subscriberData = {
      email,
      firstname: first_name,
      lastname: last_name,
      language : language,
      groups: 'dy7E7w', // Group ID
    };

    const senderResponse = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
      },
      body: JSON.stringify(subscriberData),
    });

    if (!senderResponse.ok) {
      const errorText = await senderResponse.text();
      console.error('Failed to add subscriber to Sender:', errorText);
    }

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
