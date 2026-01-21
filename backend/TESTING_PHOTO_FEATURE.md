# Testing Guide: Student Photo Feature

## 📋 Prerequisites

Before testing, ensure:
- ✅ Backend server is running (`npm run dev`)
- ✅ MongoDB is connected
- ✅ You have an admin/school user token
- ✅ At least one student is registered
- ✅ At least one payment device (POS/canteen) is registered

---

## 🧪 Test 1: Upload Student Photo

### Step 1: Get Student ID

**Request:**
```bash
GET http://localhost:5001/api/students
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6942e3873c4380cd31a1c3c9",
      "firstName": "Alice",
      "lastName": "Johnson",
      "studentId": "STU002",
      ...
    }
  ]
}
```

**Save the `_id`** - you'll need it for the next step.

---

### Step 2: Upload Photo via Postman

1. **Open Postman**
2. **Create new request:**
   - Method: `POST`
   - URL: `http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9/photo`
   - Replace `6942e3873c4380cd31a1c3c9` with your student ID

3. **Set Authorization:**
   - Go to **Authorization** tab
   - Type: `Bearer Token`
   - Token: `YOUR_ADMIN_TOKEN`

4. **Set Body:**
   - Go to **Body** tab
   - Select **form-data**
   - Add key: `photo` (change type from "Text" to **"File"**)
   - Click **Select Files** and choose an image (JPEG, PNG, GIF, or WebP)
   - Max size: 5MB

5. **Send Request**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Student photo uploaded successfully",
  "data": {
    "studentId": "6942e3873c4380cd31a1c3c9",
    "photo": "/uploads/students/student-1234567890-abc123.jpg",
    "photoUpdatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `photo` field contains file path
- File is saved in `backend/uploads/students/`

---

### Step 3: Verify Photo in Student Profile

**Request:**
```bash
GET http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6942e3873c4380cd31a1c3c9",
    "firstName": "Alice",
    "lastName": "Johnson",
    "photo": "/uploads/students/student-1234567890-abc123.jpg",
    "photoUpdatedAt": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

**✅ Success:** Photo URL is present in response

---

### Step 4: View Photo in Browser

Open in browser:
```
http://localhost:5001/uploads/students/student-1234567890-abc123.jpg
```

**✅ Success:** Photo displays correctly

---

## 🧪 Test 2: Payment with Photo Display

### Step 1: Register Payment Device (if not done)

**Request:**
```bash
POST http://localhost:5001/api/devices/register
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "deviceId": "pos-canteen-001",
  "name": "Main Canteen POS",
  "deviceType": "pos",
  "schoolId": "6942c83c61e18873521275bb",
  "location": {
    "building": "Main Building",
    "zone": "canteen"
  },
  "capabilities": ["rfid"]
}
```

**Save the `apiKey` from response** (for IoT device, not needed for API testing)

---

### Step 2: Get Student Card UID

**Request:**
```bash
GET http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9
Authorization: Bearer YOUR_TOKEN
```

**Note the `cardUID`** (e.g., `CARD789012`)

---

### Step 3: Ensure Student Has Balance

**Check balance:**
```bash
GET http://localhost:5001/api/accounts/student/6942e3873c4380cd31a1c3c9/balance
Authorization: Bearer YOUR_TOKEN
```

**If balance is low, add balance:**
```bash
POST http://localhost:5001/api/topup/manual
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "studentId": "6942e3873c4380cd31a1c3c9",
  "amount": 5000,
  "paymentMethod": "cash"
}
```

---

### Step 4: Simulate Card Tap (Payment)

**Request:**
```bash
POST http://localhost:5001/api/card/tap
Content-Type: application/json

