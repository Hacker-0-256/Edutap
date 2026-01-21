# 🧪 EduTap Backend Testing Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (running locally or MongoDB Atlas connection)
3. **npm** or **yarn** package manager

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Environment Setup

### A. Copy Environment File

```bash
cp .env.example .env
```

### B. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/school-attendance

# JWT (REQUIRED - Generate a strong secret)
JWT_SECRET=your-strong-secret-key-here-change-this

# SMS (Optional for testing - can be empty)
AFRICAS_TALKING_API_KEY=
AFRICAS_TALKING_USERNAME=

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Generate JWT Secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or run directly
mongod --dbpath /path/to/data/db
```

### Option B: MongoDB Atlas (Cloud)
- Use your Atlas connection string in `MONGODB_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/school-attendance`

---

## Step 4: Seed Database (Optional but Recommended)

Populate database with sample data:

```bash
npm run seed
```

This creates:
- 2 schools
- Admin user
- School staff users
- Parents
- Students with accounts
- Merchants
- Devices
- Sample transactions and top-ups

**Sample Login Credentials:**
- Admin: `admin@school.edu` / `admin123`
- School Staff: `staff.greenvalley@school.edu` / `staff123`
- Parents: `john.smith@email.com` / `parent123`

---

## Step 5: Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

**Expected Output:**
```
🚀 IoT School Attendance System Started!
📍 Port: 3000
🗄️ Database: Connected
🔗 API: http://localhost:3000/api
🔌 WebSocket: ws://localhost:3000
📡 IoT Devices: Ready for connections
```

---

## Step 6: Test the API

### Option A: Using cURL

#### 1. Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected"
}
```

#### 2. Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "Test123!@#",
    "role": "admin",
    "firstName": "Test",
    "lastName": "Admin"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "password": "admin123"
  }'
```

**Save the token from response for authenticated requests.**

#### 4. Register Student with Parent
```bash
curl -X POST http://localhost:3000/api/students/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Test",
    "lastName": "Student",
    "studentId": "TEST001",
    "cardUID": "TEST123456789",
    "grade": "5",
    "class": "A",
    "schoolId": "SCHOOL_ID_HERE",
    "initialBalance": 1000,
    "parentFirstName": "Test",
    "parentLastName": "Parent",
    "parentPhone": "+250788123456",
    "parentEmail": "test.parent@email.com",
    "parentReceiveSMS": true
  }'
```

#### 5. Get All Students
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 6. Process Payment (Card Tap)
```bash
curl -X POST http://localhost:3000/api/card/tap \
  -H "Content-Type: application/json" \
  -d '{
    "cardUID": "ABC123456789",
    "deviceId": "pos-canteen-001",
    "deviceLocation": "Main Canteen",
    "amount": 500,
    "description": "Lunch purchase"
  }'
```

#### 7. Manual Top-up
```bash
curl -X POST http://localhost:3000/api/topup/manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "studentId": "STUDENT_ID_HERE",
    "amount": 5000,
    "paymentMethod": "cash",
    "parentId": "PARENT_ID_HERE"
  }'
```

#### 8. Get Admin Transactions
```bash
curl -X GET "http://localhost:3000/api/admin/transactions?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 9. Export Attendance Report (CSV)
```bash
curl -X GET "http://localhost:3000/api/reports/export/attendance?format=csv&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o attendance_report.csv
```

---

### Option B: Using Postman

1. **Import Collection** (create new collection):
   - Base URL: `http://localhost:3000/api`

2. **Set Environment Variables**:
   - `base_url`: `http://localhost:3000`
   - `token`: (set after login)

3. **Create Requests**:

   **Auth - Register:**
   - Method: `POST`
   - URL: `{{base_url}}/api/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "test@admin.com",
       "password": "Test123!@#",
       "role": "admin",
       "firstName": "Test",
       "lastName": "Admin"
     }
     ```

   **Auth - Login:**
   - Method: `POST`
   - URL: `{{base_url}}/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@school.edu",
       "password": "admin123"
     }
     ```
   - **Tests Tab** (to save token):
     ```javascript
     if (pm.response.code === 200) {
       const jsonData = pm.response.json();
       pm.environment.set("token", jsonData.data.token);
     }
     ```

   **Students - Register:**
   - Method: `POST`
   - URL: `{{base_url}}/api/students/register`
   - Headers:
     - `Authorization`: `Bearer {{token}}`
   - Body (JSON):
     ```json
     {
       "firstName": "Test",
       "lastName": "Student",
       "studentId": "TEST001",
       "cardUID": "TEST123456789",
       "grade": "5",
       "class": "A",
       "schoolId": "YOUR_SCHOOL_ID",
       "initialBalance": 1000,
       "parentFirstName": "Test",
       "parentLastName": "Parent",
       "parentPhone": "+250788123456",
       "parentEmail": "test.parent@email.com",
       "parentReceiveSMS": true
     }
     ```

