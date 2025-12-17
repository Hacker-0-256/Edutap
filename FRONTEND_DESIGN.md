# 🎨 EduTap Frontend Design Specification

## Overview

EduTap requires **one frontend application**:
1. **Admin Dashboard** (React Web App) - For administrators and school staff

**Note**: Parents receive all information via SMS notifications. No parent UI/app is needed.

---

## 📱 1. ADMIN DASHBOARD (React Web App)

### Design Theme
- **Modern & Clean**: Material Design or Ant Design components
- **Color Scheme**: 
  - Primary: Blue (#1890FF) - Trust, professionalism
  - Success: Green (#52C41A) - Positive actions
  - Warning: Orange (#FA8C16) - Alerts
  - Danger: Red (#F5222D) - Errors
  - Background: Light gray (#F5F5F5)
- **Typography**: Sans-serif (Inter, Roboto, or system fonts)
- **Responsive**: Desktop-first, tablet-friendly

---

### 🏗️ Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | Search | Notifications | User Profile  │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │         Main Content Area                    │
│          │                                              │
│ - Dashboard│                                            │
│ - Students │                                            │
│ - Attendance│                                           │
│ - Payments │                                            │
│ - Devices  │                                            │
│ - Merchants│                                            │
│ - Reports  │                                            │
│ - Settings │                                            │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

---

### 📄 Screen Designs

#### **1. Login Screen**
```
┌─────────────────────────────────────┐
│         [EduTap Logo]               │
│                                     │
│    School Management System          │
│                                     │
│  Email: [________________]          │
│  Password: [____________] [👁️]      │
│                                     │
│  [ ] Remember me                    │
│                                     │
│  [    Login    ]                    │
│                                     │
│  Forgot password?                   │
└─────────────────────────────────────┘
```

**Features:**
- Email/password login
- "Remember me" checkbox
- Forgot password link
- Role-based redirect after login

---

#### **2. Dashboard (Home)**
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                    [Today]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Students │  │Attendance│  │ Payments │  │ Devices ││
│  │   245    │  │   89%    │  │ 12,500   │  │   8     ││
│  │  Active  │  │  Today   │  │   RWF    │  │ Online  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Today's Attendance (Real-time)                  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ [Chart: Attendance over time]              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ Recent Transactions  │  │ Device Status         │   │
│  │ • John - 500 RWF     │  │ ✅ POS-001 Online     │   │
│  │ • Mary - 300 RWF     │  │ ✅ Reader-01 Online   │   │
│  │ • Peter - 200 RWF    │  │ ⚠️  Reader-02 Low Bat │   │
│  └──────────────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time statistics cards
- Live attendance chart
- Recent transactions list
- Device status indicators
- Quick actions

---

#### **3. Students Management**
```
┌─────────────────────────────────────────────────────────┐
│  Students                          [+ Add Student]       │
├─────────────────────────────────────────────────────────┤
│  [Search...]  [Filter: All ▼]  [Export]  [Bulk Import] │
├─────────────────────────────────────────────────────────┤
│  Name          │ ID    │ Grade │ Card Status │ Balance │
├────────────────┼───────┼───────┼─────────────┼─────────┤
│  John Doe      │ ST001 │  5A   │ ✅ Active   │ 2,500   │
│  Mary Smith    │ ST002 │  5B   │ ✅ Active   │ 1,200   │
│  Peter Jones   │ ST003 │  6A   │ ⚠️  Lost    │ 0       │
│  ...           │ ...   │ ...   │ ...         │ ...     │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Student list with search/filter
- Add/Edit/Delete students
- Card status indicators
- Balance display
- Bulk import (CSV)
- Export to CSV/PDF

---

#### **4. Attendance Monitoring**
```
┌─────────────────────────────────────────────────────────┐
│  Attendance                    [Date: Today ▼]          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Summary: 89% Present | 11% Absent              │   │
│  │  [Chart: Attendance trend]                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ Present (218)        │  │ Absent (27)          │    │
│  │ • John Doe - 08:15   │  │ • Alice Brown        │    │
│  │ • Mary Smith - 08:20 │  │ • Bob Wilson         │    │
│  │ • ...                │  │ • ...                │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  [Export Report] [View History]                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time attendance updates (Socket.io)
- Present/Absent lists
- Attendance charts
- Date range selection
- Export reports
- Individual student history

---

#### **5. Payments/Transactions Dashboard**
```
┌─────────────────────────────────────────────────────────┐
│  Transactions              [Date Range ▼] [Export]      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Today: 12,500 RWF | Total: 45,000 RWF           │   │
│  │  [Chart: Transaction volume]                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Transaction History                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Time    │ Student      │ Amount │ Merchant │ Ref │ │
│  ├─────────┼──────────────┼────────┼──────────┼─────┤ │
│  │ 10:30   │ John Doe     │ 500    │ Canteen  │ ... │ │
│  │ 10:25   │ Mary Smith   │ 300    │ Canteen  │ ... │ │
│  │ 10:20   │ Peter Jones  │ 200    │ Store    │ ... │ │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Refund Transaction] [View Details]                    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Transaction list with filters
- Revenue statistics
- Transaction charts
- Refund functionality
- Search by student/merchant
- Export reports

---

#### **6. Account Balances**
```
┌─────────────────────────────────────────────────────────┐
│  Account Balances           [School: All ▼] [Export]    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Total Balance: 125,000 RWF                      │   │
│  │  Accounts: 245 | Avg Balance: 510 RWF            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Student Accounts                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Student        │ Balance │ Last Top-up │ Status │ │
│  ├────────────────┼─────────┼─────────────┼────────┤ │
│  │ John Doe       │ 2,500   │ 2 days ago  │ Active │ │
│  │ Mary Smith     │ 1,200   │ 5 days ago  │ Active │ │
│  │ Peter Jones    │ 0       │ -           │ Low    │ │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Adjust Balance] [Top-up History]                     │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Account balance overview
- Low balance alerts
- Top-up history
- Manual balance adjustment
- Export reports

---

#### **7. Device Management**
```
┌─────────────────────────────────────────────────────────┐
│  Devices                            [+ Register Device]  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Device Status Overview                          │   │
│  │  ✅ 6 Online | ⚠️ 1 Low Battery | ❌ 1 Offline   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Device List                                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Name      │ Type      │ Status │ Battery │ Zone │ │
│  ├───────────┼───────────┼────────┼─────────┼───────┤ │
│  │ POS-001   │ POS       │ ✅     │ 85%     │ Canteen│
│  │ Reader-01 │ Attendance│ ✅     │ 92%     │ Gate  │ │
│  │ Reader-02 │ Attendance│ ⚠️    │ 15%     │ Gate  │ │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [View Details] [Configure] [Update Status]             │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Device list with status
- Health monitoring (battery, signal)
- Device configuration
- Real-time status updates
- Zone management

---

#### **8. Merchants/Canteens**
```
┌─────────────────────────────────────────────────────────┐
│  Merchants                          [+ Add Merchant]    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Merchant List                                   │   │
│  │  Name      │ Type    │ Sales Today │ Status     │   │
│  ├───────────┼─────────┼─────────────┼─────────────┤ │
│  │ Canteen A │ Canteen │ 12,500 RWF  │ ✅ Active  │   │
│  │ Store B   │ Store   │ 3,200 RWF   │ ✅ Active  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [View Sales Report] [Edit] [Deactivate]                │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Merchant list
- Sales statistics
- Sales reports
- Merchant management

---

#### **9. Reports & Export**
```
┌─────────────────────────────────────────────────────────┐
│  Reports                                                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │  Report Type: [Attendance ▼]                    │   │
│  │  Date Range: [Start] to [End]                    │   │
│  │  Format: [PDF ▼] [CSV ▼]                        │   │
│  │  [Generate Report]                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Available Reports:                                      │
│  • Attendance Report                                    │
│  • Transaction Report                                   │
│  • Sales Report                                         │
│  • Account Balance Report                               │
│  • Student History Report                               │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Multiple report types
- Date range selection
- Export formats (PDF, CSV)
- Scheduled reports
- Report history

---

#### **10. Card Management**
```
┌─────────────────────────────────────────────────────────┐
│  Card Management                                         │
├─────────────────────────────────────────────────────────┤
│  Search Card: [Card UID...]                             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Card Details                                   │   │
│  │  UID: ABC123456789                              │   │
│  │  Student: John Doe                               │   │
│  │  Status: ✅ Active                               │   │
│  │                                                  │   │
│  │  [Deactivate] [Replace Card] [View History]      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Card search
- Card status management
- Deactivate/reactivate
- Card replacement
- Card history

---

### 🎨 Component Library

#### **Reusable Components**
1. **DataTable** - Sortable, filterable tables
2. **StatCard** - Dashboard statistics cards
3. **Chart** - Line, bar, pie charts (Recharts)
4. **Modal** - For forms and confirmations
5. **Toast** - Success/error notifications
6. **Badge** - Status indicators
7. **SearchBar** - Global search
8. **DatePicker** - Date range selection
9. **ExportButton** - Export dropdown
10. **StatusIndicator** - Online/offline badges

---

## 📱 2. PARENT COMMUNICATION (SMS Only)

### SMS Notifications for Parents

Parents receive all information via SMS. **No mobile app or web interface needed.**

#### **SMS Types:**

1. **Attendance Notification**
   ```
   Hello [Parent Name], your child [Student Name] 
   has arrived at school at [Time] on [Date]. 
   - [School Name]
   ```

2. **Payment Transaction**
   ```
   Hello [Parent Name], [Student Name] made a 
   purchase of [Amount] RWF at [Merchant Name] 
   at [Time]. New balance: [Balance] RWF.
   ```

3. **Low Balance Alert**
   ```
   Hello [Parent Name], [Student Name]'s account 
   balance is low: [Balance] RWF. Please top up 
   to ensure uninterrupted service.
   ```

4. **Top-up Confirmation**
   ```
   Hello [Parent Name], your top-up of [Amount] 
   RWF for [Student Name] was successful. 
   New balance: [Balance] RWF.
   ```

5. **Top-up Failure**
   ```
   Hello [Parent Name], your top-up of [Amount] 
   RWF for [Student Name] failed. Please try 
   again or contact support.
   ```

6. **Card Status Alert**
   ```
   Hello [Parent Name], [Student Name]'s card 
   has been [deactivated/reactivated]. 
   Please contact the school for details.
   ```

### SMS Configuration

- **Opt-in/Opt-out**: Parents can enable/disable SMS notifications
- **Frequency**: Real-time for critical events, daily summaries optional
- **Language**: Support for multiple languages (English, Kinyarwanda)
- **Cost**: Managed by school/admin

---

## 🔄 User Flows

### Admin Flow
```
Login → Dashboard → 
  ├─ Students → Add/Edit Student → Assign Card
  ├─ Attendance → View Today → Export Report
  ├─ Payments → View Transactions → Refund
  ├─ Devices → Register Device → Configure
  ├─ Accounts → View Balances → Adjust Balance
  ├─ Merchants → Manage Canteens → View Sales
  └─ Reports → Generate → Export
```

### Parent Flow (SMS Only)
```
Parent receives SMS → 
  ├─ Attendance notification (on arrival)
  ├─ Payment notification (on purchase)
  ├─ Low balance alert (when balance < threshold)
  ├─ Top-up confirmation (after top-up)
  └─ Card status alerts (if card issues)
```

---

## 🎯 Key Features by Role

### Admin Dashboard
- ✅ Real-time dashboard with live updates
- ✅ Student management (CRUD)
- ✅ Attendance monitoring
- ✅ Payment/transaction tracking
- ✅ Device management
- ✅ Merchant management
- ✅ Card management
- ✅ Reports & exports
- ✅ Account balance management
- ✅ SMS notification management
- ✅ Top-up processing (for parents who call/visit)

### Parent Communication (SMS Only)
- ✅ Real-time attendance notifications
- ✅ Payment transaction alerts
- ✅ Low balance warnings
- ✅ Top-up confirmations
- ✅ Card status alerts
- ✅ Opt-in/opt-out preferences (managed by admin)

---

## 🛠️ Technology Recommendations

### Admin Dashboard
- **Framework**: React 18+ with TypeScript
- **UI Library**: Ant Design or Material-UI
- **Charts**: Recharts
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Build Tool**: Vite or Create React App

### SMS Service (Backend)
- **Provider**: Africa's Talking or Twilio
- **Integration**: Already implemented in backend
- **Configuration**: Via admin dashboard settings

---

## 📐 Design Principles

1. **Consistency**: Same design language across all screens
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Performance**: Fast load times, smooth animations
4. **Responsive**: Works on all screen sizes
5. **Intuitive**: Easy to navigate, clear actions
6. **Real-time**: Live updates via WebSocket
7. **Offline**: Basic offline support (mobile app)

---

## 🚀 Implementation Priority

### Phase 1: Core Features (Week 1-2)
1. Authentication (login/logout)
2. Dashboard (statistics, real-time updates)
3. Student management (CRUD operations)
4. Attendance viewing (today's attendance, history)
5. Basic payment viewing (transaction list)

### Phase 2: Advanced Features (Week 3-4)
1. Real-time updates (Socket.io integration)
2. Reports & exports (CSV/PDF generation)
3. Device management (register, configure, monitor)
4. Account management (balances, adjustments)
5. Merchant management (CRUD, sales tracking)
6. Charts & analytics (attendance trends, revenue)

### Phase 3: Advanced Features (Week 5-6)
1. Card management (deactivate/reactivate/replace)
2. Top-up processing (manual top-up for parents)
3. Advanced filtering & search
4. Bulk operations (import students, export data)
5. SMS notification settings (configure SMS templates)

### Phase 4: Polish (Week 7)
1. Performance optimization
2. Error handling improvements
3. UI/UX refinements
4. Documentation
5. Testing

---

**Last Updated**: 2024  
**Status**: Design specification ready for implementation


