import nodemailer from 'nodemailer';

export async function sendEmail(subject: string, body: string) {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com.au',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ZOHO_USER, // your Zoho email address
      pass: process.env.ZOHO_PASS, // your Zoho email password
    },
  });

  // Fetch a random motivational quote from ZenQuotes
  let quote = '';
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    if (data && data.length > 0) {
      quote = data[0].q + ' - ' + data[0].a;
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
  }

  // Set up email data with unicode symbols
  let mailOptions = {
    from: process.env.ZOHO_USER, // sender address
    to: 'dhruv@oberoi.io', // list of receivers
    subject: subject, // Subject line
    text: `${quote}\n\n${body}`, // plain text body
    html: `<p>Hi Dhruv,</p><p>${quote}</p><p>${body}</p>`, // html body
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
}
