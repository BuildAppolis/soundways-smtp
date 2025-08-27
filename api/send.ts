import { VercelRequest, VercelResponse } from '@vercel/node';
import { Unsend } from 'unsend';

// Initialize Unsend with the API key from environment variables
// Self-hosted Unsend instance at mailr.buildappolis.com
const unsend = new Unsend(process.env.UNSEND_API_KEY || '', 'https://mailr.buildappolis.com');

// Email sending configuration
const DEFAULT_FROM = 'notify.soundways.org';

interface EmailRequest {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Verify API key is configured
  if (!process.env.UNSEND_API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const emailData: EmailRequest = req.body;

    // Validate required fields
    if (!emailData.to || !emailData.subject) {
      res.status(400).json({ 
        error: 'Missing required fields: to and subject are required' 
      });
      return;
    }

    // Validate email content
    if (!emailData.html && !emailData.text) {
      res.status(400).json({ 
        error: 'Either html or text content is required' 
      });
      return;
    }

    // Prepare email configuration
    const emailConfig = {
      to: emailData.to,
      from: emailData.from ? `${emailData.from}@${DEFAULT_FROM}` : `no-reply@${DEFAULT_FROM}`,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
      cc: emailData.cc,
      bcc: emailData.bcc,
      attachments: emailData.attachments
    };

    // Send the email using Unsend
    const result = await unsend.emails.send(emailConfig);

    // Return success response
    res.status(200).json({
      success: true,
      messageId: result.id,
      data: result
    });

  } catch (error: unknown) {
    console.error('Email sending error:', error);
    
    // Handle different error types
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Failed to send email',
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send email',
        message: 'An unknown error occurred'
      });
    }
  }
}