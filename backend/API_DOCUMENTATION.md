# EduTap Backend API Documentation

## Student Registration Endpoints

### POST `/api/students/register`
Register a student with parent/guardian information in one step. This is the **recommended** method as it ensures proper linking and sends a welcome SMS.

**Request Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "studentId": "GV001",
  "cardUID": "ABC123456789",
  "grade": "5",
  "class": "A",
  "schoolId": "school_id_here",
  "initialBalance": 1000,
  "parentFirstName": "John",
  "parentLastName": "Smith",
  "parentPhone": "+250788123456",
  "parentEmail": "john.smith@email.com",
  "parentAddress": "123 Parent Street",
  "parentReceiveSMS": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student and parent registered successfully",
  "data": {
    "student": {
      "id": "student_id",
      "firstName": "Emma",
      "lastName": "Smith",
      "studentId": "GV001",
      "cardUID": "ABC123456789",
      "grade": "5",
      "class": "A",
      "accountBalance": 1000
    },
    "parent": {
      "id": "parent_id",
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+250788123456",
      "email": "john.smith@email.com",
      "receiveSMS": true
    },
    "school": {
      "id": "school_id",
      "name": "Green Valley International School"
    },
    "smsNotification": {
      "sent": true,
      "error": null
    }
  }
}
```

**Features:**
- ✅ Creates parent if they don't exist (checks by phone number)
- ✅ Links existing parent if phone number matches
- ✅ Creates student account automatically
- ✅ Sends welcome SMS to parent
- ✅ Validates all required fields

**Required Role:** `admin` or `school`

---

### POST `/api/students/register-multiple`
Register multiple students (siblings) with the same parent/guardian.

**Request Body:**
```json
{
  "schoolId": "school_id_here",
  "students": [
    {
      "firstName": "Emma",
      "lastName": "Smith",
      "studentId": "GV001",
      "cardUID": "ABC123456789",
      "grade": "5",
      "class": "A",
      "initialBalance": 1000
    },
    {
      "firstName": "Liam",
      "lastName": "Smith",
      "studentId": "GV002",
      "cardUID": "DEF987654321",
      "grade": "3",
      "class": "B",
      "initialBalance": 1000
    }
  ],
  "parentFirstName": "John",
  "parentLastName": "Smith",
  "parentPhone": "+250788123456",
  "parentEmail": "john.smith@email.com",
  "parentAddress": "123 Parent Street",
  "parentReceiveSMS": true
}
```

**Required Role:** `admin` or `school`

---

## Authentication Endpoints

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "admin" | "school" | "parent",
  "firstName": "John",
  "lastName": "Doe",
  "schoolId": "optional-for-school-role",
  "parentId": "optional-for-parent-role"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Role-Specific Requirements:**
- `school` role: `schoolId` is required
- `parent` role: `parentId` is required
- `admin` role: No additional fields required

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "admin",
      "firstName": "John",
      "lastName": "Doe",
      "schoolId": null,
      "parentId": null
    },
    "token": "jwt_token_here"
  }
}
```

**Error Responses:**
- `400`: Validation error, user already exists, or missing required fields
- `429`: Too many requests (rate limited)

**Rate Limiting:** 5 requests per 15 minutes

