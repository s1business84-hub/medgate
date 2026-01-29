# Admin & Doctor Portal API Documentation

## Overview

This document describes the API endpoints and data flows for the Admin Portal and Doctor Portal systems.

## Base URL

```
/api
```

## Authentication

All endpoints require authentication via the existing `useAuth` hook. Request must include:
- User role verification
- Admin or Doctor role required
- Hospital context (for multi-hospital systems)

---

## Admin Portal Endpoints

### Duty Management

#### 1. Create Duty Assignment
```
POST /api/admin/duties
```

**Request Body:**
```json
{
  "doctorId": "DOC001",
  "startDate": "2025-01-15",
  "endDate": "2025-03-15",
  "maxStudents": 12,
  "specialties": ["Cardiology", "Pulmonology"],
  "notes": "Primary rotation for Q1 2025"
}
```

**Response (201 Created):**
```json
{
  "id": "duty_1234567890",
  "doctorId": "DOC001",
  "doctorName": "Dr. Sarah Ahmed",
  "department": "Internal Medicine",
  "maxStudents": 12,
  "assignedStudents": 0,
  "assignedDate": "2025-01-15T00:00:00Z",
  "status": "pending",
  "specialties": ["Cardiology", "Pulmonology"]
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User not admin
- `409 Conflict`: Doctor already has conflicting duty

---

#### 2. Get All Duties
```
GET /api/admin/duties
```

**Query Parameters:**
```
?status=active          # Filter by status (active, pending, inactive)
?department=Surgery    # Filter by department
?doctorId=DOC001       # Filter by doctor
?limit=50              # Pagination limit (default: 50)
?offset=0              # Pagination offset (default: 0)
```

**Response (200 OK):**
```json
{
  "duties": [
    {
      "id": "duty_1",
      "doctorId": "DOC001",
      "doctorName": "Dr. Sarah Ahmed",
      "department": "Internal Medicine",
      "maxStudents": 12,
      "assignedStudents": 10,
      "assignedDate": "2025-01-15",
      "status": "active",
      "specialties": ["Cardiology", "Pulmonology"]
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

---

#### 3. Get Duty by ID
```
GET /api/admin/duties/:id
```

**Response (200 OK):**
```json
{
  "id": "duty_1",
  "doctorId": "DOC001",
  "doctorName": "Dr. Sarah Ahmed",
  "department": "Internal Medicine",
  "maxStudents": 12,
  "assignedStudents": 10,
  "assignedDate": "2025-01-15",
  "status": "active",
  "specialties": ["Cardiology", "Pulmonology"],
  "students": [
    {
      "studentId": "STU001",
      "name": "Ahmed Hassan",
      "level": 5,
      "assignedDate": "2025-01-20"
    }
  ],
  "createdBy": "ADM001",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-20T14:30:00Z"
}
```

---

#### 4. Update Duty
```
PUT /api/admin/duties/:id
```

**Request Body:**
```json
{
  "maxStudents": 15,
  "status": "active",
  "endDate": "2025-04-15"
}
```

**Response (200 OK):**
```json
{
  "id": "duty_1",
  "doctorId": "DOC001",
  "maxStudents": 15,
  "status": "active",
  "endDate": "2025-04-15",
  "updatedAt": "2025-01-25T09:00:00Z"
}
```

---

#### 5. Approve Pending Duty
```
PUT /api/admin/duties/:id/approve
```

**Request Body:**
```json
{
  "approvedBy": "ADM001"
}
```

**Response (200 OK):**
```json
{
  "id": "duty_1",
  "status": "active",
  "approvedAt": "2025-01-25T09:00:00Z"
}
```

---

#### 6. Remove/Revoke Duty
```
DELETE /api/admin/duties/:id
```

**Request Body:**
```json
{
  "reason": "Doctor on leave starting Feb 1",
  "revokedBy": "ADM001"
}
```

**Response (200 OK):**
```json
{
  "id": "duty_1",
  "status": "revoked",
  "revokedAt": "2025-01-25T09:00:00Z",
  "reason": "Doctor on leave starting Feb 1"
}
```

**Note:** Revoked duties are soft-deleted and kept for audit trail.

---

### Doctor Management

#### 1. Get All Doctors
```
GET /api/admin/doctors
```

**Query Parameters:**
```
?department=Surgery        # Filter by department
?availability=true        # Filter by availability
?specialization=Cardiology # Filter by specialization
?search=Sarah             # Search by name
```

**Response (200 OK):**
```json
{
  "doctors": [
    {
      "id": "DOC001",
      "name": "Dr. Sarah Ahmed",
      "department": "Internal Medicine",
      "email": "sarah.ahmed@hospital.com",
      "phone": "+971 4 XXX XXXX",
      "specialization": "Cardiology",
      "available": true,
      "currentDuties": 1,
      "totalStudents": 10,
      "maxCapacity": 12
    }
  ],
  "total": 4,
  "limit": 50
}
```

---

#### 2. Get Doctor Profile
```
GET /api/admin/doctors/:id
```

**Response (200 OK):**
```json
{
  "id": "DOC001",
  "name": "Dr. Sarah Ahmed",
  "department": "Internal Medicine",
  "email": "sarah.ahmed@hospital.com",
  "phone": "+971 4 XXX XXXX",
  "specialization": "Cardiology",
  "available": true,
  "currentDuties": [
    {
      "id": "duty_1",
      "maxStudents": 12,
      "assignedStudents": 10,
      "status": "active"
    }
  ],
  "averageRating": 4.6,
  "completedObservations": 42,
  "joinedDate": "2020-05-15"
}
```

---

#### 3. Update Doctor Profile
```
PUT /api/admin/doctors/:id
```

**Request Body:**
```json
{
  "available": false,
  "leaveStartDate": "2025-02-01",
  "leaveEndDate": "2025-02-15",
  "phone": "+971 4 NEW XXXX"
}
```

**Response (200 OK):**
```json
{
  "id": "DOC001",
  "name": "Dr. Sarah Ahmed",
  "available": false,
  "updatedAt": "2025-01-25T09:00:00Z"
}
```

---

### Reports

#### 1. Duty Assignment Report
```
GET /api/admin/reports/duty-assignments
```

**Query Parameters:**
```
?startDate=2025-01-01
?endDate=2025-12-31
?format=json              # json, csv, pdf
```

**Response (200 OK):**
```json
{
  "report": "Duty Assignment Report",
  "period": "2025-01-01 to 2025-12-31",
  "generatedAt": "2025-01-25T09:00:00Z",
  "data": [
    {
      "dutyId": "duty_1",
      "doctor": "Dr. Sarah Ahmed",
      "department": "Internal Medicine",
      "students": 10,
      "capacity": 12,
      "utilization": "83%",
      "startDate": "2025-01-15",
      "status": "active"
    }
  ]
}
```

---

#### 2. Doctor Utilization Report
```
GET /api/admin/reports/doctor-utilization
```

**Response (200 OK):**
```json
{
  "report": "Doctor Utilization Report",
  "generatedAt": "2025-01-25T09:00:00Z",
  "doctors": [
    {
      "id": "DOC001",
      "name": "Dr. Sarah Ahmed",
      "department": "Internal Medicine",
      "assignedStudents": 10,
      "capacity": 12,
      "utilizationRate": 83,
      "averageRating": 4.6,
      "observationCompletion": 87.5
    }
  ],
  "summary": {
    "totalDoctors": 4,
    "averageUtilization": 78,
    "totalStudents": 31,
    "totalCapacity": 40
  }
}
```

---

## Doctor Portal Endpoints

### Student Management

#### 1. Get My Students
```
GET /api/doctor/students
```

**Query Parameters:**
```
?status=active    # Filter by status (active, completed, at_risk)
?level=5          # Filter by level
```

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "STU001",
      "name": "Ahmed Hassan",
      "level": 5,
      "progress": 85,
      "status": "active",
      "dutyId": "duty_1",
      "assignedDate": "2025-01-20",
      "categories": {
        "clinicalSkills": 85,
        "medicalKnowledge": 88,
        "communication": 82,
        "professionalism": 90,
        "teamwork": 83
      }
    }
  ],
  "total": 12
}
```

---

#### 2. Get Student Details
```
GET /api/doctor/students/:id
```

**Response (200 OK):**
```json
{
  "id": "STU001",
  "name": "Ahmed Hassan",
  "level": 5,
  "progress": 85,
  "status": "active",
  "dutyId": "duty_1",
  "assignedDate": "2025-01-20",
  "categories": {
    "clinicalSkills": {
      "score": 85,
      "observations": 12,
      "lastUpdate": "2025-01-24",
      "trend": "improving"
    },
    "medicalKnowledge": {
      "score": 88,
      "observations": 11,
      "lastUpdate": "2025-01-23",
      "trend": "stable"
    },
    "communication": {
      "score": 82,
      "observations": 10,
      "lastUpdate": "2025-01-22",
      "trend": "improving"
    },
    "professionalism": {
      "score": 90,
      "observations": 12,
      "lastUpdate": "2025-01-24",
      "trend": "stable"
    },
    "teamwork": {
      "score": 83,
      "observations": 11,
      "lastUpdate": "2025-01-23",
      "trend": "improving"
    }
  },
  "observations": [
    {
      "date": "2025-01-24",
      "category": "clinicalSkills",
      "score": 85,
      "notes": "Good diagnostic approach"
    }
  ],
  "overallTrend": "improving",
  "atRiskAlert": false
}
```

---

#### 3. Submit Observation
```
POST /api/doctor/observations
```

**Request Body:**
```json
{
  "studentId": "STU001",
  "category": "clinicalSkills",
  "score": 85,
  "notes": "Showed excellent diagnostic reasoning during ward rounds",
  "date": "2025-01-24",
  "signed": true,
  "signatureId": "sig_123456"
}
```

**Response (201 Created):**
```json
{
  "id": "obs_1234567890",
  "studentId": "STU001",
  "category": "clinicalSkills",
  "score": 85,
  "submittedAt": "2025-01-24T14:30:00Z",
  "signedAt": "2025-01-24T14:31:00Z"
}
```

---

### Metrics

#### 1. Get My Metrics
```
GET /api/doctor/metrics
```

**Response (200 OK):**
```json
{
  "metrics": {
    "studentsUnderSupervision": 12,
    "totalObservations": 48,
    "completedObservations": 42,
    "observationCompletionRate": 87.5,
    "averageRating": 4.6,
    "performanceLevel": "Excellent"
  },
  "atRiskStudents": [
    {
      "id": "STU003",
      "name": "Omar Khalid",
      "level": 4,
      "progress": 45,
      "primaryConcern": "Medical Knowledge - needs support"
    }
  ],
  "nextObservations": [
    {
      "studentId": "STU002",
      "name": "Layla Mohammed",
      "category": "medicalKnowledge",
      "daysOverdue": 2
    }
  ]
}
```

---

#### 2. Get Analytics Dashboard Data
```
GET /api/doctor/analytics
```

**Response (200 OK):**
```json
{
  "students": [
    {
      "name": "Ahmed Hassan",
      "level": 5,
      "clinicalSkills": 85,
      "medicalKnowledge": 88,
      "communication": 82,
      "professionalism": 90,
      "teamwork": 83,
      "overallScore": 85.6,
      "status": "excellent"
    }
  ],
  "categoryAverages": {
    "clinicalSkills": 83.2,
    "medicalKnowledge": 84.5,
    "communication": 81.3,
    "professionalism": 87.2,
    "teamwork": 82.8
  },
  "classAverage": 83.8
}
```

---

### Notifications

#### 1. Get My Notifications
```
GET /api/doctor/notifications
```

**Query Parameters:**
```
?unreadOnly=true  # Show only unread
?limit=20         # Default 20
```

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": "notif_1",
      "type": "alert",
      "title": "Student At Risk",
      "message": "Omar Khalid is showing signs of struggle",
      "studentId": "STU003",
      "priority": "high",
      "read": false,
      "createdAt": "2025-01-25T08:00:00Z",
      "actionUrl": "/doctor-portal/students/STU003"
    }
  ],
  "unreadCount": 5
}
```

