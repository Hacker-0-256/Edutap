# UI Updates Required: Student Photo Feature

## 📋 Summary

The backend now supports student photos for identity verification. When a student taps their card at a payment device, the system displays the student's photo along with account details, allowing canteen staff to verify the card owner.

---

## ✅ Critical Updates Required

### 1. Student Registration Form - Add Photo Upload

**Location:** `/students` page - Add/Edit Student modal

#### **Required Changes:**

**A. Add Photo Upload Section**
- Add new section: **"Student Photo"** (optional)
- Position: After "Card Assignment" section, before "Parent Information"
- Components:
  - Photo preview area (shows selected/uploaded photo)
  - "Upload Photo" button
  - "Remove Photo" button (if photo exists)
  - File input (hidden, triggered by button)
  - Info text: "Photo is optional but recommended for identity verification at payment points"

**B. Photo Upload UI**
```
┌─────────────────────────────────────────┐
│  Student Photo (Optional)               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐                       │
│  │              │                       │
│  │   [Photo]    │  ← Preview area       │
│  │   Preview     │     (200x200px)      │
│  │              │                       │
│  └──────────────┘                       │
│                                         │
│  [📷 Upload Photo]  [🗑️ Remove]        │
│                                         │
│  ℹ️ Photo is optional but recommended   │
│     for identity verification           │
│                                         │
│  Accepted: JPG, PNG, GIF, WebP         │
│  Max size: 5MB                          │
└─────────────────────────────────────────┘
```

**C. Form Submission**
- If photo is selected during registration:
  - First: Submit student registration to `POST /api/students/register`
  - Then: Upload photo to `POST /api/students/{studentId}/photo` (using returned student ID)
  - Show progress: "Registering student..." → "Uploading photo..." → "Complete"

**D. Photo Upload Implementation**
```javascript
// After successful student registration
const studentId = response.data.student.id;

// Upload photo if selected
if (selectedPhotoFile) {
  const formData = new FormData();
  formData.append('photo', selectedPhotoFile);
  
  await fetch(`/api/students/${studentId}/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
}
```

---

### 2. Student Profile/Details Page - Display Photo

**Location:** `/students/{id}` or student details modal

#### **Required Changes:**

**A. Photo Display**
- Show student photo prominently at top of profile
- Size: 200x200px (circular or rounded square)
- Fallback: Default avatar if no photo
- Position: Top-left of profile card

**B. Photo Management Actions**
- "Upload Photo" button (if no photo)
- "Change Photo" button (if photo exists)
- "Delete Photo" button (if photo exists)
- All actions open photo upload modal

**C. Photo URL Handling**
```javascript
// Display photo
const photoUrl = student.photo 
  ? `${API_BASE_URL}${student.photo}` 
  : '/default-student-avatar.png';

<img 
  src={photoUrl} 
  alt={student.name}
  onError={(e) => {
    e.target.src = '/default-student-avatar.png';
  }}
