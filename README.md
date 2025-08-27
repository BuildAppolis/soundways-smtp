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

## SMTP Configuration

For email clients (Outlook, Gmail, Thunderbird, etc.):

### SMTP Settings
- **SMTP Server**: `smtp.soundways.org`
- **Port**: `587`
- **Security**: `STARTTLS` or `TLS`
- **Authentication**: Required
- **Username**: `notifications@soundways.org`
- **Password**: `soundways-smtp-2024`

### API Endpoints

1. **SMTP Bridge** `/api/smtp` - Accepts authenticated SMTP-style requests
2. **Direct Send** `/api/send` - Original API endpoint
3. **Test Auth** `/api/test` - Test SMTP credentials
4. **Config** `/api/config` - Get server configuration

## Configuration

- **API Endpoint**: `https://mailr.buildappolis.com`
- **From Domain**: `notify.soundways.org`
- **Provider**: Unsend (self-hosted)

## Security Notes

- Never commit the `.env.local` file with real API keys
- Use Vercel environment variables for production deployments
- The API key should be added as a secret in Vercel dashboard