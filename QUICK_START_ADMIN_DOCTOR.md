# Quick Start Guide: Admin & Doctor Portals

## For Administrators

### Login & Access
```
Route: /app/admin/portal
URL: https://your-app.com/admin/portal
Role Required: Hospital Admin
```

### Main Dashboard
The admin portal home shows 4 KPI cards:
- **Active Duties**: Number of currently active duty assignments
- **Total Doctors**: All doctors in your hospital system
- **Students Assigned**: Total students under supervision
- **Pending Approval**: Duties awaiting admin approval

### Assign a New Duty (Step-by-Step)

1. **Navigate to Admin Portal**
   - Go to `/admin/portal`
   - You'll see the Duty Assignments tab by default

2. **Click "Assign New Duty" Button**
   - Button appears below the KPI cards
   - Opens DutyAssignmentModal

3. **Fill in Duty Details**
   ```
   - Doctor: Select from dropdown (shows name, dept, specialization)
   - Start Date: When duty begins
   - End Date: When duty ends (or renewal date)
   - Max Students: Capacity (1-20 students)
   - Specialties: Add relevant areas (Cardiology, Surgery, etc.)
   - Notes: Any special instructions
   ```

4. **Submit Form**
   - Click "Assign Duty" button
   - Duty created with "pending" status
   - Appears at bottom of duties table

5. **Approve Pending Duty**
   - Find duty in table with "pending" status
   - Click green checkmark (✓) in Actions
   - Status changes to "active"

### Manage Existing Duties

#### Search & Filter
- **Search**: Type doctor name or department
- **Department Filter**: Select specific department
- **Status Filter**: View active/pending/inactive duties
- **Combine Filters**: Apply multiple filters together

#### Duty Actions
- **Approve**: Green checkmark for pending duties
- **Remove**: Trash icon to revoke assignment
- **Edit**: Click duty row for details (future feature)

#### View Duty Details in Table
- Doctor name and department
- Capacity and assignment ratio (visual bar)
- Specialties (comma-separated)
- Current status with color coding
- Assignment date

### Doctor Management Tab

**View All Doctors**
- See complete doctor list in grid layout
- Each card shows:
  - Doctor name and specialization
  - Department
  - Email and phone
  - Availability status (green/red)
  - Edit button for profile updates

**Status Indicators**
- Green "Available": Can accept new assignments
- Red "Unavailable": On leave or full capacity

### Reports & Analytics Tab

**Available Reports**
1. **Duty Assignment Report**
   - All current duty assignments
   - Includes doctor, department, dates

2. **Doctor Utilization Report**
   - Capacity analysis
   - Student distribution per doctor

3. **Department Summary**
   - Department-wise duty overview
   - Capacity by department

4. **Student Assignment List**
   - Complete student-to-doctor mapping
   - Assignment dates and status

**Export Data**
- Click "Export" on any report
- Downloads CSV/Excel format
- Suitable for further analysis

---

## For Doctors

### Login & Access
```
Route: /app/doctor-portal
URL: https://your-app.com/doctor-portal
Role Required: Doctor/Supervisor
```

### Dashboard Tab (Default View)

**Your Stats** - 4 quick metrics:
- **Students**: How many students assigned to you
- **Observations**: Completed/Total observations
- **Average Rating**: Your supervision rating (0-5)
- **Performance**: Overall performance level

**Analytics Dashboard**
- 5-category evaluation system
- Student performance breakdown
- At-risk student alerts
- Trend analysis

### My Students Tab

**View All Assigned Students**
- Grid layout with student cards
- Each card shows:
  - Student name and level
  - Current progress (%)
  - Status badge (active/at-risk/completed)
  - Visual progress bar
  - "View Details" link

**Student Status Colors**
- 🟢 **Green "active"**: Normal progress, on track
- 🔴 **Red "at-risk"**: Needs attention, support
- ⚪ **Gray "completed"**: Supervision period ended

**Check Student Progress**
1. Find student in grid
2. Click "View Details"
3. Access detailed analytics
4. Review performance across 5 categories
5. Note any areas of concern

### Schedule Tab

**Your Supervision Schedule**
- Time slots per week
- Department/Ward assignments
- Location information

**Example Schedule**
```
Monday: 08:00 AM - 12:00 PM, Ward A
Wednesday: 02:00 PM - 06:00 PM, Ward B
Friday: 09:00 AM - 01:00 PM, Operating Theatre
```

**Schedule Management**
- View all shifts
- Request schedule changes (future)
- Export schedule to calendar

### Notifications Tab

**Notification Types**
1. **🔴 Alert Notifications** (Red)
   - Student at-risk alerts
   - Urgent action needed
   - "Student {name} is showing signs of struggle"

2. **🔵 Info Notifications** (Blue)
   - New student assignments
   - System updates
   - "You have been assigned 1 new student"

3. **🟢 Success Notifications** (Green)
   - Observation completed
   - Form submitted successfully
   - "{Student} observation has been recorded"

