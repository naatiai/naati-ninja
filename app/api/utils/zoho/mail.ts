import fetch from 'node-fetch';

export async function sendEmail(subject: string, body: string) {
  const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;

  // Fetch a random motivational quote from ZenQuotes
  let quote = '';
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    if (data && data.length > 0) {
      quote = `${data[0].q} - ${data[0].a}`;
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
  }

  const emailBody = `${quote}\n\n${body}`;
  const emailHtml = `<p>Hi Dhruv,</p><p>${quote}</p><p>${body}</p>`;

  // Send email via Postmark API
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN || '',
      },
      body: JSON.stringify({
        From: 'support@naatininja.com', // Update if needed
        To: 'dhruv@oberoi.io', // Receiver email
        Subject: subject,
        TextBody: emailBody,
        HtmlBody: emailHtml,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Message sent:', result.MessageID);
      return { success: true, messageId: result.MessageID };
    } else {
      console.error('Error sending email:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('Request failed:', error);
    return { success: false, error };
  }
}
