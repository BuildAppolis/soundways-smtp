import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // SMTP Configuration details for clients
  const config = {
    smtp: {
      provider: 'Soundways SMTP',
      server: 'smtp.soundways.org',
      port: 587,
      security: 'STARTTLS',
      authentication: 'Basic',
      username: 'soundways',
      endpoints: {
        send: 'https://smtp.soundways.org/api/smtp',
        test: 'https://smtp.soundways.org/api/test'
      }
    },
    api: {
      endpoint: 'https://smtp.soundways.org/api/send',
      authentication: 'API Key or Basic Auth',
      documentation: 'https://github.com/BuildAppolis/soundways-smtp'
    },
    supported_features: [
      'HTML emails',
      'Plain text emails',
      'Multiple recipients',
      'CC/BCC',
      'Attachments (base64)',
      'Custom from addresses'
    ]
  };

  res.status(200).json(config);
}