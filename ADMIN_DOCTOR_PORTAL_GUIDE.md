# Admin Portal & Doctor Portal Architecture

## Overview

The application now features a restructured portal architecture with two main user roles:

### 1. **Admin Portal** (`/app/admin/portal`)
- Hospital administrators manage duty assignments and student distribution
- Comprehensive duty assignment and removal system
- Doctor management and department oversight
- Real-time analytics and reporting

### 2. **Doctor Portal** (`/app/doctor-portal`)
- Doctors supervise students and track their progress
- Student supervision dashboard with analytics
- Performance metrics and observation tracking
- Notification system for alerts and updates

## Portal Architecture

### Admin Portal Features

#### Duty Assignment Management
- **Assign Duties**: Add new doctor-to-student supervision assignments
- **Manage Existing Duties**: View all active, pending, and inactive duty assignments
- **Remove Duties**: Revoke assignments with audit trail
- **Capacity Tracking**: Real-time visualization of student-to-doctor ratios
- **Department Filtering**: Organize duties by department

#### Doctor Management
- **Doctor Profiles**: Complete list of all available doctors
- **Availability Status**: Real-time availability tracking
- **Specialization Management**: Track doctor specializations and expertise
- **Capacity Planning**: Monitor maximum student capacity per doctor

#### Reporting & Analytics
- **Duty Assignment Report**: Export all current assignments
- **Doctor Utilization Report**: Capacity analysis and distribution
- **Department Summary**: Department-wise duty status overview
- **Student Assignment List**: Complete student assignment details

### Doctor Portal Features

#### Dashboard
- **Quick Stats**: Active students, completed observations, average ratings
- **Performance Metrics**: Trending performance data
- **Alerts**: Real-time alerts for at-risk students
- **Analytics**: Detailed performance tracking across 5 evaluation categories

#### Student Management
- View assigned students with supervision details
- Track individual student progress
- Monitor student performance across multiple categories
- Quick access to detailed student profiles

#### Schedule Management
- View scheduled supervision times
- Department/Ward assignments
- Calendar integration
- Scheduling conflict alerts

#### Notifications
- Alert notifications (student at-risk)
- Information updates (new assignments)
- Success confirmations (observation completed)
- System notifications with timestamps

## Data Models

### DutyAssignment Interface
```typescript
interface DutyAssignment {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  maxStudents: number;
  assignedStudents: number;
  assignedDate: string;
  status: "active" | "inactive" | "pending";
  specialties: string[];
}
```

### DoctorProfile Interface
```typescript
interface DoctorProfile {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
  available: boolean;
}
```

### StudentAssignment Interface
```typescript
interface StudentAssignment {
  id: string;
  name: string;
  level: number;
  progress: number;
  status: "active" | "completed" | "at_risk";
}
```

### ObservationMetrics Interface
```typescript
interface ObservationMetrics {
  totalObservations: number;
  completedObservations: number;
  averageRating: number;
  studentsUnderSupervision: number;
}
```

## Components

### DutyAssignmentModal (`/components/duty-assignment-modal.tsx`)
Reusable modal component for assigning new duties to doctors.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `onSubmit: (duty: DutyAssignmentFormData) => void` - Submit handler
- `doctors: Array<...>` - List of available doctors
- `isLoading?: boolean` - Loading state

**Features:**
- Doctor selection dropdown
- Start/End date picking
- Max students configuration
- Specialty tagging with add/remove
- Optional notes field

### DoctorAnalyticsDashboard
Pre-existing component displaying student performance analytics across 5 categories:
- Clinical Skills
- Medical Knowledge
- Communication
- Professionalism
- Teamwork

## File Structure

```
/app/
  ├── admin/
  │   └── portal/
  │       └── page.tsx          # Admin portal main page
  ├── doctor-portal/
  │   └── page.tsx              # Doctor portal main page
  
/components/
  ├── duty-assignment-modal.tsx # Duty assignment form modal
  ├── doctor-analytics-dashboard.tsx  # Performance analytics
```

## Key Features

### Admin Portal

#### 1. Duty Assignment
- Select doctor from available pool
- Configure max student capacity
- Set supervision period (start/end dates)
- Tag specialties for student matching
- Approve pending assignments
- Track assignment status in real-time

#### 2. Filtering & Search
- Search by doctor name or department
- Filter by department
- Filter by assignment status
- Combination filtering support

#### 3. Capacity Management
- Visual progress bars showing student-to-capacity ratio
- Color-coded status indicators
- Department-level utilization overview
- Alerts for overcapacity assignments

#### 4. Audit Trail
- Assignment creation tracking
- Modification history (for future implementations)
- Removal logs with timestamps
- Admin action records

### Doctor Portal

#### 1. Student Dashboard
- Real-time student list with progress
- Status color coding (active/at-risk/completed)
- Progress percentage visualization
- Quick access to student details

#### 2. Performance Tracking
- 5-category evaluation system
- Average performance rating
- Observation completion tracking
- At-risk student alerts

#### 3. Scheduling
- Supervision time slots
- Department/Ward assignments
- Multiple schedule entries per week
- Location information

#### 4. Notification System
- Alert notifications (red, high priority)
- Info notifications (blue, standard)
- Success notifications (green, confirmations)
- Timestamp tracking

