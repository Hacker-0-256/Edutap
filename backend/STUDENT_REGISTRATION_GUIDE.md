# Student Registration Guide

## Overview

The EduTap system now supports registering students with their parent/guardian information in a single step. This ensures proper linking and automatic SMS notifications.

## Registration Endpoints

### 1. Register Student with Parent (Recommended)

**Endpoint:** `POST /api/students/register`

**Description:** Register a student and create/link their parent/guardian in one step. This is the recommended method as it ensures proper linking and sends a welcome SMS.

**Request Body:**
```json
{
  // Student Information
  "firstName": "Emma",
  "lastName": "Smith",
  "studentId": "GV001",
  "cardUID": "ABC123456789",
  "grade": "5",
  "class": "A",
  "schoolId": "school_id_here",
  "initialBalance": 1000,
  
  // Parent/Guardian Information
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
    "success": true,
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
- ✅ Links student to parent
- ✅ Sends welcome SMS to parent
- ✅ Validates all required fields

---

### 2. Register Multiple Students (Siblings)

**Endpoint:** `POST /api/students/register-multiple`

**Description:** Register multiple students (siblings) with the same parent/guardian in one request.

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

**Response (201):**
```json
{
  "success": true,
  "message": "2 student(s) registered successfully with parent",
  "data": {
    "success": true,
    "count": 2,
    "students": [...],
    "parent": {...},
    "school": {...}
  }
}
```

---

### 3. Legacy: Create Student (Requires Existing Parent)

**Endpoint:** `POST /api/students`

**Description:** Create a student with an existing parent ID. Use this only if the parent already exists in the system.

**Request Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "studentId": "GV001",
  "cardUID": "ABC123456789",
  "grade": "5",
  "class": "A",
  "parentId": "existing_parent_id",
  "schoolId": "school_id_here"
}
```

---

## Parent Management

### Create Parent Separately

**Endpoint:** `POST /api/parents`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+250788123456",
  "email": "john.smith@email.com",
  "address": "123 Parent Street",
  "schoolId": "school_id_here",
  "receiveSMS": true
}
```

**Note:** Parent must be linked to a school (`schoolId` is required).

---

## How It Works

1. **Parent Lookup**: System first checks if a parent with the given phone number exists
2. **Parent Creation/Linking**: 
   - If parent doesn't exist → Creates new parent
   - If parent exists → Links to existing parent (updates info if needed)
3. **Student Creation**: Creates student and links to parent
4. **Account Creation**: Automatically creates student account with optional initial balance
5. **SMS Notification**: Sends welcome SMS to parent (if `receiveSMS` is true)

---

## SMS Notifications

After registration, parents will automatically receive SMS notifications for:
- ✅ Student arrival at school (attendance)
- ✅ Payment transactions
- ✅ Low balance warnings (if implemented)
- ✅ Top-up confirmations

The welcome SMS sent during registration:
```
Hello [Parent Name], your child [Student Name] ([Student ID]) has been successfully registered at [School Name]. You will receive SMS notifications for attendance and payments.
```

---

## Validation

All endpoints use Zod validation with the following requirements:

**Student:**
- `firstName`, `lastName`: Required, minimum 1 character
- `studentId`: Required, unique
- `cardUID`: Required, unique
- `grade`, `class`: Required
- `schoolId`: Required, must exist

**Parent:**
- `parentFirstName`, `parentLastName`: Required
- `parentPhone`: Required, unique
- `parentEmail`: Optional, must be valid email if provided
- `parentReceiveSMS`: Optional, defaults to `true`

---

## Best Practices

1. **Use `/api/students/register`** for new registrations (recommended)
2. **Always provide parent phone number** - this is used for SMS notifications
3. **Set `parentReceiveSMS: true`** to enable notifications
4. **Use `/api/students/register-multiple`** for siblings
5. **Verify phone number format** - use international format (e.g., +250788123456 for Rwanda)

---

## Error Handling

Common errors:
- `400`: Validation error, missing required fields
- `404`: School not found
- `409`: Student ID or card UID already exists
- `500`: Server error

All errors return:
```json
{
  "success": false,
  "message": "Error description"
}
```









