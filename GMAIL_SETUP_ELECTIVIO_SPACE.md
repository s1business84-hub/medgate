# Gmail Setup Guide for electivio.space@gmail.com

This guide explains how to configure the application to send onboarding packs from your electivio.space Gmail account.

## Overview

The system can send emails from any Gmail account by configuring SMTP credentials. Currently configured for `electivio.app@gmail.com`, but you can easily switch to `electivio.space@gmail.com`.

## Prerequisites

- Access to electivio.space@gmail.com
- 2-Factor Authentication enabled on the Gmail account
- Ability to create App Passwords

## Step 1: Generate Gmail App Password

1. **Sign in to electivio.space@gmail.com**
   - Go to https://myaccount.google.com/

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Navigate to **Security** → **2-Step Verification**
   - Follow the prompts to set it up

3. **Generate an App Password**
   - Go to **Security** → **App passwords**
   - Or visit directly: https://myaccount.google.com/apppasswords
   - Select **Mail** as the app
   - Select **Other (Custom name)** as the device
   - Enter name: "Electivio Platform"
   - Click **Generate**
   - **Save the 16-character password** (e.g., `abcd efgh ijkl mnop`)

## Step 2: Configure Environment Variables

Create or update `.env.local` in the project root:

```bash
# Gmail SMTP Configuration for electivio.space
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=electivio.space@gmail.com
SMTP_PASS=your-16-char-app-password-here
```

### Important Notes:
- Remove spaces from the App Password (use `abcdefghijklmnop` not `abcd efgh ijkl mnop`)
- Use port 587 with `SMTP_SECURE=false` for TLS
- Or use port 465 with `SMTP_SECURE=true` for SSL

## Step 3: Update Gmail Text References (Optional)

The system will automatically use the email from `SMTP_USER`, but you may want to update text references in the UI:

### Update "For Hospitals" Page

File: `/workspaces/medgate/app/for-hospitals/page.tsx`

```tsx
// Change from:
We send onboarding steps from <span className="text-cyan-200">electivio.app@gmail.com</span>.

// To:
We send onboarding steps from <span className="text-cyan-200">electivio.space@gmail.com</span>.
```

### Update Footer

File: `/workspaces/medgate/components/sections/footer.tsx`

```tsx
// Change the email reference if displayed in footer
```

## Step 4: Test the Configuration

1. **Restart the development server:**
   ```bash
   npm run dev
   ```

2. **Test email sending:**
   - Go to `/for-hospitals`
   - Click "Request Onboarding Pack"  
   - Enter a test email
   - Check that emails arrive from electivio.space@gmail.com

3. **Or test via command line:**
   ```bash
   node test-email.js
   ```

## Step 5: Production Deployment (Vercel)

If deploying to Vercel, add environment variables:

```bash
vercel env add SMTP_HOST
# Enter: smtp.gmail.com

vercel env add SMTP_PORT  
# Enter: 587

vercel env add SMTP_SECURE
# Enter: false

vercel env add SMTP_USER
# Enter: electivio.space@gmail.com

vercel env add SMTP_PASS
# Enter: your-16-char-app-password
```

Then redeploy:
```bash
vercel --prod
```

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solutions:**
1. Verify 2FA is enabled on the Gmail account
2. Generate a new App Password (old ones may expire)
3. Ensure no spaces in the app password in .env.local
4. Try using port 465 with `SMTP_SECURE=true` instead

### Error: "Connection timeout"

**Solutions:**
1. Check your firewall/network settings
2. Verify you can access smtp.gmail.com:587
3. Try port 465 (SSL) instead of 587 (TLS)
4. Consider using Resend API instead (see below)

### Gmail Sending Limits

Gmail has daily sending limits:
- **Free accounts**: ~500 emails/day
- **Google Workspace**: ~2,000 emails/day

If you exceed limits, consider:
- Using Resend API (https://resend.com) - 100 emails/day free
- Using SendGrid, AWS SES, or another email service

## Alternative: Using Resend API

If Gmail doesn't work due to network restrictions, use Resend:

1. **Sign up at https://resend.com**

2. **Get API key from dashboard**

3. **Update .env.local:**
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

4. **Switch to Resend route (already created):**
   ```bash
   # The system will automatically use Resend if RESEND_API_KEY is set
   # and SMTP credentials are missing
   ```

## Security Best Practices

1. ✅ Never commit `.env.local` to version control
2. ✅ Use App Passwords, never your actual Gmail password
3. ✅ Rotate App Passwords periodically (every 3-6 months)
4. ✅ Use different App Passwords for dev/staging/production
5. ✅ Monitor Gmail's security alerts for suspicious activity

## Verification

After setup, verify:
- [x] Emails arrive in recipient inbox (not spam)
- [x] From address shows "electivio.space@gmail.com"
- [x] Email templates render correctly
- [x] Links in emails work properly
- [x] No console errors when sending

## Support

If issues persist:
1. Check Gmail's "Less secure app access" is NOT required (App Passwords bypass this)
2. Review Google Account activity for blocked sign-in attempts
3. Try generating a fresh App Password
4. Contact Google Workspace support if using a workspace account

---

**Quick Commands:**

```bash
# Test email configuration
node -e "console.log(require('dotenv').config()); console.log(process.env.SMTP_USER)"

# Check SMTP connection
telnet smtp.gmail.com 587
```

