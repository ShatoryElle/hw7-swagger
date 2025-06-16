import nodemailer from 'nodemailer';

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, 
      auth: {
        user: '8f6694001@smtp-brevo.com',
        pass: '',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: 'shatory@gmail.com',
      to: 'shatory@gmail.com', 
      subject: 'Test email from Brevo SMTP',
      text: 'This is a test email sent via Brevo SMTP using nodemailer.',
    });

    console.log('Email sent info:', info);

  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();
