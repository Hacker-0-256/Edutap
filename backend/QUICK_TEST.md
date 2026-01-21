# 🚀 Quick Testing Guide

Your server is running on **port 5001**. Here are quick ways to test it:

## ✅ Method 1: Browser (Easiest)

1. **Root endpoint** (API info):
   ```
   http://localhost:5001/
   ```

2. **Health check**:
   ```
   http://localhost:5001/health
   ```

## ✅ Method 2: cURL (Terminal)

### 1. Health Check
```bash
curl http://localhost:5001/health
```

### 2. Login (Get Token)
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "password": "admin123"
  }'
```

**Copy the `token` from the response!**

### 3. Get Students (Use token from step 2)
```bash
curl -X GET http://localhost:5001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Register Student with Parent
```bash
curl -X POST http://localhost:5001/api/students/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "studentId": "STU001",
    "cardUID": "CARD123456",
    "grade": "5",
    "class": "A",
    "schoolId": "YOUR_SCHOOL_ID",
    "initialBalance": 1000,
    "parentFirstName": "Jane",
    "parentLastName": "Doe",
    "parentPhone": "+250788123456",
    "parentEmail": "jane.doe@email.com",
    "parentReceiveSMS": true
  }'
```

### 5. Card Tap (Payment)
```bash
curl -X POST http://localhost:5001/api/card/tap \
  -H "Content-Type: application/json" \
  -d '{
    "cardUID": "CARD123456",
    "deviceId": "pos-canteen-001",
    "deviceLocation": "Main Canteen",
    "amount": 500,
    "description": "Lunch purchase"
  }'
```

## ✅ Method 3: Automated Test Script

Run the automated test script:

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

This will test:
- ✅ Health check
- ✅ Login
- ✅ Get schools
- ✅ Get students
- ✅ Get transactions

## ✅ Method 4: VS Code REST Client

1. Install **REST Client** extension in VS Code
2. Open `backend/test.http`
3. Click "Send Request" above each request

## ✅ Method 5: Postman

1. Import the collection from `test.http`
2. Set base URL: `http://localhost:5001/api`
3. Login first to get token
4. Set token in Authorization header

## 📋 Quick Test Checklist

- [ ] Server running: `npm run dev`
- [ ] Health check works: `curl http://localhost:5001/health`
- [ ] Root endpoint works: Visit `http://localhost:5001/` in browser
- [ ] Login works: Get token from `/api/auth/login`
- [ ] Get students works: Use token in Authorization header
- [ ] Register student works: Create new student with parent
- [ ] Card tap works: Process payment via card

## 🔑 Sample Login Credentials (from seed)

- **Admin**: `admin@school.edu` / `admin123`
- **School Staff**: `staff.greenvalley@school.edu` / `staff123`
- **Parent**: `john.smith@email.com` / `parent123`

## 📚 Full Documentation

For detailed testing scenarios, see:
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `API_DOCUMENTATION.md` - Complete API reference

## 🐛 Troubleshooting

**Server not responding?**
```bash
# Check if server is running
curl http://localhost:5001/health

# If not, start it
cd backend
npm run dev
```

**Need to seed database?**
```bash
cd backend
npm run seed
```

**Port conflict?**
- Your server is on port 5001 (configured in `.env`)
- If you need to change it, update `PORT=5001` in `.env`






