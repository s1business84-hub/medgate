

































































































































































































































































































































































# Email Setup Guide for Electivio

## Issue Identified
The SMTP connection to Gmail is timing out due to network restrictions. This is common when:
- Your network/firewall blocks SMTP ports (465, 587)
- VPN is active and blocking SMTP
- ISP blocks outgoing SMTP connections
- Gmail requires additional security setup

## Solutions

### Option 1: Use Resend (Recommended for Development)
Resend is a modern email API that's easier to set up and doesn't have the same network restrictions.

1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Get your API key
3. Install: `npm install resend`
4. Update `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Option 2: Use SendGrid
SendGrid is another reliable option with a generous free tier.

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Install: `npm install @sendgrid/mail`
4. Update `.env.local`:
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Option 3: Fix Gmail SMTP (If Network Allows)

#### Check Network Restrictions
1. **Disable VPN** if you're using one
2. **Check Firewall Settings** - ensure ports 465 or 587 are not blocked
3. **Try a different network** (mobile hotspot, different WiFi)

#### Gmail App Password Setup
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication if not already enabled
3. Go to "App passwords" section
4. Generate a new app password for "Mail"
5. Use that 16-character password in `.env.local` instead of your regular password

#### Verify Gmail Settings
Ensure "Less secure app access" is not required by using an App Password.

### Option 4: Development Mode (Mock Emails)
For local development, you can use a mock email service that logs emails instead of sending them:

1. Install: `npm install nodemailer-mock`
2. This logs emails to console instead of sending them

## Quick Fix: Use Resend

I'll implement Resend as it's the fastest solution for your case.

## Testing
After setup, run:
```bash
node test-email.js
```

## Current Configuration
- SMTP Host: smtp.gmail.com
- SMTP Port: 587 (TLS) or 465 (SSL)
- Issue: Network timeout - cannot reach Gmail SMTP servers

## Next Steps
Choose one of the options above and I can help implement it.
