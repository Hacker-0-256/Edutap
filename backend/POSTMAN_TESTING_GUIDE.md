# 🧪 Postman Testing Guide - EduTap Backend

## 📋 Setup Postman

### 1. Create Environment Variables
Create a new environment in Postman with these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `base_url` | `http://localhost:5001` | `http://localhost:5001` |
| `api_url` | `http://localhost:5001/api` | `http://localhost:5001/api` |
| `token` | (leave empty) | (will be set after login) |
| `school_id` | (leave empty) | (will be set after getting schools) |
| `student_id` | (leave empty) | (will be set after creating student) |
| `parent_id` | (leave empty) | (will be set after creating student) |

### 2. Set Environment
- Select your environment in the top-right dropdown
- All requests will use `{{base_url}}` and `{{api_url}}`

---

## 🔐 1. AUTHENTICATION ENDPOINTS

### ✅ POST Login (Get Token)
**Priority: CRITICAL - Do this first!**

- **Method:** `POST`
- **URL:** `{{api_url}}/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@school.edu",
  "password": "admin123"
}
```

**Test Script (to auto-save token):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    console.log("Token saved!");
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

### ✅ POST Register User
- **Method:** `POST`
- **URL:** `{{api_url}}/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "newuser@school.edu",
  "password": "Test123!@#",
  "role": "admin",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 🏫 2. SCHOOL ENDPOINTS

### ✅ GET All Schools
**Priority: HIGH - Get school ID for other tests**

- **Method:** `GET`
- **URL:** `{{api_url}}/schools`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Test Script (to auto-save school ID):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.length > 0) {
        pm.environment.set("school_id", jsonData.data[0]._id);
        console.log("School ID saved:", jsonData.data[0]._id);
    }
}
```

---

## 👨‍🎓 3. STUDENT ENDPOINTS

### ✅ POST Register Student with Parent
**Priority: CRITICAL - Core feature**

- **Method:** `POST`
- **URL:** `{{api_url}}/students/register`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- **Body (raw JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "studentId": "STU001",
  "cardUID": "CARD123456",
  "grade": "5",
  "class": "A",
  "schoolId": "{{school_id}}",
  "initialBalance": 1000,
  "parentFirstName": "Jane",
  "parentLastName": "Doe",
  "parentPhone": "+250788123456",
  "parentEmail": "jane.doe@email.com",
  "parentReceiveSMS": true
}
```

**Test Script (to auto-save IDs):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    if (jsonData.data.student) {
        pm.environment.set("student_id", jsonData.data.student.id);
    }
    if (jsonData.data.parent) {
        pm.environment.set("parent_id", jsonData.data.parent.id);
    }
}
```

---

### ✅ POST Register Multiple Students
- **Method:** `POST`
- **URL:** `{{api_url}}/students/register-multiple`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- **Body (raw JSON):**
```json
{
  "schoolId": "{{school_id}}",
  "parentFirstName": "Jane",
  "parentLastName": "Doe",
  "parentPhone": "+250788123456",
  "parentEmail": "jane.doe@email.com",
  "parentReceiveSMS": true,
  "students": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "studentId": "STU001",
      "cardUID": "CARD001",
      "grade": "5",
      "class": "A",
      "initialBalance": 1000
    },
    {
      "firstName": "Mary",
      "lastName": "Doe",
      "studentId": "STU002",
      "cardUID": "CARD002",
      "grade": "3",
      "class": "B",
      "initialBalance": 1000
    }
  ]
}
```

---

### ✅ GET All Students
- **Method:** `GET`
- **URL:** `{{api_url}}/students`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

### ✅ GET Student by ID
- **Method:** `GET`
- **URL:** `{{api_url}}/students/{{student_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

## 💳 4. CARD TAP ENDPOINTS (Unified)

### ✅ POST Card Tap (Attendance or Payment)
**Priority: CRITICAL - Core feature**

- **Method:** `POST`
- **URL:** `{{api_url}}/card/tap`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON) - For Payment:**
```json
{
  "cardUID": "CARD123456",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}
```

**Body (raw JSON) - For Attendance:**
```json
{
  "cardUID": "CARD123456",
  "deviceId": "rfid-gate-001",
  "deviceLocation": "Main Entrance"
}
```

---

### ✅ GET Device Action Type
- **Method:** `GET`
- **URL:** `{{api_url}}/card/device/{{device_id}}/action`
- **Headers:** None

---

## 💰 5. PAYMENT ENDPOINTS

### ✅ POST Process Payment
- **Method:** `POST`
- **URL:** `{{api_url}}/payments/process`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "cardUID": "CARD123456",
  "merchantId": "merchant_id_here",
  "amount": 500,
  "description": "Lunch purchase"
}
```

---

### ✅ GET Transaction History
- **Method:** `GET`
- **URL:** `{{api_url}}/payments/student/{{student_id}}/history`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

### ✅ GET Payment Receipt (PDF)
- **Method:** `GET`
- **URL:** `{{api_url}}/payments/{{transaction_id}}/receipt`
- **Headers:**
  - `Authorization: Bearer {{token}}`
- **Note:** This returns a PDF file

---

## 💵 6. TOP-UP ENDPOINTS

