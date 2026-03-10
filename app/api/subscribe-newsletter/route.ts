import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
const REPLY_TO_EMAIL = process.env.SMTP_REPLY_TO_EMAIL || FROM_EMAIL;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!FROM_EMAIL || !REPLY_TO_EMAIL) {
      return NextResponse.json(
        { error: 'Sender configuration is missing. Set SMTP_USER and optional SMTP_FROM_EMAIL/SMTP_REPLY_TO_EMAIL.' },
        { status: 500 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // HTML email template with design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Electivio</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(56, 189, 248, 0.2);">
                
                <!-- Header with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); padding: 40px 40px 60px; text-align: center; position: relative;">
                    <div style="background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="15" y="10" width="10" height="10" fill="white" rx="2"/>
                        <rect x="17" y="12" width="6" height="6" fill="#06b6d4"/>
                        <path d="M 10 25 Q 10 15 17 15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                        <path d="M 30 25 Q 30 15 23 15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                      Welcome Onboard! 🎉
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px; color: #e2e8f0;">
                    <h2 style="margin: 0 0 20px; color: #38bdf8; font-size: 24px; font-weight: 600;">
                      Thank You for Joining Electivio!
                    </h2>
                    
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                      We're thrilled to have you as part of our community. You've successfully subscribed to our newsletter and will be the first to know about:
                    </p>

                    <!-- Features List -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="padding: 15px; background: rgba(56, 189, 248, 0.1); border-left: 3px solid #06b6d4; margin-bottom: 10px; border-radius: 8px;">
                          <p style="margin: 0; color: #e2e8f0; font-size: 15px;">
                            <strong style="color: #38bdf8;">✨ New Programs:</strong> Fresh observership and elective opportunities
                          </p>
                        </td>
                      </tr>
                      <tr><td style="height: 10px;"></td></tr>
                      <tr>
                        <td style="padding: 15px; background: rgba(99, 102, 241, 0.1); border-left: 3px solid #6366f1; margin-bottom: 10px; border-radius: 8px;">
                          <p style="margin: 0; color: #e2e8f0; font-size: 15px;">
                            <strong style="color: #818cf8;">🚀 Platform Updates:</strong> New features and improvements
                          </p>
                        </td>
                      </tr>
                      <tr><td style="height: 10px;"></td></tr>
                      <tr>
                        <td style="padding: 15px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 8px;">
                          <p style="margin: 0; color: #e2e8f0; font-size: 15px;">
                            <strong style="color: #34d399;">💡 Tips & Insights:</strong> Application guidance and medical career advice
                          </p>
                        </td>
                      </tr>
                    </table>

                    <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; padding: 25px; margin: 30px 0;">
                      <p style="margin: 0 0 15px; color: #38bdf8; font-size: 18px; font-weight: 600;">
                        📬 Check Your Inbox
                      </p>
                      <p style="margin: 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Keep an eye on your email for updates from <strong style="color: #e2e8f0;">${FROM_EMAIL}</strong>. We promise to only send you valuable content — no spam!
                      </p>
                    </div>

                    <p style="margin: 20px 0 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                      If you have any questions or need assistance, feel free to reach out to us anytime.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 40px;" align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); border-radius: 12px; padding: 16px 40px;">
                          <a href="https://electivio-tau.vercel.app/programs" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                            Explore Programs
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background: rgba(15, 23, 42, 0.8); border-top: 1px solid rgba(56, 189, 248, 0.1); text-align: center;">
                    <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                      <strong style="color: #94a3b8;">Electivio</strong> — Your Gateway to Medical Training Opportunities
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 12px;">
                      Dubai, UAE | ${FROM_EMAIL}
                    </p>
                    <p style="margin: 15px 0 0; color: #475569; font-size: 11px;">
                      You're receiving this because you subscribed to Electivio updates.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Electivio" <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: email,
      subject: '🎉 Welcome to Electivio — You\'re All Set!',
      html: htmlContent,
    });

    return NextResponse.json(
      { message: 'Subscription successful! Check your inbox for a welcome message.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
