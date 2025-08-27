# SMTP Soundways Server

A simple SMTP server for Soundways using Unsend API, deployable on Vercel.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - The API key is already configured: `us_3cxeiuwcw3_288f1af221d7223cadf328f3eff8d3b7`

3. Run locally:
```bash
pnpm dev
```

4. Deploy to Vercel:
```bash
pnpm deploy
```

## API Usage

### Send Email Endpoint

**POST** `/api/send`

#### Request Body:
```json
{
  "to": "recipient@example.com",
  "subject": "Your Subject",
  "html": "<p>HTML content</p>",
  "text": "Plain text content",
  "from": "sender", // Optional, will use sender@notify.soundways.org
  "replyTo": "reply@example.com", // Optional
  "cc": ["cc@example.com"], // Optional
  "bcc": ["bcc@example.com"], // Optional
  "attachments": [{ // Optional
    "filename": "document.pdf",
    "content": "base64_encoded_content",
    "contentType": "application/pdf"
  }]
}
```

#### Response:
```json
{
  "success": true,
  "messageId": "msg_123456",
  "data": {
    // Additional response data from Unsend
  }
}
```

## Configuration

- **API Endpoint**: `https://mailer.soundways.org`
- **From Domain**: `notify.soundways.org`
- **Provider**: Unsend

## Security Notes

- Never commit the `.env.local` file with real API keys
- Use Vercel environment variables for production deployments
- The API key should be added as a secret in Vercel dashboard