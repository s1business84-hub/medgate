# Application Decision & Notification System

## Overview

This document describes the complete workflow for notifying hospital staff of new student applications, enabling them to make decisions (approve/decline/waitlist), and automatically notifying students via email and in-app notifications.

## System Architecture

```
Student Submits Application
    ↓
createApplication() triggered
    ↓
Staff Alert Created (auto)
    ↓
Hospital Staff Portal Updated
    ↓
Alert appears in StaffApplicationAlerts component
    ↓
Staff Opens Alert → ApplicationDecisionModal
    ↓
Staff Makes Decision (Approve/Decline/Waitlist)
    ↓
processApplicationDecision() executes
    ├─ Create ApplicationDecision record
    ├─ Update Application status
    ├─ Send Decision Email to Student
    ├─ Create In-App Notification
    ├─ Log Audit Entry
    └─ Update Staff Alert Status
    ↓
Student Receives Email & App Notification
    ↓
Hospital Dashboard Updates in Real-Time
```

## Key Components

### 1. StaffApplicationAlerts Component
**File**: `/components/staff-application-alerts.tsx`

Displays pending applications with real-time status tracking:
- Unread alert indicators with pulse animation
- Filter by status (Pending, Approved, Declined, Waitlisted)
- Quick stats dashboard (pending count, approved, etc.)
- Expandable alert details with student info
- One-click actions to open decision modal

**Props**:
```typescript
interface StaffApplicationAlertsProps {
  alerts: StaffApplicationAlert[]
  onApprove?: (alertId: string) => void
  onDecline?: (alertId: string) => void
  onWaitlist?: (alertId: string) => void
  onMarkAsRead?: (alertId: string, staffId: string) => void
  staffId: string
  loading?: boolean
}
```

### 2. ApplicationDecisionModal Component
**File**: `/components/application-decision-modal.tsx`

Modal interface for staff to make application decisions:
- Three decision options: Approve, Waitlist, Decline
- Rich reason text field (shown to student)
- Internal notes field (staff-only)
- Real-time form validation
- Loading state during submission
- Info box explaining notification workflow

**Key Features**:
- Displays student profile information
- Shows application ID and program details
- Sends decision via `processApplicationDecision()` function
- Handles email and notification creation
- Auto-closes and reloads after successful decision

### 3. API Endpoint: Send Application Decision Email
**File**: `/app/api/send-application-decision/route.ts`

Handles email notifications when decisions are made:

```typescript
POST /api/send-application-decision
{
  studentEmail: string
  studentName: string
  decision: "approved" | "declined" | "waitlisted"
  programName: string
  hospitalName: string
  reason?: string          // Shown to student
  notes?: string          // Internal staff notes (not sent)
  actionUrl?: string      // Link in email
}
```

**Features**:
- Beautiful HTML email templates
- Decision-specific colors and messaging
- Conditional sections for reasons/notes
- Mock mode support (logs to console if SMTP not configured)
- Nodemailer integration for real emails

### 4. Application Decision Service
**File**: `/lib/application-decision-service.ts`

Core business logic orchestrating the entire decision workflow:

```typescript
export async function processApplicationDecision(
  input: ApplicationDecisionInput
): Promise<{ success: boolean; error?: string; decision?: ApplicationDecision }>
```

**Workflow**:
1. Create `ApplicationDecision` record for audit trail
2. Update application status (Approved/Declined/Waitlisted)
3. Send decision email to student
4. Create in-app notification
5. Update staff alert status
6. Log audit entry

### 5. Storage Layer Extensions
**File**: `/lib/storage.ts`

New functions added to support decision tracking:

```typescript
// Create decision record
createApplicationDecision(input): ApplicationDecision

// Query decisions
getApplicationDecisions(): ApplicationDecision[]
getApplicationDecision(applicationId: string): ApplicationDecision | null
getApplicationDecisionsByHospital(hospitalId: string): ApplicationDecision[]

// Staff alerts
createStaffAlert(input): StaffApplicationAlert
getStaffAlerts(): StaffApplicationAlert[]
getStaffAlertsByHospital(hospitalId: string): StaffApplicationAlert[]
getPendingApplicationAlerts(hospitalId: string): StaffApplicationAlert[]
markStaffAlertAsRead(alertId: string, staffId: string): StaffApplicationAlert | null
updateStaffAlertStatus(alertId: string, status): StaffApplicationAlert | null
```

## Data Types

### ApplicationDecision
```typescript
interface ApplicationDecision {
  id: string
  applicationId: string
  studentId: string
  hospitalId: string
  decision: "approved" | "declined" | "waitlisted"
  decisionMadeby: string  // Staff ID who made decision
  decisionAt: string      // ISO timestamp
  reason?: string         // Reason shown to student
  notes?: string          // Internal staff notes
  emailSentAt?: string    // When email was sent
  appNotificationSentAt?: string  // When in-app notification was created
}
```