**Notification Badge**
- Red badge on bell icon shows count
- Unread notifications highlighted
- Click notification to take action

---

## Common Tasks

### Task: Assign a New Duty (Admin)
1. Go to `/admin/portal`
2. Click "Assign New Duty"
3. Select doctor
4. Set dates and capacity
5. Add specialties (optional)
6. Click "Assign Duty"
7. Approve when ready (green checkmark)

**Time: ~2 minutes**

### Task: Remove a Duty Assignment (Admin)
1. Go to `/admin/portal`
2. Find duty in table (use search if needed)
3. Click trash icon in Actions
4. Confirm removal
5. Duty removed and logged for audit

**Time: ~30 seconds**

### Task: Check Student Progress (Doctor)
1. Go to `/doctor-portal`
2. Click "My Students" tab
3. Click "View Details" on student card
4. Review performance metrics
5. Note any concerns in observations form

**Time: ~3 minutes per student**

### Task: View Notifications (Doctor)
1. Go to `/doctor-portal`
2. Click "Notifications" tab
3. Read notification list
4. Click notification to view details
5. Take recommended action

**Time: ~1 minute**

---

## System Constraints

### Doctor Capacity
- **Minimum**: 1 student
- **Maximum**: 20 students
- **Recommended**: 8-12 students per doctor

### Duty Duration
- **Minimum**: 1 day
- **Typical**: 30-90 days
- **Maximum**: 365 days (1 year)

### Specialties
- Add 1-5 specialties per duty
- Match with student requirements
- Update as needed during duty period

---

## Troubleshooting

### "No doctors showing in dropdown"
**Solution:**
- Refresh the page
- Check doctor availability status
- Contact system administrator

### "Duty not appearing in table after assignment"
**Solution:**
- Refresh page
- Check filters (make sure "All Status" selected)
- Try searching for doctor name

### "Can't see notification badge number"
**Solution:**
- Click Notifications tab
- Bell icon will show count
- Try clearing browser cache

### "Schedule not updating"
**Solution:**
- Refresh the page
- Check dates in system
- Contact administrator for schedule changes

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal dialogs |
| `Enter` | Submit forms |
| `Ctrl+K` / `Cmd+K` | Search (future) |
| `Tab` | Navigate form fields |

---

## Tips & Best Practices

### For Administrators

✅ **DO:**
- Assign duties when doctor availability is confirmed
- Set realistic student capacity numbers
- Review pending duties regularly
- Update doctor status when on leave
- Maintain audit trail for compliance

❌ **DON'T:**
- Assign more students than capacity allows
- Leave duties in "pending" status too long
- Reassign without removing old duty first
- Ignore "at-risk" student alerts

### For Doctors

✅ **DO:**
- Check notifications daily
- Update student progress regularly
- Flag at-risk students immediately
- Maintain observation records
- Provide detailed feedback

❌ **DON'T:**
- Ignore at-risk alerts
- Exceed assigned student numbers
- Skip scheduled observations
- Delay performance reviews
- Forget to sign compliance acknowledgements

---

## Support & Help

### Contact Admin For:
- Unable to access portal
- Doctor profile updates needed
- New doctor onboarding
- System technical issues

### Contact Supervisor For:
- Student assignment changes
- Duty schedule adjustments
- Performance evaluation support
- Observation form guidance

### Self-Service Resources:
- This guide: Quick reference
- ADMIN_DOCTOR_PORTAL_GUIDE.md: Detailed documentation
- In-app help icons: Context-sensitive help
- Dashboard tooltips: Feature explanations

---

## Key Metrics Explained

### For Admins

**Active Duties**: Number of duty assignments currently in "active" status
- Higher = More students under supervision
- Monitor for overcapacity

**Total Doctors**: All doctors registered in system
- Includes available and unavailable

**Students Assigned**: Sum of all students across all active duties
- Indicator of system load
- Plan for new assignments based on this

**Pending Approval**: Duties waiting for admin approval
- Action required on these
- Clear pending assignments promptly

### For Doctors

**Students**: Number under your direct supervision
- Compare to your comfort level
- Alert admin if overloaded

**Observations**: Progress (e.g., 42/48 completed)
- Work toward 100% completion
- Schedule remaining observations

**Average Rating**: Your supervision quality (0-5 scale)
- 4.5+: Excellent
- 4.0-4.4: Good
- 3.5-3.9: Acceptable
- Below 3.5: Needs improvement

**Performance**: Qualitative assessment
- Excellent: Consistent high ratings
- Good: Mostly positive feedback
- Needs Attention: Mixed or negative feedback

---

## Data Privacy

- All student information is encrypted
- Doctor contact info only shown to authorized users
- Observation data follows HIPAA guidelines
- Audit trails maintained for compliance
- Regular backups prevent data loss

---

**Last Updated**: 2025
**Version**: 1.0
**Status**: Production Ready
