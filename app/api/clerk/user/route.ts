import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendEmail } from '../../utils/zoho/mail';

export async function POST(req: Request) {
  const now = new Date().toISOString();

  try {
    const { type, data, event_attributes } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 },
      );
    }

    if (type === 'user.created') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        profile_image_url,
      } = data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        console.error('Email not found in payload:', data);
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 },
        );
      }

      console.log('Processing new user:', email);

      try {
        await prisma.users.upsert({
          where: { external_id: id },
          update: {
            first_name,
            last_name,
            email,
            image_url,
            profile_image_url,
            last_login: new Date(),
          },
          create: {
            external_id: id,
            first_name,
            last_name,
            email,
            image_url,
            profile_image_url,
          },
        });
      } catch (dbError) {
        console.error('Database error while creating/updating user:', dbError);
        await sendEmail(
          `[ALERT] User DB Error at ${now}`,
          `Error: ${JSON.stringify(dbError)}`,
        );
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }

    if (type === 'session.created') {
      const ip = event_attributes?.http_request?.client_ip || null;
      const userId = data.user_id;

      console.log('Updating user session for:', userId, 'IP:', ip);

      try {
        await prisma.users.updateMany({
          where: { external_id: userId },
          data: { ip_address: ip, last_login: new Date() },
        });
      } catch (dbError) {
        console.error('Database error updating session:', dbError);
        await sendEmail(
          `[ALERT] Session DB Error at ${now}`,
          `Error: ${JSON.stringify(dbError)}`,
        );
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling Clerk webhook:', error);
    await sendEmail(
      `[ALERT] Clerk Webhook Error at ${now}`,
      `Error: ${JSON.stringify(error)}`,
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