### StaffApplicationAlert
```typescript
interface StaffApplicationAlert {
  id: string
  hospitalId: string
  applicationId: string
  studentId: string
  studentName: string
  studentEmail: string
  programId: string
  submittedAt: string     // When application was submitted
  readBy: string[]        // Array of staff IDs who have read
  status: "pending" | "approved" | "declined" | "waitlisted"
  alertCreatedAt: string  // When alert was created
}
```

## Integration Points

### Hospital Portal (`/app/hospital/page.tsx`)

1. **Alert Display**:
```tsx
{showAlerts && staffAlerts.length > 0 && (
  <StaffApplicationAlerts
    alerts={staffAlerts}
    staffId={user?.id}
    onApprove/Decline/Waitlist={handleDecisionModalOpen}
    onMarkAsRead={handleMarkAsRead}
  />
)}
```

2. **Decision Modal**:
```tsx
<ApplicationDecisionModal
  isOpen={showDecisionModal}
  alert={selectedAlert}
  application={selectedApp}
  student={selectedStudent}
  staffId={user?.id}
  onDecisionMade={refreshApplications}
/>
```

3. **Auto-Alert Creation** (`/lib/storage.ts`):
When `createApplication()` is called, it automatically creates a `StaffApplicationAlert`:
```typescript
if (app.hospitalId) {
  createStaffAlert({
    hospitalId: app.hospitalId,
    applicationId: app.id,
    studentId: app.studentId,
    studentName: student.name,
    studentEmail: student.email,
    programId: input.programId,
    submittedAt: app.submissionDate,
  })
}
```

## Email Templates

### Decision Email Structure

```html
Header Section:
- Electivio branding
- Welcome message

Decision Box:
- Color-coded by decision type
- Bold decision message
- Program and hospital details

Details Section:
- Program name
- Hospital name
- Decision type with color

Optional Sections:
- Decision Reason (if provided)
- Internal Notes (if provided, but hidden from student)

Call-to-Action:
- Decision-specific button text
- Link to student dashboard

Footer:
- Support contact email
- Copyright info
```

## Decision Email Examples

### Approved Email
```
Subject: Application Decision: Approved for [Program Name]

Dear [Student Name],

Congratulations! Your application has been approved.

Program: [Program Name]
Hospital: [Hospital Name]
Decision: Approved

[Optional Reason Box]

Your next steps:
1. Check your application dashboard for program details
2. Review any onboarding requirements
3. Contact [Hospital] directly for start date confirmation

Support: support@electivio.com
```

### Declined Email
```
Subject: Application Decision: Declined for [Program Name]

Dear [Student Name],

Thank you for your interest. Unfortunately, your application has been declined.

Program: [Program Name]
Hospital: [Hospital Name]
Decision: Declined

Decision Reason: [If Provided]

We encourage you to:
1. Review other available programs on Electivio
2. Consider applying to similar programs at other hospitals
3. Reach out if you'd like feedback (optional)

Support: support@electivio.com
```

### Waitlisted Email
```
Subject: Application Decision: Waitlisted for [Program Name]

Dear [Student Name],

Your application has been placed on the waitlist.

Program: [Program Name]
Hospital: [Hospital Name]
Decision: Waitlisted

We will update you if a spot becomes available. In the meantime,
you can continue exploring other opportunities on Electivio.

Support: support@electivio.com
```

## User Experience Flow

### For Hospital Staff

1. **Alert Notification**:
   - Staff sees unread alert indicator in hospital portal sidebar
   - Alert count badge shows pending applications
   - Can toggle alert visibility

2. **Review Alert**:
   - Click "Show Alerts" to expand alert panel
   - See all pending applications with student names and program info
   - Alerts colored by status (pending = cyan, approved = green, etc.)

3. **Make Decision**:
   - Click alert to expand details
   - View student email, submission date, program info
   - Click action button (Approve/Decline/Waitlist)
   - Decision modal opens

4. **Decide & Notify**:
   - Select decision type
   - Enter reason (recommended, shown to student)
   - Add internal notes (staff-only, not sent)
   - Click "Send Decision"
   - Email sent automatically
   - In-app notification created
   - Alert status updates

5. **View History**:
   - Filter alerts by status
   - See which alerts have been actioned
   - Track decision timeline

### For Students

1. **Application Submitted**:
   - Application status shows "Submitted"
   - Staff alert created automatically
   - Hospital staff notified

2. **Decision Received**:
   - In-app notification appears immediately
   - Email arrives with detailed decision
   - Application status updates in dashboard

3. **Next Steps**:
   - Click notification to view application details
   - Read decision reason if provided
   - Approved: See onboarding steps
   - Declined: Browse other programs
   - Waitlisted: Receive update if spot opens

## Notifications

### In-App Notifications
Created in `lib/storage.ts` via `createNotification()`:

```typescript
createNotification({
  userId: studentId,
  type: "application_review",
  title: `Application Approved`,
  message: `Congratulations! Your application for [Program] has been approved.`,
  relatedApplicationId: applicationId,
})
```