## Workflows

### Assigning a New Duty

1. Admin navigates to Admin Portal → Duty Assignments tab
2. Clicks "Assign New Duty" button
3. DutyAssignmentModal opens
4. Admin selects:
   - Doctor from dropdown
   - Start date
   - End date
   - Maximum student capacity
   - Specialties (optional)
5. Admin clicks "Assign Duty"
6. Duty created with "pending" status
7. Duty appears in table, awaiting approval
8. Admin can approve duty with checkmark icon
9. Duty status changes to "active"

### Removing a Duty

1. Admin navigates to Admin Portal → Duty Assignments tab
2. Locates duty in table (can use filters/search)
3. Clicks trash icon in Actions column
4. Duty is removed immediately
5. Removal is logged for audit trail

### Doctor Viewing Student Progress

1. Doctor navigates to Doctor Portal → My Students tab
2. View all assigned students in card format
3. Click "View Details" on any student card
4. Access detailed performance analytics
5. Review student progress across 5 categories
6. Note any at-risk indicators

## Integration Points

### With Existing Systems

- **Auth Context**: Role checking for admin vs doctor access
- **Storage Library**: Mock localStorage for data persistence
- **Form System**: Integration with observation forms
- **Compliance**: Form signing and acknowledgement
- **Analytics**: Integration with DoctorAnalyticsDashboard

### Future Integrations

- Database backend for persistent storage
- Real-time notifications via WebSocket
- Email notifications for duty changes
- PDF report generation
- Scheduling system integration

## Styling & Design

- **Color Scheme**:
  - Primary: Blue (#3B82F6)
  - Success: Green (#22C55E)
  - Alert: Red (#EF4444)
  - Warning: Yellow (#EAB308)
  - Secondary: Purple/Pink for accents

- **Layout**:
  - Max-width container (max-w-7xl)
  - Responsive grid layouts (md:grid-cols-*)
  - Sticky header navigation
  - Smooth animations with Framer Motion

- **Components**:
  - Card-based layouts
  - Lucide icons for visual consistency
  - Status badges with color coding
  - Progress bars for capacity visualization

## State Management

Current implementation uses:
- `useState` for local component state
- Mock data in `useEffect` for initialization
- Direct state mutations for simple operations
- No global state management (future consideration: Redux/Zustand)

## Performance Considerations

1. **Filtering**: Client-side filtering suitable for current dataset size
2. **Search**: Real-time search across doctor names and departments
3. **Table Rendering**: Motion animations for list items with staggered delays
4. **Image Optimization**: Gradient-based avatars (no image uploads)

## Security Considerations

1. **Role-Based Access**:
   - Admin portal accessible only to hospital admins
   - Doctor portal accessible only to assigned doctors
   - Student portal has separate access control

2. **Audit Trail**:
   - All duty assignments logged
   - Removal history tracked
   - Admin action records maintained

3. **Data Privacy**:
   - Student information protected per compliance standards
   - Doctor contact information limited to authorized users
   - Observation data encrypted (via form signing system)

## Testing Recommendations

### Admin Portal
- [ ] Duty assignment form validation
- [ ] Doctor selection and filtering
- [ ] Duty removal with audit trail
- [ ] Capacity calculations and visualizations
- [ ] Status transitions (pending → active)

### Doctor Portal
- [ ] Student list rendering
- [ ] Progress bar calculations
- [ ] Performance metrics aggregation
- [ ] Notification display and timestamps
- [ ] Tab navigation and persistence

### Integration
- [ ] Cross-portal data consistency
- [ ] Role-based access control
- [ ] Audit trail accuracy
- [ ] Search and filter reliability

## Troubleshooting

### Common Issues

1. **Modal not opening**
   - Check `showAddDuty` state is toggling
   - Verify modal portal is rendering correctly

2. **Doctor list empty**
   - Verify mock data is loading in useEffect
   - Check browser console for data errors

3. **Filters not working**
   - Verify filter state is updating
   - Check filter logic in filteredDuties computation
   - Ensure data matches filter criteria

4. **Performance metrics missing**
   - Confirm DoctorAnalyticsDashboard component is imported
   - Verify mock metrics data is properly structured

## Future Enhancements

1. **Database Integration**: Replace mock data with backend API
2. **Real-time Updates**: WebSocket integration for live duty changes
3. **Advanced Scheduling**: Calendar widget for duty period selection
4. **Bulk Operations**: Multi-select for batch duty assignments
5. **Performance Trends**: Historical data and trend analysis
6. **Notification Preferences**: Customizable alert settings
7. **Mobile Optimization**: Responsive design improvements
8. **Dark Mode**: Theme switcher with persistence
9. **Export Formats**: Additional report formats (PDF, Excel)
10. **Duty Templates**: Reusable duty configurations

## Compliance & Audit

All duty assignments are traceable with:
- Assignment timestamp
- Admin who created the assignment
- Modification history (future)
- Removal logs with reasons (future)
- Compliance acknowledgements (integrated with form signing)

This architecture ensures:
- Complete visibility into supervision assignments
- Accountability for duty management decisions
- Student safety through proper supervision ratios
- Compliance with hospital regulations and standards