### ✅ POST Manual Top-up
**Priority: HIGH - Core feature**

- **Method:** `POST`
- **URL:** `{{api_url}}/topup/manual`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- **Body (raw JSON):**
```json
{
  "studentId": "{{student_id}}",
  "amount": 5000,
  "paymentMethod": "cash",
  "parentId": "{{parent_id}}"
}
```

---

### ✅ GET Top-up History
- **Method:** `GET`
- **URL:** `{{api_url}}/topup/history?studentId={{student_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

## 💳 7. ACCOUNT ENDPOINTS

### ✅ GET Account Balance
- **Method:** `GET`
- **URL:** `{{api_url}}/accounts/student/{{student_id}}/balance`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

### ✅ GET Account Transactions
- **Method:** `GET`
- **URL:** `{{api_url}}/accounts/student/{{student_id}}/transactions`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

## 📊 8. ADMIN ENDPOINTS

### ✅ GET All Transactions
- **Method:** `GET`
- **URL:** `{{api_url}}/admin/transactions?limit=10&page=1`
- **Headers:**
  - `Authorization: Bearer {{token}}`
- **Note:** Requires `admin` role

---

### ✅ GET Sales Analytics
- **Method:** `GET`
- **URL:** `{{api_url}}/admin/sales?startDate=2024-01-01&endDate=2024-12-31`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

### ✅ GET Account Summaries
- **Method:** `GET`
- **URL:** `{{api_url}}/admin/accounts?schoolId={{school_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

### ✅ GET Revenue Reports
- **Method:** `GET`
- **URL:** `{{api_url}}/admin/revenue?startDate=2024-01-01&endDate=2024-12-31`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

## 📤 9. EXPORT ENDPOINTS

### ✅ GET Export Attendance (CSV)
- **Method:** `GET`
- **URL:** `{{api_url}}/reports/export/attendance?format=csv&startDate=2024-01-01&endDate=2024-12-31`
- **Headers:**
  - `Authorization: Bearer {{token}}`
- **Note:** Returns CSV file

---

### ✅ GET Export Attendance (PDF)
- **Method:** `GET`
- **URL:** `{{api_url}}/reports/export/attendance?format=pdf&startDate=2024-01-01&endDate=2024-12-31`
- **Headers:**
  - `Authorization: Bearer {{token}}`
- **Note:** Returns PDF file

---

### ✅ GET Export Transactions (CSV)
- **Method:** `GET`
- **URL:** `{{api_url}}/reports/export/transactions?format=csv&type=purchase`
- **Headers:**
  - `Authorization: Bearer {{token}}`

---

## 🏢 10. DEVICE ENDPOINTS

### ✅ POST Register Device
- **Method:** `POST`
- **URL:** `{{api_url}}/devices/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "deviceId": "pos-canteen-001",
  "name": "Main Canteen POS",
  "deviceType": "pos",
  "schoolId": "{{school_id}}",
  "location": {
    "building": "Main Building",
    "zone": "Canteen"
  },
  "capabilities": ["rfid", "nfc"]
}
```

---

### ✅ GET School Devices
- **Method:** `GET`
- **URL:** `{{api_url}}/devices/school/{{school_id}}`
- **Headers:** None

---

## 📋 Recommended Testing Order

### Phase 1: Setup & Authentication
1. ✅ POST Login (save token)
2. ✅ GET All Schools (save school_id)

### Phase 2: Student Management
3. ✅ POST Register Student with Parent (save student_id, parent_id)
4. ✅ GET All Students
5. ✅ GET Student by ID

### Phase 3: Payments & Transactions
6. ✅ POST Card Tap (Payment)
7. ✅ GET Account Balance
8. ✅ POST Manual Top-up
9. ✅ GET Transaction History

### Phase 4: Admin Features
10. ✅ GET All Transactions
11. ✅ GET Sales Analytics
12. ✅ GET Account Summaries

### Phase 5: Exports
13. ✅ GET Export Attendance (CSV)
14. ✅ GET Export Transactions (CSV)

---

## 🔑 Sample Credentials (from seed)

- **Admin:** `admin@school.edu` / `admin123`
- **School Staff:** `staff.greenvalley@school.edu` / `staff123`
- **Parent:** `john.smith@email.com` / `parent123`

---

## ⚠️ Important Notes

1. **Always login first** to get the token
2. **Save token automatically** using test scripts
3. **Get school_id** before registering students
4. **Some endpoints require admin role** - use admin credentials
5. **Card tap doesn't require auth** - used by IoT devices
6. **Rate limiting** - Don't spam requests (5 per 15 min for auth)

---

## 🐛 Troubleshooting

**401 Unauthorized:**
- Check if token is set in environment
- Try logging in again

**403 Forbidden:**
- Check if user has correct role (admin/school)
- Use admin credentials for admin endpoints

**404 Not Found:**
- Check if IDs (school_id, student_id) are correct
- Verify endpoint URL

**400 Bad Request:**
- Check request body format
- Verify all required fields are present
- Check field types (string, number, etc.)

---

## 📚 Additional Resources

- **Full API Docs:** `API_DOCUMENTATION.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Quick Test:** `QUICK_TEST.md`