**Notification Types**:
- `"application_review"` - For approve/decline/waitlist decisions
- Persisted in local storage
- Can be marked as read
- Links to application details

### Email Notifications
Sent via `/api/send-application-decision`:
- Beautiful HTML templates
- Decision-specific styling
- Support contact information
- Mock mode for development

## Audit Logging

All decisions are logged via `logAudit()`:
```typescript
logAudit({
  userId: decisionMadeBy,
  action: `application:decision:${decision}`,
  details: `Decision made on application ${applicationId}...`
})
```

Creates audit trail for compliance reporting.

## Testing the System

### Test Scenario 1: New Application → Email Alert

1. Go to `/student` portal
2. Submit new application
3. Check hospital portal (refresh if needed)
4. See new alert in StaffApplicationAlerts panel
5. Expand alert and verify student info
6. Click action button → decision modal opens

### Test Scenario 2: Approve Application

1. In decision modal, select "Approve"
2. Enter reason: "Excellent academic record"
3. Click "Send Decision"
4. See success toast
5. In browser console (dev mode) see email log
6. Student dashboard shows "Approved" status
7. Student sees in-app notification
8. Email would be sent to student email (mock mode)

### Test Scenario 3: Alert Filtering

1. Make decisions on multiple applications (mix of approve/decline/waitlist)
2. Toggle filter buttons (All/Pending/Actioned)
3. Verify alerts show correct filtered results
4. Verify stats update automatically

## Configuration

### Email Configuration
Set in `.env.local`:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

If not configured, system runs in **mock mode** - logs to console instead of sending real emails.

### Customization

Email templates can be customized in:
- `/app/api/send-application-decision/route.ts` - `buildDecisionEmail()` function
- Change colors, text, styling

Notification messages customized in:
- `/lib/application-decision-service.ts` - `notificationMessage` object

## Security & Compliance

### Data Protection
- Sensitive student fields encrypted (phone, email, ID number)
- Decisions logged with timestamp and staff ID
- Audit trail for compliance reporting
- No sensitive data in email (only shown in modal)

### Access Control
- Only hospital staff (role: "staff") can access alerts
- Staff can only see alerts for their hospital
- Decision modal validates hospital ownership

### Email Security
- HTML emails sanitized
- No script execution
- Safe template rendering
- Secure transmission via SMTP with auth

## Error Handling

### Email Failures
- If email sending fails, decision still processes
- Timestamp recorded but `emailSentAt` remains null
- Staff sees warning in decision modal (future enhancement)
- Application status still updated
- In-app notification still created

### Network Failures
- Decision modal has retry capability
- Toast notifications show status
- Loading state prevents double-submission

### Storage Failures
- Fallback to mock mode
- Console logging for debugging
- Transaction rollback on critical failures

## Future Enhancements

1. **Multi-Language Support**: Email templates in different languages
2. **SMS Notifications**: Text message option for decisions
3. **Scheduled Decisions**: Batch approve/decline at set times
4. **Decision Templates**: Pre-written reason templates for staff
5. **Analytics Dashboard**: Decision metrics and trends
6. **Appeal System**: Students can appeal declined decisions
7. **Automated Rules**: Auto-approve based on criteria
8. **Supervisor Confirmation**: Second-level approval workflow
9. **Decision Reasons Library**: Suggested reasons for quick selection
10. **Email Preview**: Preview before sending to student

## Troubleshooting

### Alerts Not Appearing
- Check hospital ID matches application hospital ID
- Verify staff user role is "staff"
- Check localStorage (browser dev tools) for `electivio_staff_alerts`
- Refresh page to reload alerts

### Emails Not Sending
- Check SMTP configuration in `.env.local`
- Check browser console for error messages
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Test with mock mode first (leave SMTP empty)

### Application Status Not Updating
- Check `electivio_applications` in localStorage
- Verify decision modal submission completed
- Check browser console for errors
- Refresh page to see updated status

### Notifications Not Showing
- Verify `electivio_notifications` in localStorage
- Check notification type is "application_review"
- Verify userId matches student ID
- Check notification component is rendered in student dashboard

## Performance Considerations

- Alerts loaded on hospital page mount
- Real-time updates via `getStaffAlertsByHospital()`
- Pagination optional for large hospitals (future enhancement)
- Email sending non-blocking (async)
- Modal animations optimized with Framer Motion
- Component memoization prevents unnecessary re-renders

## Summary

The application decision and notification system provides:
✅ Automatic alert creation when applications submitted
✅ Beautiful UI for staff to review and decide
✅ Email notifications with decision outcomes
✅ In-app notifications for immediate feedback
✅ Audit logging for compliance
✅ Real-time dashboard updates
✅ Customizable reasons and notes
✅ Error handling and mock mode support
✅ Security and data protection
✅ Responsive, animated UI

Staff can now efficiently manage all application decisions from a centralized dashboard, with students receiving immediate notification of outcomes via email and in-app messages.
