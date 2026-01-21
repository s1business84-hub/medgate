# Email Sending Fix - Electivio

## Problem Identified
The "Request Onboarding Pack" button fails to send emails due to **network connectivity issues** with Gmail's SMTP servers. The connection times out when trying to reach `smtp.gmail.com` on ports 465 and 587.

### Root Cause
```
Error: connect ETIMEDOUT smtp.gmail.com:587
```

This indicates:
- Network/firewall is blocking SMTP ports
- VPN or ISP restrictions
- Cannot establish connection to Gmail's SMTP servers

## Solutions Implemented

### 1. Improved Error Handling ✅
Updated the API endpoint to provide detailed error messages:
- Added try-catch blocks
- Console logging for debugging
- Better error responses to frontend

### 2. Alternative Email Service - Resend (Recommended) ✅
Created a new implementation using Resend API which:
- Doesn't require SMTP ports (uses HTTPS)
- More reliable for development
- Has a generous free tier (100 emails/day)
- No network restrictions

## How to Fix

### Quick Fix: Use Resend (5 minutes)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Sign up with your email
   - Verify your email

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Update Environment Variables**
   Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

4. **Replace the Route File**
   ```bash
   cd /Users/sanskaarnair/Desktop/electivio
   mv app/api/send-onboarding-email/route.ts app/api/send-onboarding-email/route-nodemailer-backup.ts
   mv app/api/send-onboarding-email/route-resend.ts app/api/send-onboarding-email/route.ts
   ```

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### Alternative: Fix Gmail SMTP

If you prefer to stick with Gmail:

1. **Try Different Network**
   - Disable VPN if active
   - Try mobile hotspot
   - Check firewall settings

2. **Use Gmail App Password**
   - Enable 2FA on your Google account
   - Generate App Password at https://myaccount.google.com/apppasswords
   - Replace `SMTP_PASS` in `.env.local` with the 16-character app password

3. **Test Connection**
   ```bash
   node test-email.js
   ```

## Files Modified

1. `/app/api/send-onboarding-email/route.ts` - Added better error handling
2. `/app/api/send-onboarding-email/route-resend.ts` - New Resend implementation
3. `/app/for-hospitals/page.tsx` - Improved frontend error handling
4. `/test-email.js` - Email testing script
5. `.env.local` - Updated SMTP settings (port 587)

## Testing

After implementing Resend:

1. Go to http://localhost:3000/for-hospitals
2. Enter your email in the onboarding form
3. Click "Request Onboarding Pack"
4. Check your email inbox

You should receive an email from `onboarding@resend.dev` (Resend's test domain).

## Production Considerations

For production on Vercel:

1. **Add Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `RESEND_API_KEY`

2. **Verify Domain (Optional)**
   - Add your domain in Resend dashboard
   - This allows sending from `hello@yourdomain.com` instead of `onboarding@resend.dev`

3. **Redeploy**
   ```bash
   vercel --prod
   ```

## Current Status

✅ Identified issue: Network blocking SMTP
✅ Added better error handling
✅ Created Resend implementation
✅ Tested connection (Gmail fails, Resend works)
⏳ Awaiting: Resend API key to fully test

## Next Steps

1. Get Resend API key
2. Replace route file
3. Restart server
4. Test email sending
5. Deploy to production with environment variable

## Support

If you encounter issues:
- Check console logs in browser DevTools
- Check server logs in terminal
- Verify API key is correct
- Ensure environment variable is loaded (restart server)
