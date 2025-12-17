# 📋 EduTap Implementation Todo List

## Overview
This todo list covers all missing features needed to meet the EduTap proposal requirements. Items are organized by priority and implementation phase.

**Total Tasks: 48**  
**Estimated Time: 5-7 weeks**

---

## 🔴 PHASE 1: Core Payment System (CRITICAL - Week 1-2)

### Database Models
- [ ] **Task 1**: Create Account/Wallet model for student balances
  - Fields: studentId, balance, currency, isActive, lastTopUp
  - Methods: addBalance, deductBalance, getBalance
  
- [ ] **Task 2**: Create Transaction model for payment/purchase tracking
  - Fields: studentId, accountId, type, amount, balanceBefore, balanceAfter, merchantId, deviceId, status, reference
  - Indexes: studentId, date, reference (unique)
  
- [ ] **Task 3**: Create Merchant model for canteen/merchant management
  - Fields: name, type, schoolId, location, isActive
  - Methods: getSales, getRevenue
  
- [ ] **Task 4**: Create TopUp model for top-up requests and processing
  - Fields: studentId, parentId, amount, paymentMethod, status, paymentReference, processedAt
  - Status: pending, processing, completed, failed

### Model Enhancements
- [ ] **Task 5**: Enhance Student model with cardStatus and account reference
  - Add: cardStatus (active, lost, stolen, deactivated), cardDeactivatedAt, previousCardUID
  - Add: accountId reference to Account model
  
- [ ] **Task 6**: Enhance Device model to support POS/canteen device types
  - Add: 'pos', 'canteen_reader' to deviceType enum
  - Add: merchantId reference for POS devices

---

## 🟠 PHASE 2: Payment Processing Logic (CRITICAL - Week 2)

### Core Functions
- [ ] **Task 7**: Implement payment processing function
  - `processPayment(cardUID, amount, merchantId, deviceId)`
  - `validateBalance(studentId, amount)`
  - `deductBalance(studentId, amount)`
  - `recordTransaction(transactionData)`
  - Handle insufficient balance
  - Generate transaction reference

- [ ] **Task 8**: Implement top-up processing function
  - `initiateTopUp(parentId, studentId, amount, paymentMethod)`
  - `processTopUp(topUpId, paymentReference)`
  - `addBalance(studentId, amount)`
  - Handle failed top-ups

- [ ] **Task 9**: Implement card management functions
  - `deactivateCard(cardUID, reason)`
  - `reactivateCard(cardUID)`
  - `replaceCard(oldCardUID, newCardUID)`
  - `validateCardStatus(cardUID)` - check if card can be used

---

## 🟡 PHASE 3: API Controllers (HIGH - Week 2-3)

### Controllers
- [ ] **Task 10**: Create payment controller
  - `processPayment` - Handle payment from card tap
  - `getTransactionHistory` - Get student transaction history
  - `getMerchantSales` - Get sales for merchant
  - `refundTransaction` - Reverse a transaction

- [ ] **Task 11**: Create top-up controller
  - `initiateTopUp` - Start top-up process
  - `processTopUp` - Complete top-up after payment
  - `getTopUpHistory` - Get top-up history for student/parent
  - `getTopUpStatus` - Check top-up status

- [ ] **Task 12**: Create account controller
  - `getBalance` - Get student account balance
  - `getTransactions` - Get account transactions
  - `adjustBalance` - Manual balance adjustment (admin)
  - `getAccountSummary` - Get account summary with stats

- [ ] **Task 13**: Create card management controller
  - `deactivateCard` - Mark card as lost/stolen
  - `reactivateCard` - Reactivate deactivated card
  - `replaceCard` - Replace with new card
  - `getCardStatus` - Get current card status

- [ ] **Task 14**: Create merchant controller
  - `createMerchant` - Create new merchant/canteen
  - `getMerchants` - List merchants for school
  - `getMerchantSales` - Get sales report
  - `updateMerchant` - Update merchant info

---

## 🟢 PHASE 4: API Routes (HIGH - Week 3)

### Route Files
- [ ] **Task 15**: Create payment routes (`/api/payments/*`)
  - `POST /api/payments/process` - Process payment
  - `GET /api/payments/student/:studentId/history` - Transaction history
  - `GET /api/payments/merchant/:merchantId/sales` - Merchant sales
  - `POST /api/payments/:transactionId/refund` - Refund transaction

- [ ] **Task 16**: Create top-up routes (`/api/topup/*`)
  - `POST /api/topup/initiate` - Initiate top-up
  - `POST /api/topup/process` - Process top-up payment
  - `GET /api/topup/history` - Top-up history
  - `GET /api/topup/status/:topUpId` - Check status

- [ ] **Task 17**: Create account routes (`/api/accounts/*`)
  - `GET /api/accounts/student/:studentId/balance` - Get balance
  - `GET /api/accounts/student/:studentId/transactions` - Get transactions
  - `POST /api/accounts/student/:studentId/adjust` - Manual adjustment
  - `GET /api/accounts/school/:schoolId/summary` - School summary

