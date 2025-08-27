import fetch from 'node-fetch';

async function testEmailSend() {
  const emailData = {
    to: 'cory@gcodes.org',
    subject: 'Test Email from Soundways SMTP',
    html: '<h1>Test Email</h1><p>This is a test email sent via the Soundways SMTP server using Unsend.</p>',
    text: 'Test Email - This is a test email sent via the Soundways SMTP server using Unsend.',
    from: 'notifications' // Will become notifications@notify.soundways.org
  };

  try {
    const response = await fetch('http://localhost:3000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Full response:', JSON.stringify(result, null, 2));
    } else {
      console.error('Failed to send email:', result.error);
      if (result.message) {
        console.error('Error details:', result.message);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
console.log('Testing email send functionality...');
testEmailSend();