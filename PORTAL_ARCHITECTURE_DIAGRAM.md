# Admin & Doctor Portal Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     MEDGATE APPLICATION                         │
└─────────────────────────────────────────────────────────────────┘

                            ┌────────────────┐
                            │  USER AUTH     │
                            │  Context/Hook  │
                            └────────┬───────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
                  ▼                  ▼                  ▼
         ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
         │  STUDENT       │ │  DOCTOR        │ │  ADMIN         │
         │  PORTAL        │ │  PORTAL        │ │  PORTAL        │
         │  /student      │ │  /doctor-      │ │  /admin/       │
         │                │ │   portal       │ │  portal        │
         └────────────────┘ └────────────────┘ └────────────────┘
```

## Portal Layer Architecture

### Admin Portal (`/app/admin/portal/page.tsx`)
```
┌─────────────────────────────────────────────────┐
│            ADMIN PORTAL                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Header: Navigation & Settings            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ KPI Cards: 4 Metrics                     │  │
│  │ - Active Duties                          │  │
│  │ - Total Doctors                          │  │
│  │ - Students Assigned                      │  │
│  │ - Pending Approval                       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Tabs: 3 Main Sections                    │  │
│  │ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │ │DUTIES  │ │DOCTORS │ │REPORTS │        │  │
│  │ └────────┘ └────────┘ └────────┘        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ DUTIES TAB CONTENT                       │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Add Duty Button                     │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Add Duty Modal (Popup)              │  │  │
│  │ │ - Doctor Select                     │  │  │
│  │ │ - Dates (Start/End)                 │  │  │
│  │ │ - Max Students                      │  │  │
│  │ │ - Specialties                       │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Filters & Search                    │  │  │
│  │ │ - Search box (doctor/dept)          │  │  │
│  │ │ - Department filter                 │  │  │
│  │ │ - Status filter                     │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Duties Table                        │  │  │
│  │ │ Col: Doctor | Dept | Max | Assigned│  │  │
│  │ │ Col: Spec | Status | Actions       │  │  │
│  │ │ Actions: ✓ Approve | 🗑 Remove     │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ DOCTORS TAB CONTENT                      │  │
│  │ Grid of Doctor Cards                     │  │
│  │ - Avatar & Name                          │  │
│  │ - Specialization & Department            │  │
│  │ - Contact Info                           │  │
│  │ - Availability Status                    │  │
│  │ - Edit Button                            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ REPORTS TAB CONTENT                      │  │
│  │ - Duty Assignment Report (Export)        │  │
│  │ - Doctor Utilization Report (Export)     │  │
│  │ - Department Summary (Export)            │  │
│  │ - Student Assignment List (Export)       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Doctor Portal (`/app/doctor-portal/page.tsx`)
```
┌─────────────────────────────────────────────────┐
│            DOCTOR PORTAL                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Header: Notifications & Settings         │  │
│  │ - Bell icon with unread count            │  │
│  │ - Settings & Profile                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ KPI Cards: 4 Metrics                     │  │
│  │ - Students (count)                       │  │
│  │ - Observations (X/Y completed)           │  │
│  │ - Average Rating (0-5)                   │  │
│  │ - Performance Level                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Tabs: 4 Main Sections                    │  │
│  │ ┌─────┐ ┌───────┐ ┌────────┐ ┌──────────┐ │
│  │ │DASH │ │STUD   │ │SCHEDULE│ │NOTIF     │ │
│  │ └─────┘ └───────┘ └────────┘ └──────────┘ │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ DASHBOARD TAB (Default)                  │  │
│  │ ┌──────────────────────────────────────┐ │  │
│  │ │ DoctorAnalyticsDashboard Component   │ │  │
│  │ │ - 5-Category Performance Metrics     │ │  │
│  │ │   * Clinical Skills                 │ │  │
│  │ │   * Medical Knowledge               │ │  │
│  │ │   * Communication                   │ │  │
│  │ │   * Professionalism                 │ │  │
│  │ │   * Teamwork                        │ │  │
│  │ │ - Performance Trends                │ │  │
│  │ │ - At-Risk Alerts                    │ │  │
│  │ └──────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ MY STUDENTS TAB                          │  │
│  │ Grid of Student Cards                    │  │
│  │ ┌────────────────────────────────────┐  │  │
│  │ │ [Avatar] Student Name              │  │  │
│  │ │ Level 5 | Status Badge             │  │  │
│  │ │ Progress: [=====>    ] 85%          │  │  │
│  │ │ [View Details Button]               │  │  │
│  │ └────────────────────────────────────┘  │  │
│  │ × N students                             │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ SCHEDULE TAB                             │  │
│  │ Supervision Schedule                     │  │
│  │ ┌────────────────────────────────────┐  │  │
│  │ │ Monday: 08:00-12:00 | Ward A       │  │  │
│  │ │ Wednesday: 14:00-18:00 | Ward B    │  │  │
│  │ │ Friday: 09:00-13:00 | OP Theatre   │  │  │
│  │ └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ NOTIFICATIONS TAB                        │  │
│  │ ┌────────────────────────────────────┐  │  │
│  │ │ 🔴 ALERT: Student at-risk         │  │  │
│  │ │    "Omar K. needs support"        │  │  │
│  │ │    2 hours ago                    │  │  │
│  │ ├────────────────────────────────────┤  │  │
│  │ │ 🔵 INFO: New assignment           │  │  │
│  │ │    "1 new student assigned"       │  │  │
│  │ │    1 day ago                      │  │  │
│  │ ├────────────────────────────────────┤  │  │
│  │ │ 🟢 SUCCESS: Observation done      │  │  │
│  │ │    "Ahmed H. observation logged"  │  │  │
│  │ │    3 days ago                     │  │  │
│  │ └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Component Hierarchy

```
DoctorPortal (page.tsx)
├── Header
│   ├── Title & Subtitle
│   ├── Notifications Bell
│   ├── Settings Icon
│   └── Profile Avatar
├── Tab Navigation
│   ├── Dashboard Tab
│   ├── Students Tab
│   ├── Schedule Tab
│   └── Notifications Tab
├── Dashboard Content
│   ├── KPI Cards (4)
│   │   ├── Students Card
│   │   ├── Observations Card
│   │   ├── Rating Card
│   │   └── Performance Card
│   └── DoctorAnalyticsDashboard
│       ├── Performance Chart
│       ├── Category Breakdown
│       ├── Student List
│       └── Trend Analysis
├── Students Content
│   └── Student Cards Grid
│       ├── Avatar
│       ├── Name & Level
│       ├── Status Badge
│       ├── Progress Bar
│       └── Details Button
├── Schedule Content
│   └── Schedule Slots
│       ├── Day
│       ├── Time
│       └── Location
└── Notifications Content
    └── Notification List
        ├── Alert Notifications
        ├── Info Notifications
        └── Success Notifications

