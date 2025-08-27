import { VercelRequest, VercelResponse } from '@vercel/node';
import { Unsend } from 'unsend';
import * as crypto from 'crypto';

// Initialize Unsend with the API key
const unsend = new Unsend(process.env.UNSEND_API_KEY || '', 'https://mailr.buildappolis.com');

// SMTP Authentication credentials
const SMTP_CREDENTIALS = {
  username: process.env.SMTP_USERNAME || 'notifications@soundways.org',
  password: process.env.SMTP_PASSWORD || 'soundways-smtp-2024'
};

interface SMTPAuthRequest {
  username: string;
  password: string;
  from: string;
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
}

// Simple authentication check
function authenticateUser(username: string, password: string): boolean {
  return username === SMTP_CREDENTIALS.username && password === SMTP_CREDENTIALS.password;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Handle CORS for browser-based requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check for Basic Authentication header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
      const [username, password] = credentials.split(':');
      
      if (!authenticateUser(username, password)) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
    } else {
      // Check body for credentials
      const { username, password } = req.body;
      
      if (!authenticateUser(username, password)) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
    }

    // Extract email data
    const { from, to, subject, body, html } = req.body;

    // Validate required fields
    if (!to || !subject || (!body && !html)) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, and body/html are required' 
      });
      return;
    }

    // Send email via Unsend
    const emailConfig = {
      to: Array.isArray(to) ? to : [to],
      from: from || `${SMTP_CREDENTIALS.username}`,
      subject,
      text: body,
      html: html || body
    };

    const result = await unsend.emails.send(emailConfig);

    res.status(200).json({
      success: true,
      messageId: result.id,
      data: result,
      smtp: {
        authenticated: true,
        server: 'smtp.soundways.org',
        port: 587
      }
    });

  } catch (error: unknown) {
    console.error('SMTP bridge error:', error);
    
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