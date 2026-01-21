# Role-Based Access Control Implementation

## Overview

The frontend now implements proper role-based access control (RBAC) with distinct UI experiences for different user roles.

## Key Changes

### 1. **Parent Login Removed**
- Parents **cannot login** to the admin dashboard
- Parents receive all information via **SMS notifications only**
- Login attempts by parents are rejected with a clear error message

### 2. **Role-Based Sidebar Navigation**

#### Admin Sidebar (Full Access):
- Dashboard
- **Schools** (admin only)
- Students
- Attendance
- Payments
- Accounts
- Devices
- Merchants
- Cards
- Reports
- **Users** (admin only)
- **System Logs** (admin only)
- Settings

#### School Staff Sidebar (Limited Access):
- Dashboard
- Students
- Attendance
- Payments
- Accounts
- Devices
- Merchants
- Cards
- Reports
- Settings

### 3. **Role-Based Route Protection**

New admin-only routes protected with `RoleGuard`:
- `/schools` - Schools Management
- `/users` - User Management
- `/logs` - System Logs

School staff attempting to access these routes are automatically redirected to the dashboard.

### 4. **Data Filtering by Role**

#### School Staff:
- All data is automatically filtered to show only their school's data
- Students, payments, devices, merchants, accounts, and attendance are scoped to their school
- School selection is disabled in forms (automatically set to their school)

#### Admin:
- Can view data from all schools
- Can select any school when creating/editing records
- Has access to system-wide statistics and logs

### 5. **UI Indicators**

- **Dashboard**: Shows role-specific alerts and statistics
  - Admin: "Admin View - Full access to all schools"
  - School Staff: "School Staff View - Viewing data for [School Name] only"
  
- **All Pages**: Display info alerts showing data scope
  - School Staff see: "Showing [data type] from [School Name] only"

### 6. **Form Restrictions**

#### School Staff Forms:
- School field is **disabled** and shows their school name
- Cannot change school when creating/editing students, devices, or merchants
- Can only edit records from their own school

#### Admin Forms:
- School field is a **dropdown** with all schools
- Can create/edit records for any school

### 7. **Settings Page**

- **Admin**: Full access to all settings including:
  - General settings
  - SMS settings
  - Notifications
  - **System Settings** (admin only tab)
    - Database cleanup
    - Backup management
    - Maintenance mode

- **School Staff**: Limited to:
  - General settings (for their school)
  - SMS settings
  - Notifications
  - No system-wide settings access

## Implementation Details

### Authentication Service (`auth.service.ts`)
```typescript
// Rejects parent logins
if (userRole === 'parent') {
  throw new Error('Parents do not have access to the admin dashboard...');
}

// Only allows admin and school staff
if (userRole !== 'admin' && userRole !== 'school') {
  throw new Error('Access denied. Only administrators and school staff can login.');
}
```

### Role Guard Component (`RoleGuard.tsx`)
```typescript
<RoleGuard allowedRoles={['admin']}>
  <Schools />
</RoleGuard>
```

### Data Filtering Example
```typescript
// Students page automatically filters by school for school staff
const { data } = useQuery({
  queryKey: ['students', searchText, user?.schoolId],
  queryFn: () => {
    const params: any = { search: searchText };
    if (isSchoolStaff && user?.schoolId) {
      params.schoolId = user.schoolId;
    }
    return studentsService.getAll(params);
  },
});
```

## Testing

### Test Admin Login:
- Email: `admin@school.edu`
- Password: `admin123`
- Should see: All menu items including Schools, Users, System Logs
- Should see: Data from all schools

### Test School Staff Login:
- Email: `staff.greenvalley@school.edu` or `staff.sunrise@school.edu`
- Password: `staff123`
- Should see: Limited menu (no Schools, Users, System Logs)
- Should see: Only their school's data
- Should see: Info alerts showing data scope

### Test Parent Login (Should Fail):
- Email: `john.smith@email.com`
- Password: `parent123`
- Should see: Error message: "Parents do not have access to the admin dashboard..."

## Files Modified

1. `frontend/src/services/auth.service.ts` - Added parent login rejection
2. `frontend/src/components/layout/Sidebar.tsx` - Role-based menu filtering
3. `frontend/src/App.tsx` - Added admin-only routes with RoleGuard
4. `frontend/src/components/common/RoleGuard.tsx` - New component for route protection
5. `frontend/src/pages/Dashboard.tsx` - Role-based statistics and alerts
6. `frontend/src/pages/Students.tsx` - School-scoped data filtering
7. `frontend/src/pages/AddEditStudent.tsx` - School field restrictions
8. `frontend/src/pages/Payments.tsx` - School-scoped data filtering
9. `frontend/src/pages/Devices.tsx` - School-scoped data filtering
10. `frontend/src/pages/Merchants.tsx` - School-scoped data filtering
11. `frontend/src/pages/AccountBalances.tsx` - School-scoped data filtering
12. `frontend/src/pages/AttendanceMonitoring.tsx` - School-scoped data filtering
13. `frontend/src/pages/Settings.tsx` - Role-based settings tabs
14. `frontend/src/pages/RegisterDevice.tsx` - School field restrictions
15. `frontend/src/pages/AddEditMerchant.tsx` - School field restrictions
16. `frontend/src/pages/Schools.tsx` - New admin-only page
17. `frontend/src/pages/Users.tsx` - New admin-only page
18. `frontend/src/pages/SystemLogs.tsx` - New admin-only page

## Summary

✅ Parents cannot login (SMS only)
✅ Admin has full access to all features
✅ School staff have limited access to their school's data only
✅ UI clearly indicates role and data scope
✅ Forms automatically restrict school selection for school staff
✅ All routes are properly protected by role


