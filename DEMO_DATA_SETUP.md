# Demo Data Setup - Student Portal & Hospital Staff Integration

## Overview
This document explains how demo applications from `student@example.com` are now visible in both the student portal and hospital staff pages.

## Problem Solved
Previously, applications created by the demo student (`student@example.com`) were not showing up in:
1. The student's own dashboard at `/student`
2. The hospital staff portal at `/hospital`

This was because:
- No Student record existed with email `student@example.com`
- No demo applications were pre-seeded in localStorage
- No staff alerts were created for hospitals

## Solution Implemented

### 1. **Created Demo Student Record** (`lib/mockData.ts`)
```typescript
{
  id: "stu_demo",
  name: "John Smith",
  email: "student@example.com",
  phone: "+971501234567",
  nationality: "United States",
  university: "Harvard Medical School",
  yearOfStudy: 4,
  complianceStatus: "Complete",
  createdAt: "2024-01-10T08:00:00Z",
}
```

### 2. **Created Demo Applications** (`lib/mockData.ts`)
Three applications linked to the demo student:

| Application ID | Program | Hospital | Status | Sessions |
|---------------|---------|----------|--------|----------|
| app_demo_1 | General Surgery Observership (prog_1) | Dubai Medical Center (h1) | Under Review | 2 |
| app_demo_2 | Cardiology Observership (prog_3) | Abu Dhabi Medical Center (h3) | Approved | 1 |
| app_demo_3 | Emergency Medicine (prog_5) | Dubai General Hospital (h4) | Submitted | 3 |

### 3. **Created Staff Alerts** (`lib/mockData.ts`)
Staff alerts for hospitals h1 and h4 to notify them of new applications:

```typescript
export const mockStaffAlerts: StaffApplicationAlert[] = [
  {
    id: "alert_demo_1",
    hospitalId: "h1",
    applicationId: "app_demo_1",
    studentId: "stu_demo",
    studentName: "John Smith",
    studentEmail: "student@example.com",
    programId: "prog_1",
    submittedAt: "2024-02-10T14:30:00Z",
    readBy: [],
    status: "pending",
    alertCreatedAt: "2024-02-10T14:30:00Z",
  },
  // ... more alerts
]
```

### 4. **Auto-Initialize Data on First Load** (`lib/auth-context.tsx`)
Added initialization logic in `AuthProvider` that runs on first page load:

```typescript
function initializeDemoData() {
  // Initialize users
  if (getUsers().length === 0) {
    mockUsers.forEach(user => createUser(user));
  }
  
  // Initialize students
  if (getStudents().length === 0) {
    localStorage.setItem("electivio_students", JSON.stringify(mockStudents));
  }
  
  // Initialize applications
  if (getApplications().length === 0) {
    localStorage.setItem("electivio_applications", JSON.stringify(mockApplications));
  }
  
  // Initialize staff alerts
  if (getStaffAlerts().length === 0) {
    localStorage.setItem("electivio_staff_alerts", JSON.stringify(mockStaffAlerts));
  }
}
```

## How It Works

### Student Portal (`/student`)
**Filtering Logic** (from `app/student/page.tsx` lines 35-50):
```typescript
const loadApplications = async () => {
  const allApps = getApplications();
  const students = getStudents();
  
  // Find student record by email
  const studentRecord = students.find((s: any) => s.email === user.email);
  
  // Filter applications by either user.id OR student record ID
  const myApps = allApps.filter((a: any) => 
    a.studentId === user.id || (studentRecord && a.studentId === studentRecord.id)
  );
  
  setApplications(myApps);
};
```

**Result**: When `student@example.com` logs in:
- Finds student record with email `student@example.com` (id: `stu_demo`)
- Filters applications where `studentId === "stu_demo"`
- Shows 3 applications: app_demo_1, app_demo_2, app_demo_3

### Hospital Staff Portal (`/hospital`)
**Filtering Logic** (from `app/hospital/page.tsx` lines 69-72):
```typescript
useEffect(() => {
  // Load applications for this hospital
  const hospitalApps = getApplicationsByHospital(user.hospitalId || "");
  const hospitalAlerts = getStaffAlertsByHospital(user.hospitalId || "");
  
  setApplications(hospitalApps);
  setStaffAlerts(hospitalAlerts);
}, [user, router]);
```

**Storage Function** (from `lib/storage.ts` lines 262-265):
```typescript
export function getApplicationsByHospital(hospitalId: string): Application[] {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  return applications.filter(app => app.hospitalId === hospitalId);
}
```

**Result**: When `hospital1@electivio.com` logs in (hospitalId: `h1`):
- Filters applications where `hospitalId === "h1"`
- Shows app_demo_1 (General Surgery application)
- Shows alert_demo_1 in notifications

## Demo Credentials

### Student Portal
- **Email**: `student@example.com`
- **Password**: `password`
- **View**: 3 applications (Under Review, Approved, Submitted)

### Hospital Staff Portals
| Hospital | Email | Password | Can See |
|----------|-------|----------|---------|
| Dubai Medical Center (h1) | hospital1@electivio.com | password | app_demo_1 + alert |
| Abu Dhabi Medical Center (h3) | hospital3@electivio.com | password | app_demo_2 |
| Dubai General Hospital (h4) | - | - | app_demo_3 + alert |

### Supervisor Portal
- **Email**: `supervisor@example.com`
- **Password**: `password`
- **View**: AI insights, student progress tracking

## Data Flow

```
User Login → initializeDemoData() runs
             ↓
       Checks localStorage
             ↓
   If empty → Seeds mock data
             ↓
   Student Portal: Filters by studentId
   Hospital Portal: Filters by hospitalId
             ↓
     Both see same applications
```

## Testing Instructions

1. **Clear localStorage** (optional, to test fresh initialization):
   ```javascript
   localStorage.clear()
   ```

2. **Login as Student**:
   - Go to `/login`
   - Use `student@example.com` / `password`
   - Navigate to student dashboard
   - **Expected**: See 3 applications with different statuses

3. **Login as Hospital Staff**:
   - Go to `/hospital-login`
   - Use `hospital1@electivio.com` / `password`
   - View applications tab
   - **Expected**: See app_demo_1 (John Smith's application)
   - **Expected**: See unread alert notification

4. **Verify Data Persistence**:
   - Refresh page
   - Data should persist in localStorage
   - Applications visible across sessions

## Files Modified

| File | Changes |
|------|---------|
| `lib/mockData.ts` | Added stu_demo, 3 demo applications, 2 staff alerts |
| `lib/auth-context.tsx` | Added initializeDemoData() to seed localStorage |

## Benefits

✅ **Cohesive Demo Experience**: All demo accounts show interconnected, realistic data  
✅ **Easy Testing**: No manual setup required, data auto-initializes  
✅ **Persistent State**: Data survives page refreshes via localStorage  
✅ **Multi-Role Visibility**: Same applications visible from different role perspectives  
✅ **Hospital Notifications**: Staff alerts automatically created for new applications  

## Technical Notes

- **Student ID Matching**: Uses `studentRecord.id` found by email lookup
- **Hospital ID Matching**: Direct `hospitalId` property on Application
- **Dual ID System**: User.id (authentication) vs Student.id (application data)
- **Auto-Initialization**: Runs once on first load, checks if data exists before seeding
- **TypeScript Safety**: All mock data properly typed with interfaces

## Future Enhancements

Consider adding:
- Documents for demo applications
- Session records for observerships
- Performance metrics for demo student
- Form submissions and supervisor feedback
- Chat conversations between student and staff