---

### Option C: Using REST Client (VS Code Extension)

Create `backend/test.http`:

```http
### Health Check
GET http://localhost:3000/health

### Register Admin
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@admin.com",
  "password": "Test123!@#",
  "role": "admin",
  "firstName": "Test",
  "lastName": "Admin"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.edu",
  "password": "admin123"
}

### Get Students (replace TOKEN)
GET http://localhost:3000/api/students
Authorization: Bearer TOKEN_HERE

### Register Student with Parent (replace TOKEN and SCHOOL_ID)
POST http://localhost:3000/api/students/register
Content-Type: application/json
Authorization: Bearer TOKEN_HERE

{
  "firstName": "Test",
  "lastName": "Student",
  "studentId": "TEST001",
  "cardUID": "TEST123456789",
  "grade": "5",
  "class": "A",
  "schoolId": "SCHOOL_ID_HERE",
  "initialBalance": 1000,
  "parentFirstName": "Test",
  "parentLastName": "Parent",
  "parentPhone": "+250788123456",
  "parentEmail": "test.parent@email.com",
  "parentReceiveSMS": true
}

### Card Tap (Payment)
POST http://localhost:3000/api/card/tap
Content-Type: application/json

{
  "cardUID": "ABC123456789",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}

### Manual Top-up (replace TOKEN and IDs)
POST http://localhost:3000/api/topup/manual
Content-Type: application/json
Authorization: Bearer TOKEN_HERE

{
  "studentId": "STUDENT_ID_HERE",
  "amount": 5000,
  "paymentMethod": "cash"
}
```

---

## Step 7: Test Scenarios

### Scenario 1: Complete Student Registration Flow

1. **Login as Admin**
   ```bash
   POST /api/auth/login
   ```

2. **Get School ID**
   ```bash
   GET /api/schools
   ```

3. **Register Student with Parent**
   ```bash
   POST /api/students/register
   ```
   - Verify parent is created/linked
   - Verify student account is created
   - Check SMS notification status

4. **Verify Student Created**
   ```bash
   GET /api/students
   ```

5. **Check Account Balance**
   ```bash
   GET /api/accounts/student/STUDENT_ID/balance
   ```

### Scenario 2: Payment Flow

1. **Register a POS Device** (if not seeded)
   ```bash
   POST /api/devices/register
   ```

2. **Create a Merchant** (if not seeded)
   ```bash
   POST /api/merchants
   ```

3. **Process Payment via Card Tap**
   ```bash
   POST /api/card/tap
   ```
   - Verify balance deducted
   - Verify transaction created
   - Check SMS sent to parent

4. **Get Transaction History**
   ```bash
   GET /api/payments/student/STUDENT_ID/history
   ```

5. **Get Payment Receipt**
   ```bash
   GET /api/payments/TRANSACTION_ID/receipt
   ```

### Scenario 3: Manual Top-up Flow

1. **Create Manual Top-up**
   ```bash
   POST /api/topup/manual
   ```

2. **Verify Balance Updated**
   ```bash
   GET /api/accounts/student/STUDENT_ID/balance
   ```

3. **Check Top-up History**
   ```bash
   GET /api/topup/history?studentId=STUDENT_ID
   ```

### Scenario 4: Admin Analytics

1. **Get All Transactions**
   ```bash
   GET /api/admin/transactions?limit=50&page=1
   ```

2. **Get Sales Analytics**
   ```bash
   GET /api/admin/sales?startDate=2024-01-01&endDate=2024-01-31
   ```

3. **Get Account Summaries**
   ```bash
   GET /api/admin/accounts?schoolId=SCHOOL_ID
   ```

4. **Get Revenue Reports**
   ```bash
   GET /api/admin/revenue?startDate=2024-01-01&endDate=2024-01-31
   ```

---

## Step 8: Test Validation & Security

### Test Input Validation

1. **Invalid Email Format**
   ```bash
   POST /api/auth/register
   {
     "email": "invalid-email",
     "password": "Test123!@#",
     ...
   }
   ```
   - Should return validation error

2. **Weak Password**
   ```bash
   POST /api/auth/register
   {
     "email": "test@test.com",
     "password": "weak",
     ...
   }
   ```
   - Should return password strength error

3. **Missing Required Fields**
   ```bash
   POST /api/students/register
   {
     "firstName": "Test"
     // Missing other required fields
   }
   ```
   - Should return validation errors

### Test Rate Limiting