AdminPortal (page.tsx)
├── Header
│   ├── Title & Subtitle
│   ├── Settings Icon
│   └── Profile Avatar
├── KPI Cards (4)
│   ├── Active Duties
│   ├── Total Doctors
│   ├── Students Assigned
│   └── Pending Approval
├── Tab Navigation
│   ├── Assignments Tab
│   ├── Doctors Tab
│   └── Reports Tab
├── Assignments Content
│   ├── Add Duty Button
│   ├── DutyAssignmentModal
│   │   ├── Doctor Select
│   │   ├── Date Range Picker
│   │   ├── Max Students Input
│   │   ├── Specialties Input
│   │   └── Notes Textarea
│   ├── Filters & Search
│   │   ├── Search Box
│   │   ├── Department Filter
│   │   └── Status Filter
│   └── Duties Table
│       ├── Doctor Name
│       ├── Department
│       ├── Capacity
│       ├── Specialties
│       ├── Status Badge
│       └── Action Buttons
├── Doctors Content
│   └── Doctor Cards Grid
│       ├── Avatar
│       ├── Name & Specialization
│       ├── Department
│       ├── Contact Info
│       ├── Availability Status
│       └── Edit Button
└── Reports Content
    ├── Report Cards
    │   ├── Duty Assignment Report
    │   ├── Doctor Utilization Report
    │   ├── Department Summary
    │   └── Student Assignment List
    └── Export Buttons