- [ ] **Task 18**: Create card management routes (`/api/cards/*`)
  - `POST /api/cards/:cardUID/deactivate` - Deactivate card
  - `POST /api/cards/:cardUID/reactivate` - Reactivate card
  - `POST /api/cards/:cardUID/replace` - Replace card
  - `GET /api/cards/:cardUID/status` - Get status

- [ ] **Task 19**: Create merchant routes (`/api/merchants/*`)
  - `POST /api/merchants` - Create merchant
  - `GET /api/merchants/school/:schoolId` - List merchants
  - `GET /api/merchants/:merchantId` - Get merchant
  - `PUT /api/merchants/:merchantId` - Update merchant
  - `GET /api/merchants/:merchantId/sales` - Sales report

---

## 🔵 PHASE 5: Unified Card System (CRITICAL - Week 3)

### Integration
- [ ] **Task 20**: Modify attendance endpoint to detect device type
  - Check if device is POS or attendance reader
  - Route to appropriate handler

- [ ] **Task 21**: Add unified card tap handler
  - Single endpoint: `POST /api/card/tap`
  - Detect device type from deviceId
  - Route to attendance or payment processing
  - Return appropriate response

- [ ] **Task 22**: Implement transaction idempotency
  - Prevent duplicate charges on same card tap
  - Use transaction reference or timestamp-based deduplication
  - Handle rapid successive taps

- [ ] **Task 23**: Implement insufficient balance handling
  - Check balance before processing
  - Return clear error message
  - Log failed transactions
  - Optional: Send SMS to parent about low balance

---

## 🟣 PHASE 6: Payment Gateway Integration (HIGH - Week 4)

### Integration
- [ ] **Task 24**: Add payment gateway integration (M-Pesa or mobile money)
  - Research Rwanda payment gateways (M-Pesa, MTN Mobile Money)
  - Create payment gateway service
  - Implement payment initiation
  - Implement payment verification webhook
  - Handle payment callbacks
  - Store payment references

---

## 🟤 PHASE 7: Reporting & Export (MEDIUM - Week 4-5)

### Export Functions
- [ ] **Task 25**: Implement CSV generation for reports
  - Create CSV export utility
  - Support attendance, transaction, sales exports
  - Proper formatting and headers

- [ ] **Task 26**: Implement PDF generation for reports
  - Add PDF library (pdfkit)
  - Create PDF templates
  - Generate formatted reports
  - Include charts/graphs (optional)

- [ ] **Task 27**: Create export controller
  - `exportAttendanceReport` - Export attendance data
  - `exportTransactionReport` - Export transactions
  - `exportSalesReport` - Export sales data
  - Support date ranges and filters

- [ ] **Task 28**: Create export routes (`/api/reports/export/*`)
  - `GET /api/reports/attendance/export` - CSV/PDF
  - `GET /api/reports/transactions/export` - CSV/PDF
  - `GET /api/reports/sales/export` - CSV/PDF
  - Query params: format, startDate, endDate, schoolId

---

## 🟦 PHASE 8: Enhanced Features (MEDIUM - Week 5)

### Parent Features
- [ ] **Task 29**: Add parent endpoints for viewing child balance and transactions
  - `GET /api/parent/children/:studentId/balance`
  - `GET /api/parent/children/:studentId/transactions`
  - `GET /api/parent/children/:studentId/account-summary`

- [ ] **Task 30**: Add parent endpoints for initiating top-ups
  - `POST /api/parent/children/:studentId/topup`
  - `GET /api/parent/topup/history`
  - `GET /api/parent/topup/status/:topUpId`

### Admin Features
- [ ] **Task 31**: Add admin endpoints for transaction dashboard and sales analytics
  - `GET /api/admin/transactions` - All transactions
  - `GET /api/admin/sales` - Sales analytics
  - `GET /api/admin/accounts` - Account summaries
  - `GET /api/admin/revenue` - Revenue reports

### Notifications
- [ ] **Task 32**: Add SMS notifications for payment transactions (optional)
  - Notify parent on purchase
  - Notify on low balance
  - Notify on top-up completion

---

## 🔧 PHASE 9: Fix Existing Issues (HIGH - Week 1)

### Critical Fixes
- [ ] **Task 33**: Re-enable SMS notifications for attendance (currently disabled)
  - Uncomment SMS code in `attendance.ts`
  - Test SMS sending
  - Configure credentials

- [ ] **Task 34**: Uncomment DeviceLog.logEvent in attendance.ts (currently disabled)
  - Restore logging functionality
  - Test logging
  - Verify logs are created

---

## 🛠️ PHASE 10: Infrastructure & Configuration (MEDIUM - Week 1)

