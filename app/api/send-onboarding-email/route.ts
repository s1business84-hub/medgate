import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const SMTP_AUTH_USER = process.env.SMTP_USER
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_AUTH_USER
const REPLY_TO_EMAIL = process.env.SMTP_REPLY_TO_EMAIL || FROM_EMAIL
const FROM_HEADER = `Electivio <${FROM_EMAIL}>`

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.")
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

type EmailVariant = "welcome-student" | "welcome-hospital" | "onboarding-pack"

function buildHtmlTemplate({
  title,
  headline,
  subhead,
  highlights,
  calloutTitle,
  calloutBody,
  ctaLabel = "Explore Programs",
  ctaHref = "https://electivio-tau.vercel.app/programs",
}: {
  title: string
  headline: string
  subhead: string
  highlights: Array<{ label: string; text: string; color: string; border: string }>
  calloutTitle: string
  calloutBody: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(56, 189, 248, 0.2);">
              <tr>
                <td style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); padding: 40px 40px 60px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.12); width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <svg width="42" height="42" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="15" y="10" width="10" height="10" fill="white" rx="2"/>
                      <rect x="17" y="12" width="6" height="6" fill="#06b6d4"/>
                      <path d="M 10 25 Q 10 15 17 15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                      <path d="M 30 25 Q 30 15 23 15" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${headline}</h1>
                  <p style="margin: 12px 0 0; color: #e0f2fe; font-size: 15px; line-height: 1.5;">${subhead}</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px; color: #e2e8f0;">
                  <h2 style="margin: 0 0 18px; color: #38bdf8; font-size: 22px; font-weight: 600;">Here's what to expect</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 12px 0 24px;">
                    ${highlights
                      .map(
                        (item) => `
                        <tr>
                          <td style="padding: 14px; background: ${item.color}; border-left: 3px solid ${item.border}; margin-bottom: 10px; border-radius: 10px;">
                            <p style="margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.5;">
                              <strong style="color: ${item.border};">${item.label}</strong> ${item.text}
                            </p>
                          </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                      `
                      )
                      .join("")}
                  </table>

                  <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; padding: 22px; margin: 18px 0 26px;">
                    <p style="margin: 0 0 10px; color: #38bdf8; font-size: 17px; font-weight: 600;">${calloutTitle}</p>
                    <p style="margin: 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">${calloutBody}</p>
                  </div>

                  <div style="text-align: center; padding: 6px 0 12px;">
                    <a href="${ctaHref}" style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); color: white; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 38px; border-radius: 12px; display: inline-block; box-shadow: 0 15px 40px rgba(6,182,212,0.25);">
                      ${ctaLabel}
                    </a>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 26px 40px; background: rgba(15, 23, 42, 0.82); border-top: 1px solid rgba(56, 189, 248, 0.12); text-align: center;">
                  <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px; font-weight: 600;">Electivio — Gateway to Medical Training Opportunities</p>
                  <p style="margin: 0; color: #64748b; font-size: 12px;">Dubai, UAE | ${FROM_EMAIL}</p>
                  <p style="margin: 12px 0 0; color: #475569; font-size: 11px;">You are receiving this email because you requested onboarding or created an account on Electivio.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function buildEmailContent(type: EmailVariant, email: string, name?: string) {
  if (type === "welcome-student") {
    const subject = "Welcome to Electivio — Early Access Confirmed"
    const html = buildHtmlTemplate({
      title: subject,
      headline: "Welcome Onboard! 🎉",
      subhead: `Hi ${name || "there"}, thanks for joining early access.`,
      highlights: [
        { label: "✨ New Programs:", text: "First look at observerships and electives as they open.", color: "rgba(56, 189, 248, 0.1)", border: "#06b6d4" },
        { label: "🚀 Platform Updates:", text: "Feature drops and improvements tailored for students.", color: "rgba(99, 102, 241, 0.1)", border: "#6366f1" },
        { label: "💡 Guidance:", text: "Application tips, visa guidance, and preparation checklists.", color: "rgba(16, 185, 129, 0.1)", border: "#10b981" },
      ],
      calloutTitle: "📬 Check Your Inbox",
      calloutBody: `We will notify you from <strong style="color:#e2e8f0;">${FROM_EMAIL}</strong> as soon as programs go live.`,
      ctaLabel: "Browse Programs",
      ctaHref: "https://electivio-tau.vercel.app/programs",
    })
    const text = `Welcome to Electivio! You'll receive early access updates from ${FROM_EMAIL}.`
    return { subject, html, text }
  }

  if (type === "welcome-hospital") {
    const subject = "Electivio Hospital Portal — Account Ready"
    const html = buildHtmlTemplate({
      title: subject,
      headline: "Welcome Onboard! 🎉",
      subhead: `Hi ${name || "Team"}, your hospital account is set. Let's configure your onboarding.`,
      highlights: [
        { label: "👥 Team Setup:", text: "Set coordinator and approver contacts for applications.", color: "rgba(56, 189, 248, 0.1)", border: "#06b6d4" },
        { label: "✅ Eligibility:", text: "Define applicant rules and required documents.", color: "rgba(99, 102, 241, 0.1)", border: "#6366f1" },
        { label: "📅 Capacity:", text: "Add intake windows and seats per period for observerships/electives.", color: "rgba(16, 185, 129, 0.1)", border: "#10b981" },
      ],
      calloutTitle: "Next Steps",
      calloutBody: "Share your program details and intake preferences. We'll activate your workspace and listing templates.",
      ctaLabel: "Open Hospital Portal",
      ctaHref: "https://electivio-tau.vercel.app/hospital",
    })
    const text = `Your Electivio hospital account is ready. Configure eligibility, contacts, and intake to go live.`
    return { subject, html, text }
  }

  const subject = "Electivio Hospital Onboarding Pack"
  const html = buildHtmlTemplate({
    title: subject,
    headline: "Welcome Onboard! 🎉",
    subhead: "Thanks for requesting the onboarding pack. Here are your next steps.",
    highlights: [
      { label: "👤 Contacts:", text: "Confirm primary coordinator and approver roles.", color: "rgba(56, 189, 248, 0.1)", border: "#06b6d4" },
      { label: "📑 Eligibility:", text: "Define applicant criteria and document checklist.", color: "rgba(99, 102, 241, 0.1)", border: "#6366f1" },
      { label: "📈 Intake:", text: "Share capacity, application windows, and review timelines.", color: "rgba(16, 185, 129, 0.1)", border: "#10b981" },
    ],
    calloutTitle: "Share Details",
    calloutBody: `Reply to this email or contact <strong style="color:#e2e8f0;">${FROM_EMAIL}</strong> with your program specs and we\'ll provision your workspace.`,
    ctaLabel: "View Hospital Info",
    ctaHref: "https://electivio-tau.vercel.app/for-hospitals",
  })
  const text = "Thanks for requesting the Electivio onboarding pack. Reply with your contacts, eligibility, and intake details."
  return { subject, html, text }
}

export async function POST(req: Request) {
  try {
    const { email, type = "onboarding-pack", name } = await req.json()

    if (!FROM_EMAIL || !REPLY_TO_EMAIL) {
      return NextResponse.json({
        error: "Sender configuration is missing. Set SMTP_USER and optional SMTP_FROM_EMAIL/SMTP_REPLY_TO_EMAIL.",
      }, { status: 500 })
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Attempting to send email to:", email, "Type:", type)

    const mail = buildEmailContent(type as EmailVariant, email, name)

    try {
      const transporter = getTransporter()
      console.log("Transporter created successfully")

      const info = await transporter.sendMail({
        from: FROM_HEADER,
        replyTo: REPLY_TO_EMAIL,
        to: email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      })

      console.log("Email sent successfully:", info.messageId)
      return NextResponse.json({ ok: true, messageId: info.messageId })
    } catch (error) {
      console.error("Email send failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return NextResponse.json({ 
        error: "Failed to send email", 
        details: errorMessage 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Request processing failed:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to process request", 
      details: errorMessage 
    }, { status: 500 })
  }
}