/>
```

---

### 3. Student List/Table - Show Photo Thumbnail

**Location:** `/students` page - student list/table

#### **Required Changes:**

**A. Add Photo Column**
- Add "Photo" column (first column or after name)
- Show thumbnail (50x50px, circular)
- Click to view full-size photo
- Fallback: Initials avatar or default icon

**B. Table Layout Update**
```
┌──────┬─────────────┬──────────┬─────────┬──────────┐
│ Photo│ Name        │ StudentID│ Grade   │ Actions  │
├──────┼─────────────┼──────────┼─────────┼──────────┤
│ [📷] │ Alice John  │ STU001   │ 6A      │ [Edit]   │
│ [👤] │ Bob Smith   │ STU002   │ 5B      │ [Edit]   │
└──────┴─────────────┴──────────┴─────────┴──────────┘
```

---

### 4. Payment Verification Screen (NEW - Critical)

**Location:** POS/Canteen device interface or payment processing page

#### **This is the MAIN feature - Identity Verification**

**A. Screen Layout**
```
┌─────────────────────────────────────────────┐
│  PAYMENT VERIFICATION                       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐                           │
│  │              │                           │
│  │  [STUDENT]   │  ← Large photo (300x300) │
│  │    PHOTO     │                           │
│  │              │                           │
│  └──────────────┘                           │
│                                             │
│  Student: Alice Johnson                     │
│  ID: STU002                                 │
│  Grade: 6 - Class: B                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Transaction Details                 │   │
│  │ Amount: 500 RWF                     │   │
│  │ Current Balance: 2000 RWF           │   │
│  │ New Balance: 1500 RWF               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [✓ Confirm Payment]  [✗ Cancel]            │
│                                             │
└─────────────────────────────────────────────┘
```

**B. Implementation Flow**

1. **Card Tap Event:**
   ```javascript
   // When card is tapped at POS device
   const response = await fetch('/api/card/tap', {
     method: 'POST',
     body: JSON.stringify({
       cardUID: cardUID,
       deviceId: 'pos-canteen-001',
       deviceLocation: 'Main Canteen',
       amount: 500
     })
   });
   
   const data = await response.json();
   ```

2. **Display Verification Screen:**
   ```javascript
   const student = data.data.data.student;
   const transaction = data.data.data.transaction;
   
   // Show modal/overlay with:
   // - Student photo
   // - Student details
   // - Transaction amount
   // - New balance
   ```

3. **Photo Display:**
   ```javascript
   const photoUrl = student.photo 
     ? `${API_BASE_URL}${student.photo}` 
     : '/default-student-avatar.png';
   
   // Display large photo for verification
   <img src={photoUrl} alt={student.name} className="verification-photo" />
   ```

4. **Staff Action:**
   - Staff sees photo and verifies identity
   - Clicks "Confirm Payment" to complete
   - Or "Cancel" to abort

**C. Screen States**

- **Loading:** Show spinner while processing card tap
- **Verification:** Show photo and details (waiting for staff confirmation)
- **Success:** Show success message, close after 2 seconds
- **Error:** Show error message (insufficient balance, card inactive, etc.)

---

### 5. Edit Student Form - Photo Management

**Location:** Edit student modal/page

#### **Required Changes:**

**A. Current Photo Display**
- Show current photo (if exists)
- "Change Photo" button
- "Delete Photo" button

**B. Photo Upload**
- Same upload interface as registration
- Update endpoint: `POST /api/students/{id}/photo`
- Delete endpoint: `DELETE /api/students/{id}/photo`

**C. Update Flow**
```javascript
// Update photo
const formData = new FormData();
formData.append('photo', newPhotoFile);

