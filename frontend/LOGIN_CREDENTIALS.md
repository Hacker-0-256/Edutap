# 🔐 EduTap Login Credentials

## Default Login Credentials

These credentials are created when you run the database seed script (`backend/src/seeds/seed.ts`).

---

## 👨‍💼 Admin User

**Full Access** - Can manage all schools, users, and system settings.

- **Email**: `admin@school.edu`
- **Password**: `admin123`
- **Role**: `admin`
- **Name**: System Administrator

---

## 👨‍🏫 School Staff Users

**Limited Access** - Can only manage their assigned school's data.

### Green Valley International School
- **Email**: `staff.greenvalley@school.edu`
- **Password**: `staff123`
- **Role**: `school`
- **Name**: Green Valley Staff

### Sunrise Elementary School
- **Email**: `staff.sunrise@school.edu`
- **Password**: `staff123`
- **Role**: `school`
- **Name**: Sunrise Staff

---

## 👨‍👩‍👧 Parent Users

**Parent Access** - Can view their children's information (if parent portal exists).

### Parent 1
- **Email**: `john.smith@email.com`
- **Password**: `parent123`
- **Role**: `parent`
- **Name**: John Smith

### Parent 2
- **Email**: `sarah.johnson@email.com`
- **Password**: `parent123`
- **Role**: `parent`
- **Name**: Sarah Johnson

### Parent 3
- **Email**: `michael.brown@email.com`
- **Password**: `parent123`
- **Role**: `parent`
- **Name**: Michael Brown

### Parent 4
- **Email**: `emily.davis@email.com`
- **Password**: `parent123`
- **Role**: `parent`
- **Name**: Emily Davis

---

## 🚀 How to Use

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

4. **Login:**
   - Use any of the credentials above
   - For testing the admin dashboard, use: `admin@school.edu` / `admin123`

---

## 📝 Note

- These are **default seed credentials** for development/testing
- **Change passwords in production!**
- If you haven't seeded the database yet, run:
  ```bash
  cd backend
  npm run seed
  # or
  node src/seeds/seed.ts
  ```

---

## 🔄 Creating New Users

You can create new users via:
1. **Admin Panel** (once logged in as admin)
2. **API Endpoint**: `POST /api/auth/register`
3. **Database seed script** (modify `backend/src/seeds/seed.ts`)

---

**Last Updated**: 2024


