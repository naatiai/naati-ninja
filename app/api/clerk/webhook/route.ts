import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    // Validate the webhook event type
    if (type !== 'user.created') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 },
      );
    }

    const { email_addresses, first_name, last_name } = data;
    const email = email_addresses[0]?.email_address;

    // Validate the presence of the email
    if (!email) {
      console.error('Email not found in the payload:', data);
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    console.log('Processing new user:', email);

    // Prepare the subscriber data for Sender.net
    const subscriberData = {
      email: email,
      firstname: first_name,
      lastname: last_name,
      groups: [process.env.SENDER_GROUP_ID],
    };

    // Send a POST request to Sender.net to create the subscriber
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

    // Check for any errors from the Sender.net response
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
