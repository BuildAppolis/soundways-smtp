import { VercelRequest, VercelResponse } from '@vercel/node';

const SMTP_CREDENTIALS = {
  username: process.env.SMTP_USERNAME || 'soundways',
  password: process.env.SMTP_PASSWORD || '75cc4d20f15b370a245cfc905b37a69a'
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Test authentication
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
      const [username, password] = credentials.split(':');
      
      if (username === SMTP_CREDENTIALS.username && password === SMTP_CREDENTIALS.password) {
        res.status(200).json({ 
          success: true, 
          message: 'Authentication successful',
          server: 'smtp.soundways.org',
          port: 587
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Authorization header required' 
      });
    }
  } else {
    // GET request returns server info
    res.status(200).json({
      server: 'smtp.soundways.org',
      port: 587,
      security: 'STARTTLS',
      authentication: 'Required',
      status: 'Active',
      test_endpoint: 'POST to this endpoint with Basic Auth to test credentials'
    });
  }
}