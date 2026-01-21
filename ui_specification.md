# 🎨 EduTap Admin Dashboard - Complete UI Specification

> **📋 IMPORTANT**: This specification has been updated to match the new backend registration system and includes the **student photo feature** for identity verification. See `UI_UPDATES_REQUIRED.md` and `UI_PHOTO_FEATURE_UPDATES.md` for detailed implementation changes and migration guide.

## Table of Contents
1. [Layout Structure](#layout-structure)
2. [Login Screen](#1-login-screen)
3. [Dashboard (Home)](#2-dashboard-home)
4. [Students Management](#3-students-management)
5. [Add/Edit Student](#4-addedit-student)
6. [Attendance Monitoring](#5-attendance-monitoring)
7. [Attendance History](#6-attendance-history)
8. [Payments & Transactions](#7-payments--transactions)
7.5. [Payment Verification Screen](#75-payment-verification-screen-new---critical-feature)
9. [Transaction Details](#8-transaction-details)
10. [Account Balances](#9-account-balances)
11. [Account Details](#10-account-details)
12. [Devices Management](#11-devices-management)
13. [Register Device](#12-register-device)
14. [Device Details](#13-device-details)
15. [Merchants Management](#14-merchants-management)
16. [Add/Edit Merchant](#15-addedit-merchant)
17. [Merchant Sales Report](#16-merchant-sales-report)
18. [Card Management](#17-card-management)
19. [Reports & Export](#18-reports--export)
20. [Settings](#19-settings)
21. [User Profile](#20-user-profile)

---

## Layout Structure

### Global Layout Components

#### **Header (Top Bar)**
```
┌─────────────────────────────────────────────────────────────────┐
│ [EduTap Logo]  [Search Bar...]  [🔔 3] [👤 Admin User ▼]        │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Logo**: Clickable, returns to dashboard
- **Search Bar**: Global search (students, transactions, devices)
- **Notifications Bell**: Badge with count, dropdown with recent notifications
- **User Profile**: Dropdown with profile, settings, logout

**Height**: 64px
**Background**: White (#FFFFFF)
**Border**: Bottom 1px solid #E8E8E8
**Position**: Fixed at top

---

#### **Sidebar Navigation**
```
┌──────────────┐
│              │
│ 📊 Dashboard │ ← Active
│              │
│ 👥 Students  │
│              │
│ ✅ Attendance│
│              │
│ 💰 Payments  │
│              │
│ 💳 Accounts  │
│              │
│ 📱 Devices   │
│              │
│ 🏪 Merchants │
│              │
│ 🎴 Cards     │
│              │
│ 📄 Reports   │
│              │
│ ⚙️  Settings │
│              │
└──────────────┘
```

**Width**: 240px (collapsed: 64px)
**Background**: Dark blue (#001529)
**Text Color**: White (#FFFFFF)
**Active Item**: Highlighted with accent color
**Icons**: Material Icons or Ant Design icons
**Position**: Fixed left side

---

#### **Main Content Area**
- **Padding**: 24px
- **Background**: Light gray (#F5F5F5)
- **Min Height**: 100vh - Header height
- **Margin Left**: 240px (sidebar width)

---

## 1. Login Screen

### Full Page Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                    [EduTap Logo]                         │
│                                                          │
│              School Management System                    │
│                                                          │
│                                                          │
│         ┌──────────────────────────────────┐           │
│         │  Email                            │           │
│         │  ┌────────────────────────────┐  │           │
│         │  │ user@school.edu            │  │           │
│         │  └────────────────────────────┘  │           │
│         │                                   │           │
│         │  Password                         │           │
│         │  ┌────────────────────────────┐  │           │
│         │  │ ••••••••                   │  │ [👁️]     │
│         │  └────────────────────────────┘  │           │
│         │                                   │           │
│         │  [ ] Remember me                  │           │
│         │                                   │           │
│         │  ┌────────────────────────────┐  │           │
│         │  │        Login               │  │           │
│         │  └────────────────────────────┘  │           │
│         │                                   │           │
│         │  Forgot password?                │           │
│         └──────────────────────────────────┘           │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Features:
- **Email Input**: Text field with validation
- **Password Input**: Text field with show/hide toggle
- **Remember Me**: Checkbox
- **Login Button**: Primary button, full width
- **Forgot Password**: Link below button
- **Error Messages**: Display below form if login fails
- **Loading State**: Button shows spinner during login

### Validation:
- Email format validation
- Password required
- Show error if credentials invalid
- Disable button if fields empty

### After Login:
- Redirect to Dashboard
- Store JWT token
- Set user role in context

---

## 2. Dashboard (Home)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                    [Today ▼] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Students │  │Attendance│  │ Payments│  │ Devices │ │
│  │   245    │  │   89%    │  │ 12,500  │  │   8     │ │
│  │  Active  │  │  Today   │  │   RWF   │  │ Online  │ │
│  │  [+12%]  │  │  [+5%]   │  │ [+8%]   │  │ [2 Low] │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Today's Attendance (Real-time)                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                              │ │  │
│  │  │  [Line Chart: Attendance over time today]    │ │  │
│  │  │  08:00  09:00  10:00  11:00  12:00          │ │  │
│  │  │                                              │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  Present: 218 | Absent: 27                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────┐  ┌─────────────────────┐ │
│  │ Recent Transactions      │  │ Device Status       │ │
│  │                          │  │                     │ │
│  │ • John Doe               │  │ ✅ POS-001          │ │
│  │   500 RWF - Canteen A    │  │    Online - 85% Bat │ │
│  │   10:30 AM               │  │                     │ │
│  │                          │  │ ✅ Reader-01        │ │
│  │ • Mary Smith             │  │    Online - 92% Bat │ │
│  │   300 RWF - Store B      │  │                     │ │
│  │   10:25 AM               │  │ ⚠️  Reader-02       │ │
│  │                          │  │    Online - 15% Bat │ │
│  │ • Peter Jones            │  │                     │ │
│  │   200 RWF - Canteen A   │  │ ✅ Reader-03        │ │
│  │   10:20 AM               │  │    Online - 78% Bat │ │
│  │                          │  │                     │ │
│  │ [View All →]             │  │ [View All →]        │ │
│  └──────────────────────────┘  └─────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Revenue Overview (This Week)                    │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ [Bar Chart: Daily revenue]                 │ │  │
│  │  │ Mon  Tue  Wed  Thu  Fri  Sat  Sun         │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  Total: 45,000 RWF | Avg: 6,429 RWF/day         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Statistics Cards (Top Row)**
1. **Students Card**
   - Number: Total active students
   - Label: "Active"
   - Trend: Percentage change from previous period
   - Icon: Users icon
   - Click: Navigate to Students page

2. **Attendance Card**
   - Number: Today's attendance percentage
   - Label: "Today"
   - Trend: Change from yesterday
   - Icon: Checkmark icon
   - Click: Navigate to Attendance page

3. **Payments Card**
   - Number: Today's total revenue
   - Label: "RWF"
   - Trend: Change from yesterday
   - Icon: Money icon
   - Click: Navigate to Payments page

4. **Devices Card**
   - Number: Online devices count
   - Label: "Online"
   - Sub-label: Devices with low battery
   - Icon: Device icon
   - Click: Navigate to Devices page

#### **Today's Attendance Chart**
- **Type**: Line chart
- **X-axis**: Time (hourly)
- **Y-axis**: Number of students
- **Real-time**: Updates via Socket.io
- **Data**: Attendance count per hour
- **Summary**: Present/Absent counts below chart

#### **Recent Transactions Panel**
- **List**: Last 5-10 transactions
- **Items Show**:
  - Student name
  - Amount
  - Merchant name
  - Timestamp
- **Action**: "View All" link to Transactions page
- **Real-time**: New transactions appear automatically

#### **Device Status Panel**
- **List**: All devices with status
- **Status Indicators**:
  - ✅ Green: Online
  - ⚠️ Yellow: Low battery
  - ❌ Red: Offline
- **Info Shown**:
  - Device name/ID
  - Status
  - Battery level
- **Action**: "View All" link to Devices page

#### **Revenue Overview Chart**
- **Type**: Bar chart
- **Period**: This week (configurable)
- **X-axis**: Days of week
- **Y-axis**: Revenue amount
- **Summary**: Total and average below chart

### Real-time Updates:
- Statistics cards update every 30 seconds
- Attendance chart updates in real-time
- New transactions appear immediately
- Device status updates live

---

## 3. Students Management

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Students                          [+ Add Student]       │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search students...]  [Filter ▼] [Export ▼] [Import]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Photo│ Name      │ ID   │ Grade│ Card    │ Balance│ │
│  ├──────┼───────────┼──────┼──────┼────────┼────────┤ │
│  │ [📷] │ John Doe  │ ST001│ 5A   │ ✅     │ 2,500  │ │
│  │      │           │      │      │ Active │ RWF    │ │
│  ├──────┼───────────┼──────┼──────┼────────┼────────┤ │
│  │ [👤] │ Mary Smith│ ST002│ 5B   │ ✅     │ 1,200  │ │
│  │      │           │      │      │ Active │ RWF    │ │
│  ├──────┼───────────┼──────┼──────┼────────┼────────┤ │
│  │ [👤] │ Peter Jones│ ST003│ 6A   │ ⚠️     │ 0      │ │
│  │      │           │      │      │ Lost   │ RWF    │ │
│  ├──────┼───────────┼──────┼──────┼────────┼────────┤ │
│  │ [📷] │ Alice Brown│ ST004│ 4B   │ ✅     │ 3,000  │ │
│  │      │           │      │      │ Active │ RWF    │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 245 students  [< Previous] [Next >]  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Header Actions**
1. **Add Student Button**
   - Primary button, right-aligned
   - Opens Add Student modal/form
   - Icon: Plus icon

2. **Search Bar**
   - Placeholder: "Search students..."
   - Search by: Name, Student ID, Card UID
   - Real-time search (debounced)
   - Clear button (X) when text entered

3. **Filter Dropdown**
   - Options:
     - All Students
     - Active Only
     - Inactive Only
     - By Grade
     - By Class
     - By Card Status
   - Multi-select support

4. **Export Dropdown**
   - Options:
     - Export to CSV
     - Export to PDF
     - Export Selected
   - Icon: Download icon

5. **Import Button**
   - Opens file upload dialog
   - Accepts: CSV file
   - Shows import progress
   - Displays import results

#### **Students Table**
**Columns:**
1. **Photo** (First column)
   - Student photo thumbnail (50x50px, circular)
   - Click: View full-size photo
   - Fallback: Default avatar with initials if no photo
   - Shows [📷] icon if photo exists, [👤] if no photo

2. **Name** (Sortable)
   - Student full name
   - Click: View student details

3. **Student ID** (Sortable)
   - Unique student identifier
   - Monospace font

4. **Grade** (Filterable)
   - Student grade level
   - Badge style

5. **Class** (Filterable)
   - Student class
   - Badge style

6. **Card Status** (Filterable)
   - Status badge:
     - ✅ Green: Active
     - ⚠️ Yellow: Lost
     - 🔴 Red: Stolen
     - ⚫ Gray: Deactivated
   - Click: Manage card

7. **Balance** (Sortable)
   - Account balance in RWF
   - Format: "X,XXX RWF"
   - Low balance highlighted in orange

8. **Actions** (Always last column)
   - Three dots menu (⋮)
   - Options:
     - View Details
     - Edit Student
     - Manage Card
     - View Transactions
     - View Attendance
     - Upload/Change Photo
     - Deactivate

#### **Table Features:**
- **Sorting**: Click column header to sort
- **Pagination**: Bottom of table
  - Items per page: 20, 50, 100
  - Page navigation: Previous/Next
  - Page numbers
- **Row Selection**: Checkbox for bulk actions
- **Bulk Actions** (when rows selected):
  - Export Selected
  - Deactivate Selected
  - Assign Cards (bulk)
- **Empty State**: Message when no students found

---

## 4. Add/Edit Student

### Modal/Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Add Student                                    [✕ Close]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Basic Information                               │  │
│  │                                                  │  │
│  │  First Name *                                    │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Last Name *                                     │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Student ID *                                    │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ST001                                       │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  (Auto-generated if left empty)                  │  │
│  │                                                  │  │
│  │  Grade *                                         │  │
│  │  [Select Grade ▼]                                │  │
│  │                                                  │  │
│  │  Class *                                         │  │
│  │  [Select Class ▼]                                │  │
│  │                                                  │  │
│  │  School *                                        │  │
│  │  [Select School ▼]                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Parent/Guardian Information *                   │  │
│  │  (Required - will be created/linked automatically)│  │
│  │                                                  │  │
│  │  Parent First Name *                             │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Parent Last Name *                             │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Phone Number *                                 │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ +250788123456                              │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  ℹ️ System will find existing parent by phone   │  │
│  │     or create new one automatically             │  │
│  │                                                  │  │
│  │  Email (Optional)                               │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ parent@email.com                           │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Address (Optional)                             │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  [✓] Send SMS notifications to parent           │  │
│  │  (Checked by default)                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Card Assignment                                 │  │
│  │                                                  │  │
│  │  Card UID *                                      │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ABC123456789                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  [Scan Card] (if device available)               │  │
│  │                                                  │  │
│  │  [ ] Create account with initial balance        │  │
│  │  Initial Balance: [0] RWF                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Student Photo (Optional)                        │  │
│  │  ℹ️ Recommended for identity verification        │  │
│  │                                                  │  │
│  │  ┌──────────────┐                                │  │
│  │  │              │                                │  │
│  │  │   [Photo]    │  ← Preview area (200x200px)   │  │
│  │  │   Preview     │                                │  │
│  │  │              │                                │  │
│  │  └──────────────┘                                │  │
│  │                                                  │  │
│  │  [📷 Upload Photo]  [🗑️ Remove] (if photo exists)│  │
│  │                                                  │  │
│  │  Accepted: JPG, PNG, GIF, WebP                  │  │
│  │  Max size: 5MB                                   │  │
│  │  ℹ️ Photo will be used for payment verification   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Cancel]              [Register Student]        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Form Sections**
1. **Basic Information**
   - First Name (required)
   - Last Name (required)
   - Student ID (auto-generated if empty)
   - Grade (dropdown, required)
   - Class (dropdown, required)
   - School (dropdown, required, filtered by user's school if school staff)

2. **Parent/Guardian Information** (REQUIRED - Always shown)
   - **Note**: System automatically finds existing parent by phone number or creates new one
   - Parent First Name (required)
   - Parent Last Name (required)
   - Phone Number (required, unique identifier)
     - Format: International format (e.g., +250788123456)
     - Info tooltip: "System will find existing parent by phone or create new one automatically"
   - Email (optional)
   - Address (optional)
   - **SMS Notifications**: Checkbox (checked by default)
     - "Send SMS notifications to parent"
     - Tooltip: "Parent will receive SMS for attendance and payments"

3. **Card Assignment**
   - Card UID input (required)
   - Scan Card button (if RFID reader available)
   - Checkbox: Create account with initial balance
   - Initial balance input (if checked, in RWF)

4. **Student Photo** (Optional but Recommended)
   - Photo preview area (200x200px, circular or rounded square)
   - "Upload Photo" button
   - "Remove Photo" button (if photo exists)
   - File input (hidden, triggered by button)
   - Accepted formats: JPG, PNG, GIF, WebP
   - Max file size: 5MB
   - Info text: "Photo is optional but recommended for identity verification at payment points"
   - **Note**: Photo can be uploaded during registration or added later
   - **Upload Flow**:
     - First: Submit student registration
     - Then: Upload photo to `/api/students/{studentId}/photo` (if photo selected)
     - Show progress: "Registering student..." → "Uploading photo..." → "Complete"

#### **Backend Integration:**
- **Endpoint**: `POST /api/students/register`
- **Request Format**:
  ```json
  {
    "firstName": "...",
    "lastName": "...",
    "studentId": "...",
    "cardUID": "...",
    "grade": "...",
    "class": "...",
    "schoolId": "...",
    "initialBalance": 0,
    "parentFirstName": "...",
    "parentLastName": "...",
    "parentPhone": "...",
    "parentEmail": "...",
    "parentAddress": "...",
    "parentReceiveSMS": true
  }
  ```

#### **Success Response Handling:**
After successful registration, show:
- Success message: "Student and parent registered successfully"
- Display:
  - Student ID and name
  - Parent name and phone
  - Account balance (if created)
  - SMS notification status: "✓ Welcome SMS sent to parent" or "⚠ SMS failed: [error]"
- Auto-refresh student list

#### **Validation:**
- Required fields marked with *
- Email format validation (if provided)
- Phone number format validation (international format)
- Card UID uniqueness check (real-time)
- Student ID uniqueness check (real-time)
- Real-time validation feedback
- Phone number lookup indicator (show "Checking for existing parent..." when phone entered)

#### **Actions:**
- **Cancel**: Close modal, discard changes
- **Register Student**: 
  - Submit to `/api/students/register`
  - Show loading state
  - Handle success/error responses
  - Show SMS notification status
  - Refresh student list on success

#### **Additional Features:**
- **Register Multiple Students** button (optional, for siblings)
  - Opens expanded form to register 2+ students with same parent
  - Uses `/api/students/register-multiple` endpoint
  - Shows parent info once, multiple student forms below

- **Photo Management** (for Edit Student form)
  - Show current photo (if exists) in preview area
  - "Change Photo" button to upload new photo
  - "Delete Photo" button to remove photo
  - Upload endpoint: `POST /api/students/{id}/photo`
  - Delete endpoint: `DELETE /api/students/{id}/photo`
  - Photo updates immediately after upload

---

## 5. Attendance Monitoring

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Attendance                    [Date: Today ▼] [Export]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Summary                                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │ Present  │  │  Absent  │  │  Total   │      │  │
│  │  │   218    │  │    27    │  │   245    │      │  │
│  │  │  89%     │  │   11%    │  │ Students │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Attendance Chart                                │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ [Line Chart: Attendance over time today]   │ │  │
│  │  │ 08:00  09:00  10:00  11:00  12:00         │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────┐  ┌─────────────────────┐ │
│  │ Present Students (218)   │  │ Absent Students (27)│ │
│  │                          │  │                     │ │
│  │ [Search...]              │  │ [Search...]         │ │
│  │                          │  │                     │ │
│  │ • John Doe - 08:15       │  │ • Alice Brown       │ │
│  │   Gate A                 │  │   Grade 4B          │ │
│  │                          │  │                     │ │
│  │ • Mary Smith - 08:20     │  │ • Bob Wilson        │ │
│  │   Gate A                 │  │   Grade 5A          │ │
│  │                          │  │                     │ │
│  │ • Peter Jones - 08:25    │  │ • Charlie Davis     │ │
│  │   Gate B                 │  │   Grade 6B          │ │
│  │                          │  │                     │ │
│  │ [Load More]              │  │ [Mark Present]      │ │
│  └──────────────────────────┘  └─────────────────────┘ │
│                                                          │
│  [View History] [Export Report]                         │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Date Selector**
- Date picker in header
- Default: Today
- Options: Today, Yesterday, Custom date, Date range
- Updates data when date changes

#### **Summary Cards**
1. **Present Card**
   - Count: Number of students present
   - Percentage: % of total
   - Color: Green

2. **Absent Card**
   - Count: Number of students absent
   - Percentage: % of total
   - Color: Red

3. **Total Card**
   - Count: Total students
   - Label: "Students"

#### **Attendance Chart**
- **Type**: Line chart
- **X-axis**: Time (hourly)
- **Y-axis**: Number of students
- **Real-time**: Updates automatically
- **Tooltip**: Shows exact count on hover

#### **Present Students Panel**
- **List**: All students who arrived
- **Items Show**:
  - Student name
  - Arrival time
  - Location/device
- **Search**: Filter present students
- **Real-time**: New arrivals appear automatically
- **Load More**: Pagination for large lists

#### **Absent Students Panel**
- **List**: Students who haven't arrived
- **Items Show**:
  - Student name
  - Grade
  - Class
- **Search**: Filter absent students
- **Mark Present Button**: Manually mark student as present
- **Action**: Opens modal to record manual attendance

#### **Actions**
- **View History**: Navigate to attendance history page
- **Export Report**: Export today's attendance (CSV/PDF)

### Real-time Features:
- Live updates via Socket.io
- New arrivals appear immediately
- Summary cards update in real-time
- Chart updates automatically

---

## 6. Attendance History

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Attendance History    [Date Range ▼] [Student ▼] [Export]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Filters                                         │  │
│  │  From: [2024-12-01]  To: [2024-12-03]           │  │
│  │  Student: [All Students ▼]                      │  │
│  │  Grade: [All Grades ▼]                          │  │
│  │  [Apply Filters] [Reset]                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Attendance Statistics                           │  │
│  │  Total Days: 3 | Avg Attendance: 89%             │  │
│  │  [Chart: Daily attendance percentage]            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Attendance Records                              │  │
│  │  Date      │ Student      │ Time  │ Location    │ │
│  ├────────────┼──────────────┼───────┼─────────────┤ │
│  │ 2024-12-03 │ John Doe     │ 08:15 │ Gate A      │ │
│  │ 2024-12-03 │ Mary Smith   │ 08:20 │ Gate A      │ │
│  │ 2024-12-02 │ John Doe     │ 08:10 │ Gate A      │ │
│  │ 2024-12-02 │ Mary Smith   │ 08:25 │ Gate B      │ │
│  │ 2024-12-01 │ John Doe     │ 08:15 │ Gate A      │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 654 records  [< Previous] [Next >]     │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Filters Section**
- **Date Range**: From/To date pickers
- **Student**: Dropdown (All or specific student)
- **Grade**: Dropdown filter
- **Class**: Dropdown filter
- **Apply Filters**: Button to apply
- **Reset**: Button to clear filters

#### **Statistics Section**
- **Total Days**: Number of days in range
- **Average Attendance**: Percentage
- **Chart**: Line or bar chart showing daily attendance
- **Tooltip**: Hover for details

#### **Attendance Records Table**
**Columns:**
1. **Date** (Sortable)
2. **Student Name** (Sortable, clickable)
3. **Time** (Sortable)
4. **Location** (Device/location name)
5. **Actions**
   - View details
   - Delete (if manual entry)

#### **Pagination**
- Items per page: 20, 50, 100
- Page navigation
- Total records count

---

## 7. Payments & Transactions

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Transactions    [Date Range ▼] [Merchant ▼] [Export]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Revenue Summary                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │ Today    │  │ This Week│  │ This Month│      │  │
│  │  │ 12,500   │  │ 45,000   │  │ 180,000  │      │  │
│  │  │ RWF      │  │ RWF      │  │ RWF      │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Revenue Chart                                   │  │
│  │  [Bar Chart: Daily revenue for selected period] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Transaction History                             │  │
│  │  [Search...] [Filter: All ▼]                     │  │
│  │                                                  │  │
│  │  Time    │ Student      │ Amount │ Merchant │ Ref│ │
│  ├──────────┼──────────────┼────────┼──────────┼───┤ │
│  │ 10:30    │ John Doe     │ 500    │ Canteen A│...│ │
│  │          │              │ RWF    │          │   │ │
│  ├──────────┼──────────────┼────────┼──────────┼───┤ │
│  │ 10:25    │ Mary Smith   │ 300    │ Store B  │...│ │
│  │          │              │ RWF    │          │   │ │
│  ├──────────┼──────────────┼────────┼──────────┼───┤ │
│  │ 10:20    │ Peter Jones  │ 200    │ Canteen A│...│ │
│  │          │              │ RWF    │          │   │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 1,245 transactions  [< Previous] [Next>]│
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Revenue Summary Cards**
1. **Today**: Today's total revenue
2. **This Week**: Week's total revenue
3. **This Month**: Month's total revenue
- All in RWF currency
- Clickable to filter by period

#### **Revenue Chart**
- **Type**: Bar chart
- **Period**: Based on date range filter
- **X-axis**: Date
- **Y-axis**: Revenue amount
- **Tooltip**: Exact amount on hover

#### **Transaction History Table**
**Columns:**
1. **Time** (Sortable)
   - Timestamp
   - Format: HH:MM

2. **Student** (Sortable, Clickable)
   - Student name
   - Click: View student details

3. **Amount** (Sortable)
   - Transaction amount
   - Format: "X,XXX RWF"
   - Color: Green for purchases

4. **Merchant** (Filterable)
   - Merchant name
   - Badge style

5. **Reference** (Clickable)
   - Transaction reference
   - Click: View transaction details
   - Truncated with "..." if long

6. **Status** (Filterable)
   - Badge:
     - ✅ Completed (green)
     - ⏳ Pending (yellow)
     - ❌ Failed (red)
     - 🔄 Reversed (gray)

7. **Actions**
   - Three dots menu:
     - View Details
     - Refund Transaction
     - Print Receipt

#### **Filters**
- **Date Range**: From/To dates
- **Merchant**: Dropdown (All or specific)
- **Student**: Search/select
- **Status**: All, Completed, Pending, Failed
- **Type**: All, Purchase, Top-up, Refund

#### **Search**
- Search by: Student name, Transaction reference
- Real-time search

#### **Pagination**
- Items per page: 20, 50, 100
- Page navigation

---

## 7.5. Payment Verification Screen (NEW - Critical Feature)

### Modal/Overlay Layout
```
┌─────────────────────────────────────────────────────────┐
│  PAYMENT VERIFICATION                        [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Student Identity Verification                   │  │
│  │                                                  │  │
│  │  ┌──────────────┐                                 │  │
│  │  │              │                                 │  │
│  │  │  [STUDENT]   │  ← Large photo (300x300px)     │  │
│  │  │    PHOTO     │     (circular or rounded)       │  │
│  │  │              │                                 │  │
│  │  └──────────────┘                                 │  │
│  │                                                  │  │
│  │  Student: Alice Johnson                         │  │
│  │  Student ID: STU002                              │  │
│  │  Grade: 6 - Class: B                             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Transaction Details                             │  │
│  │                                                  │  │
│  │  Amount: 500 RWF                                 │  │
│  │  Current Balance: 2,000 RWF                      │  │
│  │  New Balance: 1,500 RWF                          │  │
│  │                                                  │  │
│  │  Merchant: Main Canteen                          │  │
│  │  Location: Main Canteen                          │  │
│  │  Time: 10:30 AM                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [✓ Confirm Payment]  [✗ Cancel]                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ℹ️ Verify student identity before confirming payment   │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **When This Screen Appears:**
- **Trigger**: Student taps card at POS/canteen payment device
- **Backend**: Processes payment and returns student data with photo
- **Frontend**: Displays verification screen automatically
- **Purpose**: Allow canteen staff to verify card owner identity

#### **Student Photo Display:**
- **Size**: 300x300px (large, for clear identification)
- **Shape**: Circular or rounded square
- **Position**: Centered, prominent
- **Fallback**: Default avatar with student initials if no photo
- **Source**: From API response `student.photo` field
- **URL Construction**: `${API_BASE_URL}${student.photo}`

#### **Student Information:**
- Student full name (large, prominent)
- Student ID
- Grade and Class
- **Purpose**: Additional verification details

#### **Transaction Details:**
- Transaction amount (prominent)
- Current account balance
- New balance after transaction
- Merchant name
- Device location
- Timestamp

#### **Staff Actions:**
1. **Confirm Payment** (Primary button, green)
   - Staff verifies identity matches photo
   - Completes the transaction
   - Shows success message
   - Closes screen after 2 seconds

2. **Cancel** (Secondary button, red)
   - Aborts the transaction
   - Returns to ready state
   - No payment processed

#### **Screen States:**
- **Loading**: Show spinner while processing card tap
- **Verification**: Display photo and details (waiting for staff confirmation)
- **Success**: Show success message, auto-close after 2 seconds
- **Error**: Show error message (insufficient balance, card inactive, etc.)

#### **Backend Integration:**
- **Endpoint**: `POST /api/card/tap`
- **Request**:
  ```json
  {
    "cardUID": "CARD789012",
    "deviceId": "pos-canteen-001",
    "deviceLocation": "Main Canteen",
    "amount": 500,
    "description": "Lunch purchase"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "data": {
        "student": {
          "photo": "/uploads/students/student-1234567890-abc123.jpg",
          "name": "Alice Johnson",
          "studentId": "STU002",
          "grade": "6",
          "class": "B",
          "accountBalance": 1500
        },
        "transaction": {
          "amount": 500,
          "balanceAfter": 1500
        }
      }
    }
  }
  ```

#### **Implementation Notes:**
- **Photo URL**: Always prepend API base URL to photo path
- **Error Handling**: Show default avatar if photo fails to load
- **Accessibility**: Alt text for images, keyboard navigation
- **Responsive**: Adapts to different screen sizes
- **Real-time**: Updates immediately when card is tapped

#### **UX Considerations:**
- **Large Photo**: Easy to see and verify identity
- **Clear Information**: All details visible at once
- **Quick Actions**: Large, easy-to-click buttons
- **Visual Feedback**: Loading states, success animations
- **Error Messages**: Clear, actionable error messages

---

## 8. Transaction Details

### Modal/Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Transaction Details                          [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Transaction Information                         │  │
│  │                                                  │  │
│  │  Reference: TXN-1234567890-abc123                │  │
│  │  Status: ✅ Completed                            │  │
│  │  Type: Purchase                                  │  │
│  │  Date: 2024-12-03 10:30 AM                      │  │
│  │                                                  │  │
│  │  Amount: 500 RWF                                │  │
│  │  Merchant: Canteen A                            │  │
│  │  Location: Main Canteen                         │  │
│  │  Device: POS-001                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Student Information                             │  │
│  │                                                  │  │
│  │  ┌──────────┐                                   │  │
│  │  │  [Photo] │  ← Student photo (150x150px)      │  │
│  │  └──────────┘                                   │  │
│  │                                                  │  │
│  │  Name: John Doe                                  │  │
│  │  Student ID: ST001                               │  │
│  │  Grade: 5A                                       │  │
│  │  [View Student Profile →]                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Account Information                             │  │
│  │                                                  │  │
│  │  Balance Before: 3,000 RWF                      │  │
│  │  Amount: -500 RWF                               │  │
│  │  Balance After: 2,500 RWF                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Print Receipt] [Refund Transaction] [Close]   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Transaction Information**
- Reference number (copyable)
- Status badge
- Type (Purchase, Top-up, Refund)
- Date and time
- Amount
- Merchant details
- Location
- Device ID

#### **Student Information**
- **Student Photo** (150x150px, circular)
  - Display photo if available
  - Fallback to default avatar if no photo
  - Click to view full-size photo
- Student name
- Student ID
- Grade/Class
- Link to student profile

#### **Account Information**
- Balance before transaction
- Transaction amount (negative for purchases)
- Balance after transaction

#### **Actions**
- **Print Receipt**: Generate PDF receipt
- **Refund Transaction**: Opens refund confirmation
- **Close**: Close modal

---

## 9. Account Balances

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Account Balances    [School: All ▼] [Filter ▼] [Export]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Summary                                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │ Total    │  │ Accounts │  │ Avg      │      │  │
│  │  │ Balance  │  │          │  │ Balance  │      │  │
│  │  │ 125,000  │  │   245    │  │   510    │      │  │
│  │  │ RWF      │  │          │  │ RWF      │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Account List                                    │  │
│  │  [Search...] [Filter: All ▼] [Sort: Balance ▼]  │  │
│  │                                                  │  │
│  │  Student        │ Balance │ Last Top-up │ Status│ │
│  ├─────────────────┼─────────┼─────────────┼───────┤ │
│  │ John Doe        │ 2,500   │ 2 days ago  │ ✅    │ │
│  │ ST001 - Grade 5A│ RWF     │             │ Active│ │
│  ├─────────────────┼─────────┼─────────────┼───────┤ │
│  │ Mary Smith      │ 1,200   │ 5 days ago  │ ✅    │ │
│  │ ST002 - Grade 5B│ RWF     │             │ Active│ │
│  ├─────────────────┼─────────┼─────────────┼───────┤ │
│  │ Peter Jones     │ 0       │ -           │ ⚠️    │ │
│  │ ST003 - Grade 6A│ RWF     │             │ Low   │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 245 accounts  [< Previous] [Next >]     │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Summary Cards**
1. **Total Balance**: Sum of all account balances
2. **Accounts**: Total number of accounts
3. **Average Balance**: Average balance per account

#### **Account List Table**
**Columns:**
1. **Student** (Sortable, Clickable)
   - Student name
   - Student ID
   - Grade/Class
   - Click: View account details

2. **Balance** (Sortable)
   - Account balance
   - Format: "X,XXX RWF"
   - Color coding:
     - Green: Normal (>500 RWF)
     - Orange: Low (100-500 RWF)
     - Red: Very Low (<100 RWF)

3. **Last Top-up** (Sortable)
   - Date of last top-up
   - Format: "X days ago" or date
   - "-" if never topped up

4. **Status** (Filterable)
   - Badge:
     - ✅ Active (green)
     - ⚠️ Low Balance (orange)
     - ❌ Inactive (gray)

5. **Actions**
   - Three dots menu:
     - View Details
     - Adjust Balance
     - View Transactions
     - Top-up History

#### **Filters**
- **School**: All or specific school
- **Status**: All, Active, Low Balance, Inactive
- **Balance Range**: Min/Max balance filter
- **Grade**: Filter by grade

#### **Search**
- Search by: Student name, Student ID
- Real-time search

#### **Sort Options**
- Balance (High to Low, Low to High)
- Last Top-up (Recent First, Oldest First)
- Student Name (A-Z, Z-A)

---

## 10. Account Details

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Account Details - John Doe                    [✕ Close]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Account Summary                                 │  │
│  │                                                  │  │
│  │  Current Balance: 2,500 RWF                      │  │
│  │  Currency: RWF                                   │  │
│  │  Status: ✅ Active                               │  │
│  │                                                  │  │
│  │  Total Deposits: 10,000 RWF                     │  │
│  │  Total Withdrawals: 7,500 RWF                   │  │
│  │  Net Balance: 2,500 RWF                         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Transaction History                             │  │
│  │  [Filter: All ▼] [Date Range ▼]                  │  │
│  │                                                  │  │
│  │  Date      │ Type      │ Amount │ Balance After│ │
│  ├────────────┼───────────┼────────┼──────────────┤ │
│  │ 2024-12-03 │ Purchase  │ -500   │ 2,500       │ │
│  │ 2024-12-02 │ Top-up    │ +2,000 │ 3,000       │ │
│  │ 2024-12-01 │ Purchase  │ -300   │ 1,000       │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Adjust Balance] [View All Transactions]        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Account Summary Section**
- Current balance (large, prominent)
- Currency display
- Status badge
- Total deposits (all-time)
- Total withdrawals (all-time)
- Net balance calculation

#### **Transaction History Table**
**Columns:**
1. **Date** (Sortable)
2. **Type** (Filterable)
   - Purchase (red/negative)
   - Top-up (green/positive)
   - Refund (blue)
   - Adjustment (gray)
3. **Amount** (Sortable)
   - Formatted with +/- sign
   - Color coded
4. **Balance After** (Sortable)
   - Balance after transaction
5. **Merchant** (for purchases)
6. **Actions**
   - View transaction details

#### **Actions**
- **Adjust Balance**: Opens balance adjustment modal
- **View All Transactions**: Navigate to full transaction list
- **Top-up History**: View all top-ups for this account

---

## 11. Devices Management

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Devices                            [+ Register Device] │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search devices...]  [Filter: All ▼] [School ▼]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Device Status Overview                          │  │
│  │  ✅ 6 Online | ⚠️ 1 Low Battery | ❌ 1 Offline  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Device List                                     │  │
│  │                                                  │  │
│  │  Name      │ Type      │ Status │ Battery │ Zone│ │
│  ├────────────┼───────────┼────────┼─────────┼─────┤ │
│  │ POS-001    │ POS       │ ✅     │ 85%     │ Canteen│
│  │            │           │ Online │         │     │ │
│  ├────────────┼───────────┼────────┼─────────┼─────┤ │
│  │ Reader-01  │ Attendance│ ✅     │ 92%     │ Gate│ │
│  │            │           │ Online │         │     │ │
│  ├────────────┼───────────┼────────┼─────────┼─────┤ │
│  │ Reader-02  │ Attendance│ ⚠️    │ 15%     │ Gate│ │
│  │            │           │ Online │ Low Bat │     │ │
│  ├────────────┼───────────┼────────┼─────────┼─────┤ │
│  │ Reader-03  │ Attendance│ ❌     │ -       │ Gate│ │
│  │            │           │ Offline│         │     │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-8 of 8 devices  [< Previous] [Next >]        │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Header Actions**
1. **Register Device Button**
   - Opens Register Device modal
   - Primary button style

2. **Search Bar**
   - Search by: Device name, Device ID
   - Real-time search

3. **Filter Dropdown**
   - All Devices
   - By Status (Online, Offline, Maintenance, Faulty)
   - By Type (POS, Attendance Reader, etc.)
   - By School (admin only)
   - By Zone

#### **Device Status Overview**
- Summary cards showing:
  - Online devices count
  - Low battery devices count
  - Offline devices count
  - Total devices

#### **Device List Table**
**Columns:**
1. **Name** (Sortable, Clickable)
   - Device name
   - Device ID (subtitle)
   - Click: View device details

2. **Type** (Filterable)
   - Badge style:
     - POS (blue)
     - Attendance Reader (green)
     - Canteen Reader (orange)

3. **Status** (Filterable)
   - Badge:
     - ✅ Online (green)
     - ⚠️ Maintenance (yellow)
     - ❌ Offline (red)
     - 🔧 Faulty (red)
     - ⚫ Inactive (gray)

4. **Battery** (Sortable)
   - Battery percentage
   - Progress bar indicator
   - Color coding:
     - Green: >50%
     - Yellow: 20-50%
     - Red: <20%

5. **Signal Strength** (Sortable)
   - Signal percentage
   - Progress bar
   - "-" if not available

6. **Zone** (Filterable)
   - Location zone
   - Building/Room info

7. **Last Seen** (Sortable)
   - Timestamp
   - Format: "X minutes ago" or date/time
   - Color: Red if >1 hour

8. **Health Score** (Sortable)
   - 0-100 score
   - Progress bar
   - Color coding by score

9. **Actions**
   - Three dots menu:
     - View Details
     - Configure
     - Update Status
     - View Logs
     - Deactivate

#### **Table Features:**
- **Sorting**: All columns sortable
- **Pagination**: 20, 50, 100 items per page
- **Real-time Updates**: Status updates via Socket.io
- **Bulk Actions** (when rows selected):
  - Update Status
  - Export Selected

---

## 12. Register Device

### Modal Layout
```
┌─────────────────────────────────────────────────────────┐
│  Register Device                              [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Device Information                              │  │
│  │                                                  │  │
│  │  Device ID *                                     │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ POS-001                                    │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  (Unique identifier for the device)              │  │
│  │                                                  │  │
│  │  Device Name *                                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Main Canteen POS                           │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Device Type *                                  │  │
│  │  [Select Type ▼]                                │  │
│  │  • POS                                           │  │
│  │  • Canteen Reader                                │  │
│  │  • Attendance Reader                             │  │
│  │  • ESP32                                         │  │
│  │  • RFID Reader                                   │  │
│  │                                                  │  │
│  │  Capabilities                                    │  │
│  │  [ ] RFID                                        │  │
│  │  [ ] NFC                                         │  │
│  │                                                  │  │
│  │  School *                                        │  │
│  │  [Select School ▼]                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Location Information                            │  │
│  │                                                  │  │
│  │  Zone                                            │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Canteen                                    │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Building                                        │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Main Building                              │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Floor                                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Ground Floor                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Room                                            │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Canteen Hall                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Coordinates (Optional)                          │  │
│  │  Latitude: [______] Longitude: [______]          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Merchant Association (for POS devices)         │  │
│  │                                                  │  │
│  │  Merchant                                        │  │
│  │  [Select Merchant ▼] [Create New Merchant]      │  │
│  │  (Only for POS/Canteen devices)                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Cancel]              [Register Device]        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Form Sections**
1. **Device Information**
   - Device ID (required, unique)
   - Device Name (required)
   - Device Type (dropdown, required)
   - Capabilities (checkboxes: RFID, NFC)
   - School (dropdown, required)

2. **Location Information**
   - Zone (optional)
   - Building (optional)
   - Floor (optional)
   - Room (optional)
   - Coordinates (latitude/longitude, optional)

3. **Merchant Association**
   - Only shown for POS/Canteen device types
   - Select existing merchant or create new
   - Links device to merchant for sales tracking

#### **After Registration:**
- Device created with auto-generated API keys
- API Key and Secret Key displayed (copyable)
- Warning: "Save these keys securely. They cannot be retrieved later."
- Option to download keys as text file

---

## 13. Device Details

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Device Details - POS-001                      [✕ Close]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Device Overview                                 │  │
│  │                                                  │  │
│  │  Name: Main Canteen POS                          │  │
│  │  Device ID: POS-001                              │  │
│  │  Type: POS                                       │  │
│  │  Status: ✅ Online                               │  │
│  │  Health Score: 95/100                            │  │
│  │  Last Seen: 2 minutes ago                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────┐  ┌─────────────────────┐ │
│  │  Device Metrics          │  │  Statistics          │ │
│  │                          │  │                      │ │
│  │  Battery: 85%           │  │  Total Scans: 1,245  │ │
│  │  [Progress Bar]         │  │  Successful: 1,200   │ │
│  │                          │  │  Failed: 45          │ │
│  │  Signal: 92%            │  │  Success Rate: 96%   │ │
│  │  [Progress Bar]         │  │                      │ │
│  │                          │  │  Uptime: 120 hours  │ │
│  │  Temperature: 25°C     │  │  Last Reset: 5 days  │ │
│  └──────────────────────────┘  └─────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Location                                        │  │
│  │  Zone: Canteen | Building: Main | Room: Hall    │  │
│  │  Coordinates: -1.9441, 30.0619                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Configuration                                    │  │
│  │  Firmware Version: 1.2.0                         │  │
│  │  Heartbeat Interval: 30 seconds                  │  │
│  │  Max Retries: 3                                  │  │
│  │  Timeout: 5000ms                                 │  │
│  │  [Edit Configuration]                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Recent Activity (Last 24 hours)                 │  │
│  │  Time      │ Event Type      │ Message           │ │
│  ├────────────┼─────────────────┼───────────────────┤ │
│  │ 10:30 AM   │ scan_success    │ Payment: 500 RWF │ │
│  │ 10:25 AM   │ scan_success    │ Payment: 300 RWF │ │
│  │ 10:20 AM   │ device_heartbeat│ Status update    │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Credentials                                 │  │
│  │  API Key: [Show] [Copy]                          │  │
│  │  Secret Key: [Show] [Copy]                        │  │
│  │  [Regenerate Keys] (Warning: Old keys will stop working)│
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Update Status] [Configure] [View Logs] [Close] │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Device Overview**
- Basic device information
- Status badge (real-time)
- Health score with visual indicator
- Last seen timestamp

#### **Device Metrics Panel**
- Battery level (progress bar)
- Signal strength (progress bar)
- Temperature (if available)
- Real-time updates

#### **Statistics Panel**
- Total scans count
- Successful scans
- Failed scans
- Success rate percentage
- Uptime (hours)
- Last reset date

#### **Location Information**
- Zone, building, floor, room
- Coordinates (clickable map link)

#### **Configuration Section**
- Current configuration values
- Edit button opens configuration modal
- Settings include:
  - Firmware version
  - Heartbeat interval
  - Max retries
  - Timeout
  - Custom settings (JSON)

#### **Recent Activity Table**
- Last 24 hours of device events
- Event types: scan_success, scan_failure, device_heartbeat, etc.
- Clickable to view full logs

#### **API Credentials**
- API Key (masked, show/hide toggle)
- Secret Key (masked, show/hide toggle)
- Copy buttons
- Regenerate keys option (with warning)

#### **Actions**
- **Update Status**: Change device status
- **Configure**: Edit device configuration
- **View Logs**: Navigate to device logs page
- **Close**: Return to devices list

---

## 14. Merchants Management

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Merchants                          [+ Add Merchant]    │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search merchants...]  [Filter: All ▼] [School ▼]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Merchant List                                  │  │
│  │                                                  │  │
│  │  Name      │ Type    │ Sales Today │ Status   │ │
│  ├────────────┼─────────┼─────────────┼───────────┤ │
│  │ Canteen A  │ Canteen │ 12,500 RWF  │ ✅ Active│ │
│  │            │         │             │          │ │
│  ├────────────┼─────────┼─────────────┼───────────┤ │
│  │ Store B    │ Store   │ 3,200 RWF   │ ✅ Active│ │
│  │            │         │             │          │ │
│  ├────────────┼─────────┼─────────────┼───────────┤ │
│  │ Cafeteria C│ Cafeteria│ 8,100 RWF  │ ✅ Active│ │
│  │            │         │             │          │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-3 of 3 merchants  [< Previous] [Next >]     │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Header Actions**
1. **Add Merchant Button**
   - Opens Add Merchant modal
   - Primary button

2. **Search Bar**
   - Search by: Merchant name
   - Real-time search

3. **Filter Dropdown**
   - All Merchants
   - By Type (Canteen, Store, Cafeteria)
   - By School (admin only)
   - By Status (Active, Inactive)

#### **Merchant List Table**
**Columns:**
1. **Name** (Sortable, Clickable)
   - Merchant name
   - Click: View merchant details

2. **Type** (Filterable)
   - Badge style:
     - Canteen (blue)
     - Store (green)
     - Cafeteria (orange)

3. **Sales Today** (Sortable)
   - Today's total sales
   - Format: "X,XXX RWF"
   - Real-time updates

4. **Total Sales** (Sortable)
   - All-time total sales
   - Format: "X,XXX RWF"

5. **Status** (Filterable)
   - ✅ Active (green)
   - ❌ Inactive (gray)

6. **Actions**
   - Three dots menu:
     - View Details
     - Edit Merchant
     - View Sales Report
     - Deactivate

---

## 15. Add/Edit Merchant

### Modal Layout
```
┌─────────────────────────────────────────────────────────┐
│  Add Merchant                                [✕ Close]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Basic Information                              │  │
│  │                                                  │  │
│  │  Name *                                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Canteen A                                  │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Type *                                         │  │
│  │  [Select Type ▼]                                │  │
│  │  • Canteen                                      │  │
│  │  • Cafeteria                                    │  │
│  │  • Store                                        │  │
│  │  • Other                                        │  │
│  │                                                  │  │
│  │  School *                                       │  │
│  │  [Select School ▼]                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Location Information                           │  │
│  │                                                  │  │
│  │  Zone                                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Canteen Zone                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Building                                       │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Main Building                              │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Room                                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Canteen Hall                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Contact Information                             │  │
│  │                                                  │  │
│  │  Manager Name                                   │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Phone                                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ +250 788 123456                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Email                                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ canteen@school.edu                          │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Operating Hours                                 │  │
│  │                                                  │  │
│  │  Open Time                                       │  │
│  │  [08:00]                                         │  │
│  │                                                  │  │
│  │  Close Time                                      │  │
│  │  [17:00]                                         │  │
│  │                                                  │  │
│  │  Days of Week                                    │  │
│  │  [✓] Monday  [✓] Tuesday  [✓] Wednesday        │  │
│  │  [✓] Thursday [✓] Friday   [ ] Saturday        │  │
│  │  [ ] Sunday                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Cancel]              [Save Merchant]          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Form Sections**
1. **Basic Information**
   - Name (required)
   - Type (dropdown, required)
   - School (dropdown, required)

2. **Location Information**
   - Zone (optional)
   - Building (optional)
   - Room (optional)

3. **Contact Information**
   - Manager Name (optional)
   - Phone (optional)
   - Email (optional)

4. **Operating Hours**
   - Open Time (time picker)
   - Close Time (time picker)
   - Days of Week (checkboxes)

---

## 16. Merchant Sales Report

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Sales Report - Canteen A    [Date Range ▼] [Export]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Sales Summary                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  │  │ Total    │  │ Transactions│ │ Average │    │  │
│  │  │ Sales    │  │              │ │ Amount  │    │  │
│  │  │ 45,000   │  │    120       │ │   375   │    │  │
│  │  │ RWF      │  │              │ │   RWF   │    │  │
│  │  └──────────┘  └──────────┘  └──────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Sales Chart                                     │  │
│  │  [Bar Chart: Daily sales for selected period]   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Transaction List                                │  │
│  │  [Search...] [Filter: All ▼]                     │  │
│  │                                                  │  │
│  │  Time    │ Student      │ Amount │ Reference   │ │
│  │  ├───────┼──────────────┼────────┼─────────────┤ │
│  │  │ 10:30 │ John Doe     │ 500    │ TXN-...     │ │
│  │  │ 10:25 │ Mary Smith   │ 300    │ TXN-...     │ │
│  │  │ 10:20 │ Peter Jones │ 200    │ TXN-...     │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 120 transactions  [< Previous] [Next>]│
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Sales Summary Cards**
1. **Total Sales**: Sum of all transactions
2. **Transactions**: Total transaction count
3. **Average Amount**: Average transaction amount

#### **Sales Chart**
- Bar chart showing daily sales
- Period based on date range filter
- Tooltip shows exact amount

#### **Transaction List**
- All transactions for this merchant
- Searchable
- Filterable by date, student
- Exportable

---

## 17. Card Management

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Card Management                                         │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search by Card UID or Student...]                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Card Search Results                             │  │
│  │                                                  │  │
│  │  Card UID: ABC123456789                          │  │
│  │  Student: John Doe (ST001)                       │  │
│  │  Status: ✅ Active                               │  │
│  │  Assigned: 2024-11-01                            │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Card Actions                             │  │  │
│  │  │  [Deactivate] [Reactivate] [Replace Card] │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                  │  │
│  │  Card History                                    │  │
│  │  • Activated on 2024-11-01                      │  │
│  │  • Replaced on 2024-11-15 (Old: XYZ789)        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  All Cards (by Status)                          │  │
│  │  [Active ▼] [Lost ▼] [Stolen ▼] [Deactivated ▼]│  │
│  │                                                  │  │
│  │  Card UID      │ Student      │ Status │ Date  │ │
│  │  ├─────────────┼──────────────┼────────┼───────┤ │
│  │  │ ABC123456789│ John Doe     │ Active │ 11-01 │ │
│  │  │ DEF987654321│ Mary Smith   │ Lost   │ 12-01 │ │
│  │  │ GHI456789123│ Peter Jones  │ Active │ 11-05 │ │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Card Search**
- Search by Card UID or Student name/ID
- Real-time search
- Shows card details when found

#### **Card Details Section**
- Card UID
- Student information
- Current status
- Assignment date
- Card history

#### **Card Actions**
1. **Deactivate Card**
   - Opens modal with reason selection:
     - Lost
     - Stolen
     - Other (with text input)
   - Confirmation required

2. **Reactivate Card**
   - Reactivates deactivated card
   - Confirmation required

3. **Replace Card**
   - Opens modal:
     - Old Card UID (pre-filled)
     - New Card UID (input)
     - Reason (optional)
   - Creates replacement record

#### **All Cards Table**
- Filterable by status
- Shows all cards with status
- Quick actions per card

---

## 18. Reports & Export

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Reports & Export                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Generate Report                                │  │
│  │                                                  │  │
│  │  Report Type *                                  │  │
│  │  [Select Report Type ▼]                         │  │
│  │  • Attendance Report                            │  │
│  │  • Transaction Report                           │  │
│  │  • Sales Report                                 │  │
│  │  • Account Balance Report                       │  │
│  │  • Student History Report                       │  │
│  │  • Device Activity Report                       │  │
│  │                                                  │  │
│  │  Date Range *                                   │  │
│  │  From: [2024-12-01]  To: [2024-12-03]          │  │
│  │                                                  │  │
│  │  Filters                                        │  │
│  │  School: [All Schools ▼]                       │  │
│  │  Grade: [All Grades ▼]                          │  │
│  │  Student: [All Students ▼]                     │  │
│  │  Merchant: [All Merchants ▼]                   │  │
│  │                                                  │  │
│  │  Format *                                       │  │
│  │  [ ] PDF  [✓] CSV  [ ] Excel                   │  │
│  │                                                  │  │
│  │  [Generate Report]                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Report History                                 │  │
│  │  Date      │ Type            │ Format │ [Download]│ │
│  │  ├─────────┼─────────────────┼────────┼──────────┤ │
│  │  │ 12-03   │ Attendance      │ CSV    │ [↓]      │ │
│  │  │ 12-02   │ Transactions    │ PDF    │ [↓]      │ │
│  │  │ 12-01   │ Sales           │ CSV    │ [↓]      │ │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Report Generation Form**
1. **Report Type** (Required)
   - Attendance Report
   - Transaction Report
   - Sales Report
   - Account Balance Report
   - Student History Report
   - Device Activity Report

2. **Date Range** (Required)
   - From date picker
   - To date picker

3. **Filters** (Optional)
   - School (dropdown)
   - Grade (dropdown)
   - Student (dropdown)
   - Merchant (dropdown)
   - Device (dropdown)

4. **Format** (Required)
   - PDF
   - CSV
   - Excel

#### **Report History**
- List of previously generated reports
- Download links
- Date and type shown
- Auto-cleanup after 30 days

---

## 19. Settings

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Settings                                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Tabs: [General] [SMS] [Notifications] [System]         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  General Settings                                 │  │
│  │                                                  │  │
│  │  School Name                                      │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Green Valley School                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Default Currency                                │  │
│  │  [RWF ▼]                                         │  │
│  │                                                  │  │
│  │  Low Balance Threshold                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ 500                                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  RWF (Alert parents when balance below this)     │  │
│  │                                                  │  │
│  │  [Save Changes]                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SMS Settings                                    │  │
│  │                                                  │  │
│  │  SMS Provider                                    │  │
│  │  [Africa's Talking ▼]                           │  │
│  │                                                  │  │
│  │  API Key                                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ••••••••••••••••                          │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  [Show] [Update]                                 │  │
│  │                                                  │  │
│  │  Username                                        │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ••••••••••••••••                          │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  [Show] [Update]                                 │  │
│  │                                                  │  │
│  │  [Test SMS] [Save]                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Notification Settings                          │  │
│  │                                                  │  │
│  │  Email Notifications                            │  │
│  │  [✓] Enable email notifications                 │  │
│  │  Admin Email: [admin@school.edu]               │  │
│  │                                                  │  │
│  │  SMS Notifications                              │  │
│  │  [✓] Enable SMS notifications                   │  │
│  │  [✓] Attendance alerts                          │  │
│  │  [✓] Payment alerts                             │  │
│  │  [✓] Low balance alerts                         │  │
│  │                                                  │  │
│  │  [Save]                                         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  System Settings (Admin Only)                   │  │
│  │                                                  │  │
│  │  Database Cleanup                               │  │
│  │  Delete logs older than: [90] days              │  │
│  │  [Cleanup Now]                                  │  │
│  │                                                  │  │
│  │  Backup                                          │  │
│  │  [Create Backup] [Download Backup]              │  │
│  │                                                  │  │
│  │  Maintenance Mode                               │  │
│  │  [ ] Enable maintenance mode                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **General Settings Tab**
- School information
- Default currency
- Low balance threshold
- Timezone
- Date format

#### **SMS Settings Tab**
- SMS provider selection
- API credentials (masked)
- Test SMS functionality
- SMS cost tracking

#### **Notification Settings Tab**
- Email notification preferences
- SMS notification preferences
- Notification types toggles
- Admin email configuration

#### **System Settings Tab** (Admin Only)
- Database cleanup
- Backup management
- Maintenance mode
- System logs retention

---

## 20. User Profile

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Profile                                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Profile Information                             │  │
│  │                                                  │  │
│  │  ┌──────────┐                                   │  │
│  │  │   [👤]   │  (Avatar placeholder)              │  │
│  │  └──────────┘                                   │  │
│  │                                                  │  │
│  │  First Name *                                    │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ John                                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Last Name *                                     │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ Doe                                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Email *                                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ admin@school.edu                          │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  (Cannot be changed)                             │  │
│  │                                                  │  │
│  │  Role                                            │  │
│  │  Admin                                           │  │
│  │  (Cannot be changed)                             │  │
│  │                                                  │  │
│  │  School                                          │  │
│  │  Green Valley School                             │  │
│  │  (For school staff)                              │  │
│  │                                                  │  │
│  │  [Save Changes]                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Change Password                                │  │
│  │                                                  │  │
│  │  Current Password *                             │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ••••••••                                   │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  New Password *                                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ••••••••                                   │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  Confirm New Password *                         │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ ••••••••                                   │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  [Change Password]                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Profile Information**
- Avatar placeholder
- First Name (editable)
- Last Name (editable)
- Email (read-only)
- Role (read-only)
- School (read-only, for school staff)

#### **Change Password**
- Current password (required)
- New password (required, with strength indicator)
- Confirm password (required)
- Password requirements shown
- Validation feedback

---

## 21. Top-up Management (Admin/School Staff)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Top-up Management    [Status: All ▼] [Date Range ▼]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Top-up Requests                                │  │
│  │  [Search...] [Filter: All ▼]                     │  │
│  │                                                  │  │
│  │  Reference │ Student    │ Amount │ Status │ Date│ │
│  │  ├─────────┼────────────┼────────┼────────┼─────┤ │
│  │  │ TOPUP-1 │ John Doe   │ 5,000  │ Pending│ 12-03│ │
│  │  │         │            │ RWF    │        │      │ │
│  │  ├─────────┼────────────┼────────┼────────┼─────┤ │
│  │  │ TOPUP-2 │ Mary Smith │ 2,000  │ Completed│12-02│ │
│  │  │         │            │ RWF    │        │      │ │
│  │  ├─────────┼────────────┼────────┼────────┼─────┤ │
│  │  │ TOPUP-3 │ Peter Jones│ 3,000  │ Failed │ 12-01│ │
│  │  │         │            │ RWF    │        │      │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Manual Top-up                                   │  │
│  │  (For parents who visit/call)                   │  │
│  │                                                  │  │
│  │  Student *                                       │  │
│  │  [Select Student ▼]                              │  │
│  │                                                  │  │
│  │  Amount *                                        │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ 5000                                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │  RWF                                            │  │
│  │                                                  │  │
│  │  Payment Method *                               │  │
│  │  [Select Method ▼]                               │  │
│  │  • Cash                                         │  │
│  │  • Mobile Money                                 │  │
│  │  • Bank Transfer                                │  │
│  │                                                  │  │
│  │  Payment Reference                              │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │ (Optional - for tracking)                 │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  [Process Top-up]                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Top-up Requests Table**
- All top-up requests (pending, processing, completed, failed)
- Filterable by status
- Searchable by student name
- Actions:
  - View Details
  - Process Top-up (for pending)
  - Mark as Failed
  - Cancel

#### **Manual Top-up Section**
- For processing top-ups when parents visit/call
- Student selection
- Amount input
- Payment method selection
- Payment reference (optional)
- Process button

---

## 22. Parents Management (School Staff)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Parents                             [+ Add Parent]      │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search parents...]  [Filter: All ▼] [Export]       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Parent List                                    │  │
│  │                                                  │  │
│  │  Name          │ Phone      │ Email    │ Children│ │
│  │  ├─────────────┼────────────┼──────────┼─────────┤ │
│  │  │ John Smith  │ +250 788...│ john@... │ 2       │ │
│  │  ├─────────────┼────────────┼──────────┼─────────┤ │
│  │  │ Mary Brown  │ +250 789...│ mary@... │ 1       │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 1-20 of 150 parents  [< Previous] [Next >]     │
└─────────────────────────────────────────────────────────┘
```

### Features:

#### **Parent List Table**
**Columns:**
1. **Name** (Sortable, Clickable)
2. **Phone** (Sortable)
3. **Email** (Sortable)
4. **Children Count** (Sortable)
5. **SMS Enabled** (Filterable)
   - ✅ Yes (green)
   - ❌ No (gray)
6. **Actions**
   - View Details
   - Edit Parent
   - View Children
   - Deactivate

---

## 23. Schools Management (Admin Only)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Schools                             [+ Add School]     │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search schools...]  [Filter: All ▼] [Export]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  School List                                    │  │
│  │                                                  │  │
│  │  Name          │ Address    │ Phone    │ Status │ │
│  │  ├─────────────┼────────────┼──────────┼────────┤ │
│  │  │ Green Valley│ 123 Main St│ +250... │ ✅     │ │
│  │  │ School      │            │          │ Active │ │
│  │  ├─────────────┼────────────┼──────────┼────────┤ │
│  │  │ Sunrise     │ 456 Oak Ave│ +250... │ ✅     │ │
│  │  │ School      │            │          │ Active │ │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:
- School CRUD operations
- School details view
- Statistics per school
- Deactivate/reactivate schools

---

## 24. System Logs (Admin Only)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  System Logs    [Date Range ▼] [Severity ▼] [Export]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Log Statistics                                  │  │
│  │  Total: 12,450 | Errors: 45 | Warnings: 120    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Log Entries                                     │  │
│  │  Time      │ Device    │ Event Type │ Severity │ │
│  │  ├─────────┼───────────┼────────────┼──────────┤ │
│  │  │ 10:30   │ POS-001   │ scan_success│ Low     │ │
│  │  │ 10:25   │ Reader-01 │ error      │ High    │ │
│  │  │ 10:20   │ POS-001   │ device_online│ Low   │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  [Cleanup Old Logs] [Export]                            │
└─────────────────────────────────────────────────────────┘
```

### Features:
- System-wide log viewing
- Filter by severity, event type, date
- Log statistics
- Cleanup functionality
- Export logs

---

## 25. User Management (Admin Only)

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  Users                                [+ Add User]       │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search users...]  [Filter: Role ▼] [School ▼]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  User List                                      │  │
│  │                                                  │  │
│  │  Name          │ Email      │ Role   │ School │ │
│  │  ├─────────────┼────────────┼────────┼─────────┤ │
│  │  │ Admin User  │ admin@...  │ Admin  │ -      │ │
│  │  │ John Staff  │ staff@...   │ School │ Green  │ │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Features:
- View all users
- Filter by role, school
- Create new users
- Deactivate users
- Reset passwords

---

## 📊 Role-Based UI Differences

### Admin Role
- **Full Access**: All features available
- **Schools Management**: Can create/manage all schools
- **System Logs**: Full system log access
- **User Management**: Manage all users
- **Cross-School**: Can view data from all schools

### School Staff Role
- **Limited Access**: Only their school's data
- **No Schools Management**: Cannot create schools
- **No System Logs**: No system-wide logs
- **No User Management**: Cannot manage users
- **School-Scoped**: All data filtered to their school

### Sidebar Differences
**Admin Sidebar:**
- Dashboard
- Schools (admin only)
- Students
- Attendance
- Payments
- Accounts
- Devices
- Merchants
- Cards
- Reports
- Users (admin only)
- Logs (admin only)
- Settings

**School Staff Sidebar:**
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

---

## 🎨 UI Component Specifications

### Color Scheme
- **Primary**: #1890FF (Blue)
- **Success**: #52C41A (Green)
- **Warning**: #FA8C16 (Orange)
- **Error**: #F5222D (Red)
- **Info**: #1890FF (Blue)
- **Background**: #F5F5F5 (Light Gray)
- **Card Background**: #FFFFFF (White)
- **Text Primary**: #262626 (Dark Gray)
- **Text Secondary**: #8C8C8C (Gray)
- **Border**: #E8E8E8 (Light Gray)

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial
- **Heading 1**: 24px, Bold
- **Heading 2**: 20px, Bold
- **Heading 3**: 16px, Bold
- **Body**: 14px, Regular
- **Small**: 12px, Regular

### Spacing
- **Unit**: 8px base
- **Padding**: 16px, 24px
- **Margin**: 8px, 16px, 24px
- **Gap**: 16px, 24px

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: White background, blue border
- **Danger**: Red background, white text
- **Size**: Small (32px), Medium (40px), Large (48px)

### Tables
- **Row Height**: 48px
- **Header**: Bold, 14px
- **Hover**: Light gray background
- **Selected**: Blue background tint

### Forms
- **Input Height**: 40px
- **Border Radius**: 4px
- **Focus**: Blue border (2px)
- **Error**: Red border, error message below

---

## 📱 Responsive Breakpoints

- **Desktop**: > 1200px (Full layout)
- **Tablet**: 768px - 1200px (Collapsible sidebar)
- **Mobile**: < 768px (Stacked layout, hidden sidebar)

---

**Last Updated**: 2024  
**Status**: Complete UI specification for all screens

---

## 📸 Photo Feature Summary

The student photo feature has been integrated throughout the UI:

1. **Student Registration**: Optional photo upload during registration
2. **Student List**: Photo thumbnail column (50x50px)
3. **Student Profile**: Large photo display (200x200px) with upload/delete options
4. **Payment Verification Screen**: Large photo (300x300px) for identity verification at POS/canteen
5. **Transaction Details**: Student photo (150x150px) in transaction view

**Key Implementation Points:**
- Photos are optional but recommended
- Photo URL format: `${API_BASE_URL}${student.photo}`
- Default avatar fallback if no photo
- Photo management: Upload, Update, Delete endpoints available
- Payment verification screen is the primary use case for photos

See `UI_PHOTO_FEATURE_UPDATES.md` for complete implementation guide.
