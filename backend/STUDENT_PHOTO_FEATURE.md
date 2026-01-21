# Student Photo Feature

## Overview

The student photo feature allows you to upload and manage student photos for identity verification. When a student taps their card at a payment device (POS/canteen), the system displays the student's photo along with their account details, allowing canteen staff to verify the card owner.

## Features

- ✅ **Optional Photo Upload**: Photos are optional during registration and can be added later
- ✅ **Photo Management**: Upload, update, or delete student photos
- ✅ **Payment Verification**: Student photo is included in payment responses for verification
- ✅ **Profile Display**: Photo URL is included in student profile responses
- ✅ **File Validation**: Only image files (JPEG, PNG, GIF, WebP) up to 5MB are allowed
- ✅ **Automatic Cleanup**: Old photos are automatically deleted when updated

---

## API Endpoints

### 1. Upload Student Photo

**Endpoint**: `POST /api/students/:id/photo`

**Authentication**: Required (Admin or School role)

**Request**:
- Method: `POST`
- URL: `/api/students/:id/photo`
- Content-Type: `multipart/form-data`
- Body: Form data with `photo` field (file)

**Example (cURL)**:
```bash
curl -X POST http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9/photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/student-photo.jpg"
```

**Example (Postman)**:
1. Select `POST` method
2. URL: `{{api_url}}/students/{{student_id}}/photo`
3. Go to **Body** tab → Select **form-data**
4. Add key: `photo` (type: File)
5. Select file from your computer
6. Send request

**Response**:
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

---

### 2. Delete Student Photo

**Endpoint**: `DELETE /api/students/:id/photo`

**Authentication**: Required (Admin or School role)

**Example**:
```bash
curl -X DELETE http://localhost:5001/api/students/6942e3873c4380cd31a1c3c9/photo \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "message": "Student photo deleted successfully"
}
```

---

### 3. Get Student Profile (includes photo)

**Endpoint**: `GET /api/students/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "6942e3873c4380cd31a1c3c9",
    "firstName": "Alice",
    "lastName": "Johnson",
    "studentId": "STU002",
    "photo": "/uploads/students/student-1234567890-abc123.jpg",
    "photoUpdatedAt": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

---

## Payment Verification Flow

When a student taps their card at a payment device, the response includes the student's photo for verification:

**Endpoint**: `POST /api/card/tap`

**Request** (Payment Device):
```json
{
  "cardUID": "CARD789012",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}
```

**Response**:
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
        "balanceAfter": 1500,
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
        "photo": "/uploads/students/student-1234567890-abc123.jpg",
        "accountBalance": 1500
      },
      "merchant": {
        "name": "Main Canteen",
        "type": "canteen"
      },
      "newBalance": 1500
    }
  }
}
```

**Frontend Display**:
The frontend should display a verification screen showing:
- Student photo (if available)
- Student name and ID
- Account balance
- Transaction amount
- New balance after transaction

This allows canteen staff to verify the card owner before completing the transaction.

---

## File Storage

- **Location**: `backend/uploads/students/`
- **Naming**: `student-{timestamp}-{random}.{ext}`
- **Max Size**: 5MB
- **Allowed Formats**: JPEG, JPG, PNG, GIF, WebP
- **URL Format**: `/uploads/students/{filename}`

**Full URL Example**:
- Local: `http://localhost:5001/uploads/students/student-1234567890-abc123.jpg`
- Production: `https://api.edutap.com/uploads/students/student-1234567890-abc123.jpg`

---

## Frontend Integration

### Displaying Student Photo

```javascript
// Get photo URL from API response
const photoUrl = student.photo 
  ? `${API_BASE_URL}${student.photo}` 
  : '/default-student-avatar.png';

// Display in React component
<img 
  src={photoUrl} 
  alt={`${student.firstName} ${student.lastName}`}
  onError={(e) => {
    e.target.src = '/default-student-avatar.png';
  }}
/>
```

### Payment Verification Screen

When a card is tapped at a payment device:

```javascript
// Example React component
function PaymentVerificationScreen({ paymentData }) {
  const { student, transaction, newBalance } = paymentData.data;
  const photoUrl = student.photo 
    ? `${API_BASE_URL}${student.photo}` 
    : '/default-student-avatar.png';

  return (
    <div className="verification-screen">
      <img src={photoUrl} alt={student.name} />
      <h2>{student.name}</h2>
      <p>Student ID: {student.studentId}</p>
      <p>Grade: {student.grade} - Class: {student.class}</p>
      <div className="balance-info">
        <p>Amount: {transaction.amount} RWF</p>
        <p>New Balance: {newBalance} RWF</p>
      </div>
      <button onClick={confirmPayment}>Confirm Payment</button>
    </div>
  );
}
```

---

## Workflow

### 1. Register Student (without photo)
```bash
POST /api/students/register
# Photo is optional, can be added later
```

### 2. Upload Photo Later
```bash
POST /api/students/{studentId}/photo
# Upload photo file
```

### 3. Payment Verification
When student taps card:
- System returns student photo in response
- Frontend displays verification screen
- Canteen staff verifies identity
- Transaction completes

---

## Error Handling

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
}
```

### File Too Large
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

### Student Not Found
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

## Security Considerations

1. **Authentication**: Photo upload/delete requires admin or school role
2. **File Validation**: Only image files are accepted
3. **Size Limits**: 5MB maximum file size
4. **Path Traversal**: Filenames are sanitized
5. **Access Control**: Photos are served as static files (consider adding authentication middleware for production)

---

## Production Recommendations

1. **Cloud Storage**: Consider using AWS S3, Cloudinary, or similar for photo storage
2. **Image Optimization**: Resize/compress images on upload
3. **CDN**: Use CDN for faster photo delivery
4. **Access Control**: Add authentication to photo URLs if needed
5. **Backup**: Implement backup strategy for student photos

---

## Testing

### Test Photo Upload
```bash
# 1. Get student ID
GET /api/students

# 2. Upload photo
POST /api/students/{studentId}/photo
# Use Postman or curl with form-data

# 3. Verify photo in response
GET /api/students/{studentId}
# Check photo field

# 4. Test payment with photo
POST /api/card/tap
# Verify photo is in response
```

---

## Example: Complete Flow

1. **Register Student**:
   ```bash
   POST /api/students/register
   # Student created without photo
   ```

2. **Upload Photo**:
   ```bash
   POST /api/students/6942e3873c4380cd31a1c3c9/photo
   # Photo uploaded
   ```

3. **Student Taps Card at Canteen**:
   ```bash
   POST /api/card/tap
   {
     "cardUID": "CARD789012",
     "deviceId": "pos-canteen-001",
     "deviceLocation": "Main Canteen",
     "amount": 500
   }
   ```

4. **Response Includes Photo**:
   ```json
   {
     "data": {
       "student": {
         "photo": "/uploads/students/student-1234567890-abc123.jpg",
         ...
       }
     }
   }
   ```

5. **Frontend Displays Verification Screen**:
   - Shows student photo
   - Shows student details
   - Shows transaction amount
   - Canteen staff verifies and confirms

---

**Last Updated**: 2024