await fetch(`/api/students/${studentId}/photo`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

// Delete photo
await fetch(`/api/students/${studentId}/photo`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### 6. Payment/Transaction History - Show Photo

**Location:** Transaction list/details

#### **Optional Enhancement:**

**A. Transaction List**
- Show student photo thumbnail in transaction row
- Click to view full student profile

**B. Transaction Details**
- Show student photo in transaction detail view
- Link to student profile

---

## 🎨 Design Specifications

### Photo Display Sizes

- **Verification Screen:** 300x300px (large, for identity check)
- **Profile Page:** 200x200px (medium)
- **List/Table:** 50x50px (thumbnail)
- **Modal Preview:** 150x150px

### Photo Styling

- **Shape:** Circular (border-radius: 50%)
- **Border:** 2px solid #E8E8E8
- **Shadow:** Subtle shadow for depth
- **Fallback:** Default avatar with student initials

### Photo Upload Component

```jsx
<PhotoUpload
  currentPhoto={student.photo}
  onUpload={(file) => handlePhotoUpload(file)}
  onDelete={() => handlePhotoDelete()}
  maxSize={5 * 1024 * 1024} // 5MB
  acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
/>
```

---

## 📋 Implementation Checklist

### High Priority (Must Have)
- [ ] Add photo upload to student registration form
- [ ] Display photo in student profile/details page
- [ ] Create payment verification screen with photo
- [ ] Add photo thumbnail to student list/table
- [ ] Add photo management (upload/delete) to edit student form
- [ ] Handle photo URL construction (API base URL + path)
- [ ] Add default avatar fallback

### Medium Priority (Should Have)
- [ ] Photo preview before upload
- [ ] Image cropping/resizing before upload
- [ ] Photo upload progress indicator
- [ ] Photo validation (file type, size)
- [ ] Error handling for photo upload failures
- [ ] Show photo in transaction history

### Low Priority (Nice to Have)
- [ ] Photo gallery view
- [ ] Bulk photo upload
- [ ] Photo compression before upload
- [ ] Photo filters/effects
- [ ] Photo metadata display

---

## 🔗 Backend Endpoints Reference

### Upload Student Photo
- **Endpoint:** `POST /api/students/:id/photo`
- **Auth:** Required (admin, school)
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `photo` field (file)
- **Response:** Photo URL and update timestamp

### Delete Student Photo
- **Endpoint:** `DELETE /api/students/:id/photo`
- **Auth:** Required (admin, school)
- **Response:** Success message

### Get Student (includes photo)
- **Endpoint:** `GET /api/students/:id`
- **Response:** Student object with `photo` field (URL or null)

### Payment Response (includes photo)
- **Endpoint:** `POST /api/card/tap`
- **Response:** Includes `student.photo` in response data

---

## 💻 Code Examples

### React Component: Photo Upload
```jsx
import { useState } from 'react';

function PhotoUpload({ studentId, currentPhoto, onSuccess }) {
  const [preview, setPreview] = useState(currentPhoto);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`/api/students/${studentId}/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data.data.photo);
        onSuccess(data.data.photo);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <div className="photo-preview">
        <img 
          src={preview || '/default-avatar.png'} 
          alt="Student photo"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <div>Uploading...</div>}
    </div>
  );
}
```

### React Component: Payment Verification Screen
```jsx
function PaymentVerificationScreen({ paymentData, onConfirm, onCancel }) {
  const { student, transaction, newBalance } = paymentData.data.data;
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const photoUrl = student.photo 
    ? `${API_BASE_URL}${student.photo}` 
    : '/default-student-avatar.png';

  return (
    <div className="payment-verification-modal">
      <h2>Payment Verification</h2>
      
      <div className="student-photo-large">
        <img 
          src={photoUrl} 
          alt={student.name}
          onError={(e) => {
            e.target.src = '/default-student-avatar.png';
          }}
        />
      </div>

      <div className="student-info">
        <h3>{student.name}</h3>
        <p>Student ID: {student.studentId}</p>
        <p>Grade: {student.grade} - Class: {student.class}</p>
      </div>

      <div className="transaction-details">
        <p><strong>Amount:</strong> {transaction.amount} RWF</p>
        <p><strong>Current Balance:</strong> {student.accountBalance + transaction.amount} RWF</p>
        <p><strong>New Balance:</strong> {newBalance} RWF</p>
      </div>

      <div className="actions">
        <button onClick={onConfirm} className="confirm-btn">
          ✓ Confirm Payment
        </button>
        <button onClick={onCancel} className="cancel-btn">
          ✗ Cancel
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 User Flow

### Registration with Photo
1. User fills student registration form
2. User optionally uploads photo
3. Form submits student data
4. If photo selected, upload photo after registration
5. Show success with photo preview

### Payment Verification
1. Student taps card at POS device
2. Backend processes payment and returns student data with photo
3. Frontend displays verification screen with:
   - Large student photo
   - Student details
   - Transaction amount
   - New balance
4. Canteen staff verifies identity by comparing photo
5. Staff clicks "Confirm" to complete payment
6. Success message shown, screen closes

---

## ⚠️ Important Notes

1. **Photo is Optional:** Registration should work without photo
2. **Photo URL Construction:** Always prepend API base URL to photo path
3. **Error Handling:** Show default avatar if photo fails to load
4. **File Validation:** Validate file type and size before upload
5. **Loading States:** Show loading indicators during upload
6. **Security:** Only admin/school roles can upload photos
7. **Performance:** Optimize images before upload (resize/compress)

---

## ✅ Testing Checklist

After implementing UI updates, test:
- [ ] Upload photo during student registration
- [ ] Upload photo after registration (edit form)
- [ ] Delete student photo
- [ ] Display photo in student profile
- [ ] Display photo in student list
- [ ] Payment verification screen shows photo
- [ ] Default avatar shows when no photo
- [ ] Photo displays correctly in browser
- [ ] File validation (type, size)
- [ ] Error handling (upload failure, network error)
- [ ] Photo URL construction (with API base URL)

---

**Last Updated:** 2024



