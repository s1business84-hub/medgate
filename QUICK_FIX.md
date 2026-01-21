# Quick Fix Guide - Email Not Sending

## 🚨 Problem
"Request Onboarding Pack" button shows error: "Unable to send onboarding steps. Please try again."

## 🔍 Root Cause
Your network is blocking Gmail SMTP servers (timeout on smtp.gmail.com:587/465)

## ⚡ Quick Solution (5 minutes)

### Step 1: Get Resend API Key
```
1. Go to: https://resend.com
2. Sign up (free)
3. Create API key
4. Copy the key (starts with "re_")
```

### Step 2: Add to Environment
```bash
# Edit .env.local and add:
RESEND_API_KEY=re_your_key_here
```

### Step 3: Run Setup Script
```bash
cd /Users/sanskaarnair/Desktop/electivio
./switch-to-resend.sh
```

### Step 4: Restart Server
```bash
npm run dev
```

### Step 5: Test
1. Go to http://localhost:3000/for-hospitals
2. Enter email
3. Click "Request Onboarding Pack"
4. Check inbox (email from onboarding@resend.dev)

## 📋 Manual Setup (if script fails)

```bash
# Backup current file
cp app/api/send-onboarding-email/route.ts app/api/send-onboarding-email/route-backup.ts

# Use Resend version
mv app/api/send-onboarding-email/route-resend.ts app/api/send-onboarding-email/route.ts

# Add API key to .env.local
echo "RESEND_API_KEY=re_your_key" >> .env.local

# Restart
npm run dev
```

## ✅ What's Been Fixed

1. ✅ Identified network timeout issue
2. ✅ Added detailed error logging
3. ✅ Created Resend implementation
4. ✅ Improved error handling
5. ✅ Created automatic setup script

## 🔧 Alternative: Fix Gmail (Advanced)

If you want to use Gmail instead:

1. **Disable VPN** (if using one)
2. **Try different network** (mobile hotspot)
3. **Generate App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2FA
   - Create App Password
   - Use in .env.local
4. **Test:** `node test-email.js`

## 📝 Files Created/Modified

- ✅ `EMAIL_FIX_SUMMARY.md` - Detailed explanation
- ✅ `EMAIL_SETUP_GUIDE.md` - Full setup guide
- ✅ `QUICK_FIX.md` - This file
- ✅ `switch-to-resend.sh` - Automated setup
- ✅ `test-email.js` - Email testing tool
- ✅ `route-resend.ts` - New implementation
- ✅ `route.ts` - Enhanced error handling

## 🆘 Still Having Issues?

Check console logs:
```bash
# Browser console (F12)
# Look for: "Email API error:"

# Server console
# Look for: "Email send failed:"
```

Common issues:
- ❌ API key not set → Add RESEND_API_KEY to .env.local
- ❌ Server not restarted → Kill and restart npm run dev
- ❌ Wrong API key → Verify it starts with "re_"
- ❌ Rate limit → Free tier: 100 emails/day

## 🚀 Production Deployment

When deploying to Vercel:
```bash
# Add environment variable in Vercel dashboard
RESEND_API_KEY=re_your_key

# Or via CLI
vercel env add RESEND_API_KEY
```

## 💡 Why Resend?

- ✅ No network/firewall issues (uses HTTPS)
- ✅ No SMTP port restrictions
- ✅ Simple API
- ✅ Free tier: 100 emails/day
- ✅ Better deliverability
- ✅ Great for development

---

**Need help?** Check `EMAIL_FIX_SUMMARY.md` for detailed explanation.
