#!/bin/bash

echo "🔧 MedGate Email Fix - Switch to Resend"
echo "======================================"
echo ""

# Check if RESEND_API_KEY is set
if grep -q "RESEND_API_KEY" .env.local 2>/dev/null; then
    echo "✅ RESEND_API_KEY found in .env.local"
else
    echo "❌ RESEND_API_KEY not found in .env.local"
    echo ""
    echo "Please add it:"
    echo "1. Sign up at https://resend.com"
    echo "2. Get your API key"
    echo "3. Add to .env.local:"
    echo "   RESEND_API_KEY=re_your_api_key_here"
    echo ""
    read -p "Do you want to add it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Resend API key: " api_key
        echo "" >> .env.local
        echo "RESEND_API_KEY=$api_key" >> .env.local
        echo "✅ Added RESEND_API_KEY to .env.local"
    else
        echo "Skipping... You'll need to add it manually."
        exit 1
    fi
fi

echo ""
echo "📦 Backing up current route file..."
if [ -f "app/api/send-onboarding-email/route.ts" ]; then
    cp app/api/send-onboarding-email/route.ts app/api/send-onboarding-email/route-nodemailer-backup.ts
    echo "✅ Backup created: route-nodemailer-backup.ts"
fi

echo ""
echo "🔄 Switching to Resend implementation..."
if [ -f "app/api/send-onboarding-email/route-resend.ts" ]; then
    mv app/api/send-onboarding-email/route-resend.ts app/api/send-onboarding-email/route.ts
    echo "✅ Now using Resend for email sending"
else
    echo "❌ route-resend.ts not found!"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Test the 'Request Onboarding Pack' button"
echo "3. Check your email inbox"
echo ""
echo "Note: Emails will be sent from onboarding@resend.dev"
echo "To use your own domain, verify it in Resend dashboard."