{
  "cardUID": "CARD789012",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "type": "payment",
    "success": true,
    "data": {
      "transaction": {
        "id": "...",
        "reference": "TXN-...",
        "amount": 500,
        "balanceAfter": 4500,
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      "student": {
        "id": "6942e3873c4380cd31a1c3c9",
        "name": "Alice Johnson",
        "firstName": "Alice",
        "lastName": "Johnson",
        "studentId": "STU002",
        "grade": "6",
        "class": "B",
        "photo": "/uploads/students/student-1234567890-abc123.jpg",  // ⬅️ PHOTO HERE!
        "accountBalance": 4500
      },
      "merchant": {
        "name": "Main Canteen",
        "type": "canteen"
      },
      "newBalance": 4500
    }
  }
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `student.photo` field contains photo URL
- Transaction is created
- Balance is deducted correctly

---

### Step 5: Verify Photo URL Works

Copy the photo URL from response:
```
http://localhost:5001/uploads/students/student-1234567890-abc123.jpg
```

Open in browser - photo should display.

---

## 🧪 Test 3: Student Without Photo

### Test Payment for Student Without Photo

1. **Find a student without photo** (or delete photo first):
   ```bash
   DELETE http://localhost:5001/api/students/{studentId}/photo
   Authorization: Bearer YOUR_TOKEN
   ```

2. **Make payment:**
   ```bash
   POST http://localhost:5001/api/card/tap
   {
     "cardUID": "CARD_WITHOUT_PHOTO",
     "deviceId": "pos-canteen-001",
     "deviceLocation": "Main Canteen",
     "amount": 500
   }
   ```

**Expected Response:**
```json
{
  "data": {
    "data": {
      "student": {
        "photo": null,  // ⬅️ NULL if no photo
        ...
      }
    }
  }
}
```

**✅ Success:** `photo` is `null` (not an error)

---

## 🧪 Test 4: Update Student Photo

### Replace Existing Photo

1. **Upload new photo:**
   ```bash
   POST http://localhost:5001/api/students/{studentId}/photo
   # Upload different image
   ```

2. **Verify old photo is deleted:**
   - Old photo file should be removed from `backend/uploads/students/`
   - New photo URL should be different

3. **Check student profile:**
   ```bash
   GET http://localhost:5001/api/students/{studentId}
   ```
   - `photo` field should have new URL
   - `photoUpdatedAt` should be updated

---

## 🧪 Test 5: Delete Student Photo

**Request:**
```bash
DELETE http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9/photo
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student photo deleted successfully"
}
```

**Verify:**
1. Photo file is deleted from `backend/uploads/students/`
2. Student profile shows `photo: null`

---

## 🧪 Test 6: Error Cases

### Test 1: Invalid File Type

**Request:**
```bash
POST /api/students/{studentId}/photo
# Upload a .txt or .pdf file
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
}
```

---

### Test 2: File Too Large

**Request:**
```bash
POST /api/students/{studentId}/photo
# Upload file > 5MB
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "File too large"
}
```

---

### Test 3: Student Not Found

**Request:**
```bash
POST /api/students/invalid-id/photo
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

## 📱 Frontend Testing (Optional)

### Display Photo in Verification Screen

**JavaScript Example:**
```javascript
// After card tap response
const response = await fetch('/api/card/tap', {
  method: 'POST',
  body: JSON.stringify({
    cardUID: 'CARD789012',
    deviceId: 'pos-canteen-001',
    deviceLocation: 'Main Canteen',
    amount: 500
  })
});

const data = await response.json();
const student = data.data.data.student;

// Display photo
const photoUrl = student.photo 
  ? `http://localhost:5001${student.photo}` 
  : '/default-avatar.png';

document.getElementById('student-photo').src = photoUrl;
document.getElementById('student-name').textContent = student.name;
document.getElementById('balance').textContent = student.accountBalance;
```

---

## ✅ Complete Test Checklist

- [ ] Upload student photo successfully
- [ ] View photo in student profile
- [ ] Access photo via URL in browser
- [ ] Payment response includes photo URL
- [ ] Photo displays correctly in payment response
- [ ] Student without photo returns `null`
- [ ] Update photo replaces old one
- [ ] Delete photo removes file and reference
- [ ] Invalid file type is rejected
- [ ] File size limit is enforced
- [ ] Error handling works correctly

---

## 🐛 Troubleshooting

### Photo Not Appearing

1. **Check file exists:**
   ```bash
   ls backend/uploads/students/
   ```

2. **Check file permissions:**
   ```bash
   chmod 755 backend/uploads/students/
   ```

3. **Check static file serving:**
   - Verify `app.ts` has static file middleware
   - Check URL path matches file location

### Photo URL Returns 404

1. **Check file path:**
   - File should be in `backend/uploads/students/`
   - URL should be `/uploads/students/filename.jpg`

2. **Check static middleware:**
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
   ```

### Payment Response Missing Photo

1. **Verify student has photo:**
   ```bash
   GET /api/students/{studentId}
   ```

2. **Check payment function:**
   - Ensure `getPhotoUrl` is imported
   - Check `student.photo` is included in response

---

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________

Test 1: Photo Upload
- Status: [ ] Pass [ ] Fail
- Notes: ___________

Test 2: Payment with Photo
- Status: [ ] Pass [ ] Fail
- Notes: ___________

Test 3: Student Without Photo
- Status: [ ] Pass [ ] Fail
- Notes: ___________

Test 4: Update Photo
- Status: [ ] Pass [ ] Fail
- Notes: ___________

Test 5: Delete Photo
- Status: [ ] Pass [ ] Fail
- Notes: ___________

Issues Found:
1. ___________
2. ___________
```

---

**Last Updated**: 2024