```

## Data Flow Architecture

```
┌─────────────────────────────────────────┐
│        Local Component State            │
│      (useState Hooks)                   │
├─────────────────────────────────────────┤
│                                         │
│  Admin Portal:                          │
│  ├── duties: DutyAssignment[]           │
│  ├── doctors: DoctorProfile[]           │
│  ├── searchQuery: string                │
│  ├── filterDept: string                 │
│  ├── filterStatus: string               │
│  └── showAddDuty: boolean               │
│                                         │
│  Doctor Portal:                         │
│  ├── activeTab: string                  │
│  ├── studentAssignments: StudentA[]     │
│  ├── metrics: ObservationMetrics        │
│  └── unreadNotifications: number        │
│                                         │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    Mock Data (useEffect)                │
│  (Simulates Backend)                    │
├─────────────────────────────────────────┤
│                                         │
│  Initialized in useEffect:              │
│  ├── Mock Duties List                   │
│  ├── Mock Doctors List                  │
│  ├── Mock Students List                 │
│  └── Mock Metrics                       │
│                                         │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    Event Handlers                       │
│  (User Interactions)                    │
├─────────────────────────────────────────┤
│                                         │
│  Admin:                                 │
│  ├── handleAddDuty()                    │
│  ├── handleRemoveDuty()                 │
│  ├── handleApproveDuty()                │
│  └── Filter/Search handlers             │
│                                         │
│  Doctor:                                │
│  ├── Tab change handlers                │
│  └── Notification handlers              │
│                                         │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    UI Rendering                         │
│  (Framer Motion Animations)             │
├─────────────────────────────────────────┤
│                                         │
│  ├── Cards & Metrics                    │
│  ├── Tables & Grids                     │
│  ├── Modals & Dialogs                   │
│  ├── Status Badges                      │
│  ├── Progress Bars                      │
│  └── Smooth Transitions                 │
│                                         │
└─────────────────────────────────────────┘
```

## Future Integration Architecture

```
Current (Mock Data):
┌─────────────────┐
│  Admin Portal   │  ──┐
└─────────────────┘    │
                       ├──→ localStorage (Mock Data)
┌─────────────────┐    │
│ Doctor Portal   │  ──┘
└─────────────────┘

Future (With Backend):
┌─────────────────┐
│  Admin Portal   │  ──┐
└─────────────────┘    │
                       ├──→ Next.js API Routes
┌─────────────────┐    │    ├── /api/admin/duties
│ Doctor Portal   │  ──┤    ├── /api/admin/doctors
└─────────────────┘    │    ├── /api/doctor/students
                       │    ├── /api/doctor/observations
                       │    └── /api/doctor/metrics
                       │
                       └──→ PostgreSQL/MongoDB
                            ├── duties table
                            ├── doctors table
                            ├── students table
                            ├── observations table
                            └── audit_logs table
```

## User Journey Map

### Admin Journey
```
Login → Admin Portal
  │
  ├─→ Dashboard View
  │   ├─→ KPI Cards (Overview)
  │   └─→ View Current Duties
  │
  ├─→ Assign New Duty
  │   ├─→ Click "Assign New Duty"
  │   ├─→ Fill Form
  │   │   ├─→ Select Doctor
  │   │   ├─→ Set Dates
  │   │   ├─→ Set Capacity
  │   │   └─→ Add Specialties
  │   ├─→ Submit
  │   └─→ Approve (if needed)
  │
  ├─→ Manage Doctors
  │   ├─→ View Doctor List
  │   ├─→ Check Availability
  │   └─→ Edit Profile (future)
  │
  ├─→ Generate Reports
  │   ├─→ Select Report Type
  │   └─→ Export Data
  │
  └─→ Logout
```

### Doctor Journey
```
Login → Doctor Portal
  │
  ├─→ Dashboard (Default)
  │   ├─→ View KPI Metrics
  │   └─→ View Analytics
  │
  ├─→ My Students
  │   ├─→ View Student List
  │   ├─→ Check Progress
  │   ├─→ Identify At-Risk
  │   └─→ Click Details → Detailed Analytics
  │
  ├─→ Schedule
  │   └─→ View Supervision Times
  │
  ├─→ Notifications
  │   ├─→ View Alerts
  │   ├─→ Read Info Updates
  │   └─→ Confirm Success Actions
  │
  └─→ Logout
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component hierarchy
- ✅ Smooth data flow
- ✅ User-friendly interactions
- ✅ Foundation for backend integration
