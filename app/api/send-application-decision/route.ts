import { NextResponse, NextRequest } from "next/server"
import nodemailer from "nodemailer"

const FROM_EMAIL = process.env.SMTP_USER || "electivio.app@gmail.com"

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP configuration incomplete - using mock mode")
    return null
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

function buildDecisionEmail({
  studentName,
  decision,
  programName,
  hospitalName,
  reason,
  notes,
  actionUrl,
}: {
  studentName: string
  decision: "approved" | "declined" | "waitlisted"
  programName: string
  hospitalName: string
  reason?: string
  notes?: string
  actionUrl: string
}) {
  const decisionText = {
    approved: "Congratulations! Your application has been approved.",
    declined: "Thank you for your interest. Unfortunately, your application has been declined.",
    waitlisted: "Your application has been placed on the waitlist.",
  }

  const decisionColor = {
    approved: "#10b981", // green
    declined: "#ef4444", // red
    waitlisted: "#f59e0b", // amber
  }

  const ctaText = {
    approved: "View Application Status",
    declined: "Submit Another Application",
    waitlisted: "View Waitlist Status",
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Application Decision</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .decision-box { background: ${decisionColor[decision]}; color: white; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center; font-size: 18px; font-weight: 600; }
        .content { background: white; border: 1px solid #e5e7eb; padding: 30px; }
        .details { background: #f9fafb; padding: 15px; border-left: 4px solid ${decisionColor[decision]}; margin: 20px 0; border-radius: 4px; }
        .detail-row { margin: 10px 0; }
        .detail-label { font-weight: 600; color: #666; }
        .reason-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .notes-box { background: #f3f4f6; border-left: 4px solid #6b7280; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .cta-button { display: inline-block; background: ${decisionColor[decision]}; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: 700; color: white; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Electivio</div>
          <p style="margin: 10px 0; opacity: 0.9;">Medical Observership & Elective Platform</p>
        </div>

        <div class="content">
          <p>Dear ${studentName},</p>

          <div class="decision-box">
            ${decisionText[decision]}
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Program:</span> ${programName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Hospital:</span> ${hospitalName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Decision:</span> <strong style="color: ${decisionColor[decision]}">${decision.charAt(0).toUpperCase() + decision.slice(1)}</strong>
            </div>
          </div>

          ${reason ? `
            <div class="reason-box">
              <strong>Decision Reason:</strong><br />
              ${reason}
            </div>
          ` : ""}

          ${notes ? `
            <div class="notes-box">
              <strong>Additional Notes:</strong><br />
              ${notes}
            </div>
          ` : ""}

          <p style="text-align: center; margin-top: 30px;">
            <a href="${actionUrl}" class="cta-button">${ctaText[decision]}</a>
          </p>

          <p style="color: #666; font-size: 14px;">
            If you have any questions about your application decision, please don't hesitate to reach out to us at <strong>support@electivio.com</strong> or reply to this email.
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0;">© 2026 Electivio. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Medical Observership & Elective Platform</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentEmail, studentName, decision, programName, hospitalName, reason, notes, actionUrl } = body

    // Validate required fields
    if (!studentEmail || !studentName || !decision || !programName || !hospitalName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Mock email sending if SMTP is not configured
    const transporter = getTransporter()
    if (!transporter) {
      console.log("📧 [MOCK] Email would be sent to:", studentEmail)
      console.log("📧 [MOCK] Decision:", decision)
      return NextResponse.json({
        success: true,
        message: "Email would be sent (mock mode)",
        studentEmail,
        decision,
      })
    }

    // Send real email
    const htmlContent = buildDecisionEmail({
      studentName,
      decision,
      programName,
      hospitalName,
      reason,
      notes,
      actionUrl: actionUrl || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/student`,
    })

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: studentEmail,
      subject: `Application Decision: ${decision.charAt(0).toUpperCase() + decision.slice(1)} for ${programName}`,
      html: htmlContent,
    })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      studentEmail,
      decision,
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    )
  }
}
