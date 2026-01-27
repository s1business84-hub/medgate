/**
 * Application Decision Service
 * 
 * Handles the complete workflow of approving, declining, or waitlisting
 * student applications with:
 * - Email notifications to students
 * - In-app notifications
 * - Audit logging
 * - Status updates
 */

import {
  createApplicationDecision,
  createNotification,
  updateApplicationStatus,
  updateStaffAlertStatus,
  getApplications,
  getStudents,
  logAudit,
} from "@/lib/storage"
import { ApplicationDecision } from "@/lib/types"

interface ApplicationDecisionInput {
  applicationId: string
  studentId: string
  hospitalId: string
  decision: "approved" | "declined" | "waitlisted"
  decisionMadeBy: string
  reason?: string
  notes?: string
  staffAlertId?: string
  studentEmail?: string
  programName?: string
  hospitalName?: string
}

export async function processApplicationDecision(
  input: ApplicationDecisionInput
): Promise<{
  success: boolean
  error?: string
  decision?: ApplicationDecision
}> {
  try {
    const {
      applicationId,
      studentId,
      hospitalId,
      decision,
      decisionMadeBy,
      reason,
      notes,
      staffAlertId,
      studentEmail,
      programName,
      hospitalName,
    } = input

    // Map decision to application status
    const statusMap = {
      approved: "Approved" as const,
      declined: "Declined" as const,
      waitlisted: "Waitlisted" as const,
    }

    const newStatus = statusMap[decision]

    // 1. Create decision record
    const applicationDecision = createApplicationDecision({
      applicationId,
      studentId,
      hospitalId,
      decision,
      decisionMadeby: decisionMadeBy,
      decisionAt: new Date().toISOString(),
      reason,
      notes,
    })

    // 2. Update application status
    const updated = updateApplicationStatus(applicationId, newStatus, notes)
    if (!updated) {
      throw new Error("Failed to update application status")
    }

    // 3. Get student info (for email)
    const students = getStudents()
    const student = students.find(s => s.id === studentId)
    const studentContactEmail = studentEmail || student?.email

    // 4. Send email notification to student
    if (studentContactEmail) {
      const actionUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/student`

      try {
        const emailResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-application-decision`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentEmail: studentContactEmail,
              studentName: student?.name || "Student",
              decision,
              programName: programName || "Program",
              hospitalName: hospitalName || "Hospital",
              reason,
              notes,
              actionUrl,
            }),
          }
        )

        if (emailResponse.ok) {
          // Update decision record with email sent timestamp
          applicationDecision.emailSentAt = new Date().toISOString()
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Continue even if email fails
      }
    }

    // 5. Create in-app notification for student
    const notificationMessage = {
      approved: `Congratulations! Your application for ${programName} has been approved.`,
      declined: `Your application for ${programName} has been declined. Please review the feedback and consider applying to other programs.`,
      waitlisted: `Your application for ${programName} has been placed on the waitlist. We'll update you if a spot becomes available.`,
    }

    const notification = createNotification({
      userId: studentId,
      type: "application_review",
      title: `Application ${decision.charAt(0).toUpperCase() + decision.slice(1)}`,
      message: notificationMessage[decision],
      relatedApplicationId: applicationId,
    })

    applicationDecision.appNotificationSentAt = notification.createdAt

    // 6. Update staff alert if provided
    if (staffAlertId) {
      try {
        updateStaffAlertStatus(staffAlertId, decision)
      } catch (alertError) {
        console.error("Error updating staff alert:", alertError)
      }
    }

    // 7. Audit log
    try {
      logAudit({
        userId: decisionMadeBy,
        action: `application:decision:${decision}`,
        details: `Decision made on application ${applicationId} for student ${studentId}. Reason: ${reason || "N/A"} Notes: ${notes || "N/A"}`,
      })
    } catch (auditError) {
      console.error("Error logging audit:", auditError)
    }

    return {
      success: true,
      decision: applicationDecision,
    }
  } catch (error) {
    console.error("Application decision processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process application decision",
    }
  }
}

/**
 * Get decision details with full context
 */
export function getApplicationDecisionContext(applicationId: string) {
  const applications = getApplications()
  const students = getStudents()

  const application = applications.find(a => a.id === applicationId)
  if (!application) return null

  const student = students.find(s => s.id === application.studentId)

  return {
    application,
    student,
  }
}

/**
 * Generate decision email preview
 */
export function generateDecisionEmailPreview(input: ApplicationDecisionInput) {
  const { decision, reason, notes } = input

  return {
    subject: `Application Decision: ${decision.charAt(0).toUpperCase() + decision.slice(1)} for ${input.programName}`,
    preview: `Your application for ${input.programName} at ${input.hospitalName} has been ${decision}${reason ? `. Reason: ${reason}` : "."}`,
  }
}