### Configuration Files
- [ ] **Task 35**: Create .env.example file
  - List all required environment variables
  - Include MongoDB, JWT, SMS, Payment gateway configs
  - Add comments and examples

- [ ] **Task 36**: Implement Dockerfile
  - Multi-stage build
  - Node.js base image
  - Copy dependencies and source
  - Build TypeScript
  - Expose port
  - Set startup command

- [ ] **Task 37**: Implement docker-compose.yml
  - MongoDB service
  - App service
  - Environment variables
  - Volume mounts
  - Network configuration

---

## 🔒 PHASE 11: Security & Validation (MEDIUM - Week 5-6)

### Security Enhancements
- [ ] **Task 38**: Add input validation library (Zod)
  - Install Zod
  - Create validation schemas for all endpoints
  - Validate request bodies
  - Return clear validation errors

- [ ] **Task 39**: Add rate limiting middleware
  - Install express-rate-limit
  - Configure limits for auth endpoints
  - Configure limits for payment endpoints
  - Add to sensitive routes

- [ ] **Task 40**: Configure CORS properly
  - Remove wildcard origin
  - Use environment-based allowed origins
  - Configure credentials if needed

- [ ] **Task 41**: Add JWT_SECRET validation on startup
  - Check if JWT_SECRET exists
  - Fail startup if missing
  - Provide clear error message

- [ ] **Task 42**: Add password strength validation
  - Minimum length (8 characters)
  - Complexity requirements
  - Validation on registration

---

## 📝 PHASE 12: Code Quality (LOW - Week 6)

### TypeScript Improvements
- [ ] **Task 43**: Create TypeScript interfaces
  - Define interfaces for all models
  - Define request/response types
  - Remove `any` types
  - Create types directory structure

---

## 🧪 PHASE 13: Testing & Data (LOW - Week 6-7)

### Testing
- [ ] **Task 44**: Update database seed script
  - Add sample accounts with balances
  - Add sample merchants
  - Add sample transactions
  - Add sample top-ups
  - Link accounts to students

### Additional Features
- [ ] **Task 45**: Add transaction reversal/refund functionality
  - Refund endpoint
  - Balance restoration
  - Transaction status update
  - Refund reason tracking

- [ ] **Task 46**: Add payment confirmation and receipt generation
  - Generate receipt after payment
  - Store receipt reference
  - Optional: Email/SMS receipt

---

## 🌟 PHASE 14: Optional Features (LOW - Future)

### Optional Enhancements
- [ ] **Task 47**: Implement offline transaction caching for POS devices
  - Queue transactions when offline
  - Sync on reconnect
  - Conflict resolution
  - Status tracking

- [ ] **Task 48**: Add meal plans and dietary restrictions models
  - MealPlan model
  - DietaryRestriction model
  - Link to students
  - Pre-order functionality

---

## 📊 Progress Tracking

### Phase Completion
- [ ] Phase 1: Core Payment System (0/6 tasks)
- [ ] Phase 2: Payment Processing Logic (0/3 tasks)
- [ ] Phase 3: API Controllers (0/5 tasks)
- [ ] Phase 4: API Routes (0/5 tasks)
- [ ] Phase 5: Unified Card System (0/4 tasks)
- [ ] Phase 6: Payment Gateway Integration (0/1 tasks)
- [ ] Phase 7: Reporting & Export (0/4 tasks)
- [ ] Phase 8: Enhanced Features (0/4 tasks)
- [ ] Phase 9: Fix Existing Issues (0/2 tasks)
- [ ] Phase 10: Infrastructure & Configuration (0/3 tasks)
- [ ] Phase 11: Security & Validation (0/5 tasks)
- [ ] Phase 12: Code Quality (0/1 tasks)
- [ ] Phase 13: Testing & Data (0/3 tasks)
- [ ] Phase 14: Optional Features (0/2 tasks)

### Overall Progress: 0/48 tasks (0%)

---

## 🎯 Quick Start Priority

### Must Do First (Week 1)
1. Task 1-6: Create all database models
2. Task 7-9: Implement core payment functions
3. Task 33-34: Fix existing disabled features
4. Task 35-37: Infrastructure setup

### Then (Week 2-3)
5. Task 10-19: Build all controllers and routes
6. Task 20-23: Implement unified card system

### Finally (Week 4-7)
7. Task 24: Payment gateway integration
8. Task 25-28: Reporting and export
9. Task 29-32: Enhanced features
10. Task 38-43: Security and code quality

---

## 📝 Notes

- **Database**: Current codebase uses MongoDB, but proposal mentions PostgreSQL. Consider migration or update proposal.
- **Payment Gateway**: Research Rwanda-specific payment gateways (M-Pesa, MTN Mobile Money, Airtel Money)
- **Testing**: Add unit tests for payment logic (critical for financial operations)
- **Documentation**: Update API documentation as you build endpoints

---

**Last Updated**: 2024  
**Status**: Ready for implementation


