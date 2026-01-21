# 🔧 Troubleshooting Guide

## Network Error on Login

If you see "Network Error" when trying to login, it means the frontend cannot connect to the backend API.

### ✅ Solution

**1. Make sure the backend is running:**

```bash
# Navigate to backend directory
cd backend

# Start the backend server
npm run dev
```

You should see:
```
✅ Server running on port 5001
✅ MongoDB connected
```

**2. Check backend URL in frontend:**

The frontend expects the backend at `http://localhost:5001/api`

If your backend is running on a different port, update `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:YOUR_PORT/api
```

**3. Restart the frontend after changing .env:**

```bash
# Stop the frontend (Ctrl+C)
# Then restart it
cd frontend
npm run dev
```

---

## Common Issues

### Issue 1: Backend Not Running
**Symptom**: Network Error, Connection Refused

**Solution**: 
- Start the backend: `cd backend && npm run dev`
- Wait for "Server running on port 5001" message

### Issue 2: Wrong Port
**Symptom**: Network Error, but backend is running

**Solution**:
- Check what port backend is using (check backend console)
- Update `frontend/.env` with correct port
- Restart frontend

### Issue 3: CORS Error
**Symptom**: CORS policy error in browser console

**Solution**:
- Backend should already have CORS enabled
- Make sure backend is running
- Check backend logs for CORS errors

### Issue 4: Invalid Credentials
**Symptom**: "Invalid email or password" error

**Solution**:
- Use correct credentials (see `LOGIN_CREDENTIALS.md`)
- Make sure database is seeded: `cd backend && npm run seed`

---

## Quick Checklist

- [ ] Backend is running (`cd backend && npm run dev`)
- [ ] Backend shows "Server running on port 5001"
- [ ] MongoDB is connected (check backend logs)
- [ ] Frontend `.env` file exists with correct API URL
- [ ] Frontend is restarted after changing `.env`
- [ ] Using correct login credentials

---

## Testing the Connection

You can test if the backend is accessible:

```bash
# Test if backend is running
curl http://localhost:5001/api/health

# Or test login endpoint
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"admin123"}'
```

If these commands work, the backend is running correctly.

---

**Last Updated**: 2024


