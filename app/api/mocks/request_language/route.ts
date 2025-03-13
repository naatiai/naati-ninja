import { NextResponse } from 'next/server';
import { sendEmail } from '../../utils/zoho/mail';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);

  try {
    const { language } = await req.json();

    if (!language) {
      return NextResponse.json(
        { error: 'Language is required' },
        { status: 400 },
      );
    }

    const subject = `New Language Request by ${userId}`;
    const body = `A user has requested support for the language: ${language}`;

    await sendEmail(subject, body);

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
