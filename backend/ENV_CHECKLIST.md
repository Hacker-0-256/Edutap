# Environment Variables Checklist

If you already have a `.env` file, make sure it includes all the required variables below.

## ✅ Required Variables

### Server Configuration
```env
PORT=3000
NODE_ENV=development  # or production
```

### Database (REQUIRED)
```env
MONGODB_URI=mongodb://localhost:27017/school-attendance
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-attendance
```

### JWT Authentication (REQUIRED)
```env
JWT_SECRET=your-strong-secret-key-here
# Generate with: openssl rand -base64 32
```

### SMS Configuration (Optional - for testing)
```env
AFRICAS_TALKING_API_KEY=your-api-key
AFRICAS_TALKING_USERNAME=your-username
# OR leave empty if you don't have SMS credentials yet
```

### CORS Configuration (Optional)
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
# Comma-separated list of allowed origins
```

---

## 🔍 Quick Check Script

Run this to verify your `.env` has all required variables:

```bash
# Check if required variables exist
echo "Checking .env file..."
[ -f .env ] && echo "✓ .env file exists" || echo "✗ .env file missing"

# Check required variables
grep -q "MONGODB_URI" .env && echo "✓ MONGODB_URI" || echo "✗ MONGODB_URI missing"
grep -q "JWT_SECRET" .env && echo "✓ JWT_SECRET" || echo "✗ JWT_SECRET missing"
grep -q "PORT" .env && echo "✓ PORT" || echo "✗ PORT missing (optional, defaults to 3000)"

echo ""
echo "If JWT_SECRET is missing or set to default, generate one:"
echo "  openssl rand -base64 32"
```

---

## 📝 Minimum Required for Testing

At minimum, your `.env` needs:

```env
MONGODB_URI=mongodb://localhost:27017/school-attendance
JWT_SECRET=<generate-a-strong-secret>
PORT=3000
```

Everything else is optional for basic testing.

---

## 🚨 Common Issues

### Issue: "JWT_SECRET is required"
**Fix:** Add `JWT_SECRET` to your `.env` file
```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Issue: "MongoDB connection failed"
**Fix:** Check your `MONGODB_URI` is correct and MongoDB is running

### Issue: "Port already in use"
**Fix:** Change `PORT` in `.env` or kill the process using that port

---

## 💡 Pro Tip

If you want to add missing variables without overwriting your existing `.env`:

```bash
# Add only missing variables from .env.example
grep -v "^#" .env.example | grep "=" | while IFS='=' read -r key value; do
  if ! grep -q "^${key}=" .env 2>/dev/null; then
    echo "${key}=${value}" >> .env
    echo "Added: ${key}"
  fi
done
```









