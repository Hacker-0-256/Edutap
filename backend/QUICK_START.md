# 🚀 Quick Start Guide - EduTap Backend

## Prerequisites Check

```bash
# Check Node.js version (need v18+)
node --version

# Check MongoDB (if local)
mongosh --version
# OR check if MongoDB is running
mongosh
```

---

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
# Copy example file
cp .env.example .env

# Generate JWT secret
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# Edit .env and set:
# - MONGODB_URI (local or Atlas)
# - JWT_SECRET (already generated above)
# - SMS credentials (optional)
```

### 3. Start MongoDB
```bash
# Local MongoDB
brew services start mongodb-community
# OR
mongod

# OR use MongoDB Atlas (cloud)
# Just set MONGODB_URI in .env
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

This creates sample data:
- Admin: `admin@school.edu` / `admin123`
- Schools, students, parents, merchants, devices
- Sample transactions

### 5. Start Server
```bash
npm run dev
```

You should see:
```
🚀 IoT School Attendance System Started!
📍 Port: 3000
🗄️ Database: Connected
```

### 6. Test API
```bash
# Quick test script
npm run test:api

# OR use test.http file in VS Code with REST Client extension
# OR use Postman/Insomnia
```

---

## Quick Test Commands

### Health Check
```bash
curl http://localhost:3000/health
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"admin123"}'
```

### Get Students (replace TOKEN)
```bash
curl http://localhost:3000/api/students \
  -H "Authorization: Bearer TOKEN"
```

---

## Common Issues

**MongoDB not running:**
```bash
# Start MongoDB
brew services start mongodb-community
```

**Port 3000 in use:**
```bash
# Change PORT in .env
# OR kill process
lsof -ti:3000 | xargs kill
```

**JWT_SECRET error:**
- Make sure `.env` file exists
- Generate secret: `openssl rand -base64 32`

---

## Next Steps

1. ✅ Server running? Test: `curl http://localhost:3000/health`
2. ✅ Database connected? Check server logs
3. ✅ Test login: Use seeded admin credentials
4. ✅ Test registration: Register a new student
5. ✅ Test card tap: Simulate attendance/payment

See `TESTING_GUIDE.md` for detailed testing instructions.