---

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "admin",
      "firstName": "John",
      "lastName": "Doe",
      "schoolId": null,
      "parentId": null
    },
    "token": "jwt_token_here"
  }
}
```

**Error Responses:**
- `401`: Invalid email or password, or account not active
- `429`: Too many requests (rate limited)

**Rate Limiting:** 5 requests per 15 minutes

---

## Payment Endpoints

### POST `/api/payments/process`
Process a payment when a student taps their card at a POS device.

**Request Body:**
```json
{
  "cardUID": "ABC123456789",
  "amount": 500,
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "description": "Lunch purchase"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "success": true,
    "transaction": {
      "id": "transaction_id",
      "reference": "TXN-1234567890-abc123",
      "amount": 500,
      "balanceAfter": 4500,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "student": {
      "name": "John Doe",
      "studentId": "GV001"
    },
    "merchant": {
      "name": "Main Canteen",
      "type": "canteen"
    },
    "confirmation": {
      "transactionId": "transaction_id",
      "reference": "TXN-1234567890-abc123",
      "timestamp": "2024-01-15T10:30:00Z",
      "amount": 500,
      "status": "completed",
      "balanceAfter": 4500
    }
  }
}
```

**Rate Limiting:** 10 requests per minute

---

### GET `/api/payments/:transactionId/receipt`
Get a PDF receipt for a payment transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
- Content-Type: `application/pdf`
- PDF file download

**Error Responses:**
- `403`: Access denied (not authorized to view this receipt)
- `404`: Transaction not found

---

## Card Tap Endpoint

### POST `/api/card/tap`
Unified card tap handler - automatically routes to attendance or payment based on device type.

**Request Body:**
```json
{
  "cardUID": "ABC123456789",
  "deviceId": "rfid-gate-001",
  "deviceLocation": "Main Entrance",
  "amount": 500,
  "description": "Optional description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance processed successfully",
  "data": {
    "type": "attendance" | "payment",
    "success": true,
    "attendance": { ... } | "transaction": { ... }
  }
}
```

**Rate Limiting:** 5 requests per 10 seconds

---

## Top-up Endpoints

### POST `/api/topup/manual`
Create and process a manual top-up (admin/school staff only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "studentId": "student_id",
  "amount": 5000,
  "paymentMethod": "cash",
  "parentId": "optional_parent_id",
  "paymentReference": "optional_reference"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Manual top-up created and processed successfully",
  "data": {
    "success": true,
    "topUp": {
      "id": "topup_id",
      "internalRef": "TUP-1234567890-abc123",
      "amount": 5000,
      "paymentMethod": "cash",
      "status": "completed"
    }
  }
}
```

**Rate Limiting:** 10 requests per minute

---

## Export Endpoints

### GET `/api/reports/export/attendance`
Export attendance report as CSV or PDF.

**Query Parameters:**
- `format`: `csv` | `pdf` (default: `csv`)
- `startDate`: `YYYY-MM-DD` (optional)
- `endDate`: `YYYY-MM-DD` (optional)
- `schoolId`: School ID (optional)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
- CSV: `text/csv` file download
- PDF: `application/pdf` file download

---

### GET `/api/reports/export/transactions`
Export transaction report as CSV or PDF.

**Query Parameters:**
- `format`: `csv` | `pdf` (default: `csv`)
- `startDate`: `YYYY-MM-DD` (optional)
- `endDate`: `YYYY-MM-DD` (optional)
- `schoolId`: School ID (optional)
- `type`: `purchase` | `top-up` (optional)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
- CSV: `text/csv` file download
- PDF: `application/pdf` file download

---

## Admin Dashboard Endpoints

### GET `/api/admin/transactions`
Get all transactions with filters and pagination (admin only).

**Query Parameters:**
- `startDate`: `YYYY-MM-DD` (optional)
- `endDate`: `YYYY-MM-DD` (optional)
- `schoolId`: School ID (optional)
- `merchantId`: Merchant ID (optional)
- `status`: Transaction status (optional)
- `type`: Transaction type (optional)
- `limit`: Number of results (default: 100)
- `page`: Page number (default: 1)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "summary": {
      "totalRevenue": 50000,
      "totalTransactions": 100,
      "averageAmount": 500
    },
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 100,
      "pages": 1
    }
  }
}
```

---

### GET `/api/admin/sales`
Get sales analytics (admin only).

**Query Parameters:**
- `startDate`: `YYYY-MM-DD` (optional)
- `endDate`: `YYYY-MM-DD` (optional)
- `schoolId`: School ID (optional)
- `groupBy`: `day` | `week` | `month` (default: `day`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "salesByDate": [...],
    "salesByMerchant": [...],
    "overallSummary": {
      "totalRevenue": 50000,
      "totalTransactions": 100,
      "averageAmount": 500,
      "minAmount": 100,
      "maxAmount": 2000
    }
  }
}
```

---

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens expire after 7 days.

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Payment endpoints**: 10 requests per minute
- **Card tap**: 5 requests per 10 seconds

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "path": "field.name",
      "message": "Validation error message"
    }
  ]
}
```

## Base URL

Development: `http://localhost:3000/api`
Production: `https://your-domain.com/api`