1. **Auth Endpoint** (5 requests per 15 minutes)
   - Try logging in 6 times quickly
   - 6th attempt should be rate limited

2. **Card Tap** (5 requests per 10 seconds)
   - Tap card 6 times quickly
   - 6th tap should be rate limited

### Test Authentication

1. **Access Protected Endpoint Without Token**
   ```bash
   GET /api/students
   ```
   - Should return 401 Unauthorized

2. **Access Admin Endpoint as School Staff**
   ```bash
   GET /api/admin/transactions
   ```
   - Should return 403 Forbidden (if not admin)

---

## Step 9: Test Export Features

### Export Attendance (CSV)
```bash
curl -X GET "http://localhost:3000/api/reports/export/attendance?format=csv&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer TOKEN" \
  -o attendance.csv
```

### Export Attendance (PDF)
```bash
curl -X GET "http://localhost:3000/api/reports/export/attendance?format=pdf&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer TOKEN" \
  -o attendance.pdf
```

### Export Transactions (CSV)
```bash
curl -X GET "http://localhost:3000/api/reports/export/transactions?format=csv&type=purchase" \
  -H "Authorization: Bearer TOKEN" \
  -o transactions.csv
```

---

## Step 10: Test Error Handling

### Test Common Errors

1. **Student Not Found**
   ```bash
   GET /api/students/invalid_id
   ```
   - Should return 404

2. **Duplicate Student ID**
   ```bash
   POST /api/students/register
   {
     "studentId": "EXISTING_ID",
     ...
   }
   ```
   - Should return error about duplicate ID

3. **Insufficient Balance**
   ```bash
   POST /api/card/tap
   {
     "amount": 10000,
     "cardUID": "STUDENT_WITH_LOW_BALANCE"
   }
   ```
   - Should return insufficient balance error

4. **Invalid JWT Token**
   ```bash
   GET /api/students
   Authorization: Bearer invalid_token
   ```
   - Should return 401 Unauthorized

---

## Quick Test Script

Create `backend/test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing EduTap Backend API"
echo "================================"

# 1. Health Check
echo -e "\n1. Health Check:"
curl -s $BASE_URL/../health | jq '.'

# 2. Register Admin
echo -e "\n2. Register Admin:"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "Test123!@#",
    "role": "admin",
    "firstName": "Test",
    "lastName": "Admin"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 3. Login
echo -e "\n3. Login:"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "password": "admin123"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo "Token: ${TOKEN:0:50}..."

# 4. Get Students
echo -e "\n4. Get Students:"
curl -s -X GET $BASE_URL/students \
  -H "Authorization: Bearer $TOKEN" | jq '.count'

echo -e "\n✅ Basic tests completed!"
```

Make it executable:
```bash
chmod +x backend/test-api.sh
./backend/test-api.sh
```

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Health check endpoint works
- [ ] User registration works
- [ ] User login works
- [ ] JWT token generation works
- [ ] Student registration with parent works
- [ ] SMS notification sent (if credentials configured)
- [ ] Card tap (attendance) works
- [ ] Card tap (payment) works
- [ ] Manual top-up works
- [ ] Transaction history works
- [ ] Admin endpoints work
- [ ] Export (CSV/PDF) works
- [ ] Rate limiting works
- [ ] Input validation works
- [ ] Error handling works
- [ ] Authentication/Authorization works

---

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `.env`
- Check MongoDB logs

### Issue: JWT_SECRET Error
**Solution:**
- Make sure `JWT_SECRET` is set in `.env`
- Generate a new secret: `openssl rand -base64 32`
- Restart server

### Issue: Port Already in Use
**Solution:**
- Change `PORT` in `.env`
- Or kill process on port 3000:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

### Issue: SMS Not Sending
**Solution:**
- SMS credentials are optional for testing
- Registration will succeed even if SMS fails
- Check SMS status in response
- Configure `AFRICAS_TALKING_API_KEY` and `AFRICAS_TALKING_USERNAME` if needed

### Issue: Validation Errors
**Solution:**
- Check request body format
- Verify all required fields are present
- Check field types (string, number, etc.)
- Review validation error messages

---

## Next Steps

1. **Set up frontend** and connect to backend
2. **Configure SMS credentials** for production
3. **Set up production database** (MongoDB Atlas)
4. **Deploy backend** (using Docker or cloud platform)
5. **Set up monitoring** and logging

---

## Additional Resources

- **API Documentation**: See `backend/API_DOCUMENTATION.md`
- **Student Registration Guide**: See `backend/STUDENT_REGISTRATION_GUIDE.md`
- **Remaining Tasks**: See `REMAINING_TASKS.md`









