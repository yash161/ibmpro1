const SENDGRID_API_KEY = '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';
const sendEmail = async () => {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: 'yashshah19@gnu.ac.in',
            },
          ],
          subject: 'Test Email',
        },
      ],
      from: {
        email: 'testshah889@gmail.com',
        name: 'Sender Name',
      },
      content: [
        {
          type: 'text/plain',
          value: 'Hello, World!',
        },
      ],
    }),
  });

  if (response.status === 202) {
    console.log('Email sent successfully!');
  } else {
    console.error('Failed to send email:', response.status, await response.text());
  }
};

sendEmail();