---

#### 2. Mark Notification as Read
```
PUT /api/doctor/notifications/:id/read
```

**Response (200 OK):**
```json
{
  "id": "notif_1",
  "read": true,
  "readAt": "2025-01-25T09:00:00Z"
}
```

---

### Scheduling

#### 1. Get My Schedule
```
GET /api/doctor/schedule
```

**Response (200 OK):**
```json
{
  "schedule": [
    {
      "id": "sched_1",
      "dayOfWeek": "Monday",
      "startTime": "08:00",
      "endTime": "12:00",
      "location": "Ward A",
      "department": "Internal Medicine"
    }
  ]
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid parameters or missing required fields |
| 401 | Unauthorized | Authentication failed or token expired |
| 403 | Forbidden | User lacks permission to perform action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duty conflict or duplicate assignment |
| 500 | Internal Server Error | Server error (contact support) |

---

## Rate Limiting

- 1000 requests per hour per user
- Admin endpoints: 500 requests per hour

Headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1674711600
```

---

## Data Formats

### Date Format
```
ISO 8601: 2025-01-25T14:30:00Z
```

### Time Format
```
24-hour: 14:30 or 08:00
```

### Score Format
```
0-100 scale (or 0-5 scale with decimal)
5.0 = Excellent
4.0-4.9 = Good
3.0-3.9 = Acceptable
Below 3.0 = Needs Improvement
```

---

## Pagination

Standard pagination for list endpoints:

```
?limit=50      # Items per page (default: 50, max: 100)
?offset=0      # Starting position (default: 0)
```

Response includes:
```json
{
  "data": [...],
  "total": 250,
  "limit": 50,
  "offset": 0,
  "hasMore": true
}
```

---

## Audit Trail

All duty assignments and modifications are logged:

```
POST /api/admin/audit-log

Response:
{
  "action": "duty_assigned",
  "performedBy": "ADM001",
  "target": "duty_1",
  "timestamp": "2025-01-25T09:00:00Z",
  "details": {
    "doctor": "DOC001",
    "students": 12
  }
}
```

---

## Webhook Events (Future)

The system will support webhooks for:
- `duty.created`
- `duty.approved`
- `duty.revoked`
- `observation.submitted`
- `student.at_risk`
- `notification.sent`

---

## Implementation Notes

1. **Current State**: Using mock data with localStorage
2. **Future**: Backend API endpoints required
3. **Auth**: Integrate with existing auth context
4. **Validation**: Input validation required on all endpoints
5. **Security**: All endpoints require role-based access control

---

**Last Updated**: 2025
**Version**: 1.0 (Proposed)
**Status**: Documentation Reference
