# Complete IoT School Attendance System - Backend

A comprehensive IoT-based student attendance tracking system with role-based authentication, real-time monitoring, device management, and automated SMS notifications. Built with Node.js, TypeScript, MongoDB, and Socket.io for real-time features.

## 🚀 Features

### Core IoT Features
- **RFID/NFC Card Integration**: IoT devices record student arrivals by card tap
- **Real-time WebSocket Updates**: Live attendance notifications and device monitoring
- **IoT Device Management**: Register, authenticate, monitor, and configure devices
- **Device Health Monitoring**: Track device status, battery, signal strength
- **Comprehensive Logging**: All device activities and events with automatic cleanup
- **Zone-based Organization**: Group devices by school zones/areas
- **Arrival-Only Tracking**: System tracks when students arrive at school

### Role-Based Access Control
- **Admin Users**: Full system management (schools, users, logs)
- **School Staff**: Manage students, parents, and monitor attendance within their school
- **Parents**: View children's attendance and manage profile
- **JWT Authentication**: Secure token-based authentication for all roles

### Advanced Features
- **Device Authentication**: Secure API key-based device authentication
- **Real-time Dashboards**: Live attendance and device status monitoring
- **Device Configuration**: Remote device settings management
- **Analytics & Reporting**: Device performance and attendance analytics
- **School Attendance Monitoring**: Complete attendance tracking and reporting for schools
- **Error Tracking**: Comprehensive error logging and monitoring
- **Multi-school Support**: Manage multiple schools with one system
- **Automatic SMS Notifications**: Parents receive instant alerts

## 🛠️ Tech Stack

- **Backend**: Node.js + TypeScript + Express
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for WebSocket connections
- **SMS Service**: Africa's Talking (or Twilio)
- **Authentication**: JWT tokens for users, API keys for devices
- **Validation**: Built-in request validation
- **Architecture**: MVC pattern with controllers, routes, and middleware

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers (NEW)
│   │   ├── admin.controller.ts     # Admin operations
│   │   ├── school.controller.ts    # School staff operations
│   │   └── parent.controller.ts    # Parent operations
│   ├── middleware/           # Authentication & validation (NEW)
│   │   └── auth.middleware.ts      # JWT & role-based middleware
│   ├── functions/            # Business logic functions
│   │   ├── auth.ts           # User authentication
│   │   ├── sms.ts            # SMS notifications
│   │   ├── attendance.ts     # Attendance recording with real-time
│   │   └── device.ts         # IoT device management
│   ├── models/               # Database models
│   │   ├── user.ts           # Users (admin, school, parent roles)
│   │   ├── student.ts        # Student information
│   │   ├── parent.ts         # Parent contact details
│   │   ├── school.ts         # School information
│   │   ├── attendance.ts     # Attendance records
│   │   ├── device.ts         # IoT device management
│   │   └── deviceLog.ts      # Device activity logs
│   ├── routes/               # API endpoints
│   │   ├── auth.routes.ts    # Authentication
│   │   ├── schools.routes.ts # School CRUD (admin)
│   │   ├── school.routes.ts  # School operations (staff)
│   │   ├── parent.routes.ts  # Parent operations
│   │   ├── admin.routes.ts   # Admin operations
│   │   ├── attendance.routes.ts
│   │   ├── students.routes.ts
│   │   ├── parents.routes.ts
│   │   ├── devices.routes.ts
│   │   └── logs.routes.ts
│   ├── seeds/                # Database seeding scripts
│   │   └── seed.ts           # Sample data seeder
│   ├── types/                # TypeScript type definitions
│   ├── interfaces/           # Interface definitions
│   ├── app.ts                # Express + Socket.io setup
│   ├── server.ts             # Server startup
│   └── database.ts           # Database connection
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This documentation
```

## 🏗️ How the Backend is Built - Step by Step

### Step 1: Project Setup & Dependencies

**1.1 Initialize Node.js Project**
```bash
mkdir backend
cd backend
npm init -y
```

**1.2 Install Core Dependencies**
```bash
npm install express mongoose socket.io bcryptjs jsonwebtoken cors dotenv axios
```

**1.3 Install Development Dependencies**
```bash
npm install -D typescript tsx @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node
```

**1.4 Configure TypeScript**
Create `tsconfig.json` with ES modules support and proper compilation settings.

### Step 2: Database Models & Schema Design

**2.1 User Model (Role-Based Authentication)**
```typescript
// src/models/user.ts
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'school', 'parent'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, // For school staff
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }, // For parents
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

**2.2 Core Entity Models**
- **School**: Basic school information
- **Parent**: Parent contact details and preferences
- **Student**: Student info linked to parent and school
- **Attendance**: Attendance records with timestamps
- **Device**: IoT device information and status
- **DeviceLog**: Activity logs for monitoring

### Step 3: Authentication System

**3.1 JWT Authentication Functions**
```typescript
// src/functions/auth.ts
export async function registerUser(email, password, role, firstName, lastName) {
  // Validate input, check uniqueness, hash password, create user, generate JWT
}

export async function loginUser(email, password) {
  // Find user, verify password, generate JWT with role and references
}
```

**3.2 Role-Based Middleware**
```typescript
// src/middleware/auth.middleware.ts
export function authenticateToken(req, res, next) {
  // Extract and verify JWT token
}

export function requireRole(...roles) {
  // Check if user has required role
}

export function requireSchoolAccess(req, res, next) {
  // Ensure school staff can only access their school's data
}
```

### Step 4: Role-Based Controllers

**4.1 Admin Controller**
- CRUD operations for schools
- System-wide log management
- User management across all schools

**4.2 School Controller**
- CRUD for students and parents within their school
- Attendance management for their students

**4.3 Parent Controller**
- Profile management
- View children's attendance records
- Attendance summary and notifications

### Step 5: API Routes & Middleware Integration

**5.1 Route Organization**
```typescript
// src/routes/schools.routes.ts - Admin only
router.use(authenticateToken);
router.use(requireRole('admin'));
router.post('/', createSchool);
router.get('/', getSchools);

// src/routes/school.routes.ts - School staff only
router.use(authenticateToken);
router.use(requireRole('school'));
router.post('/students', createStudent);
router.get('/:schoolId/students', requireSchoolAccess, getStudents);

// src/routes/parent.routes.ts - Parents only
router.use(authenticateToken);
router.use(requireRole('parent'));
router.get('/profile', getProfile);
router.get('/children/:studentId/attendance', getChildAttendance);
```

**5.2 Route Integration in App**
```typescript
// src/app.ts
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);    // Admin
app.use('/api/school', schoolRoutes);      // School staff
app.use('/api/parent', parentRoutes);      // Parents
app.use('/api/admin', adminRoutes);        // Admin logs/users
```

### Step 6: Real-Time Features with Socket.io

**6.1 Socket.io Integration**
```typescript
// src/app.ts
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Real-time attendance broadcasts
io.on('connection', (socket) => {
  socket.on('join-school', (schoolId) => {
    socket.join(`school-${schoolId}`);
  });

  socket.on('attendance-recorded', (data) => {
    socket.to(`school-${data.schoolId}`).emit('new-attendance', data);
  });
});
```

### Step 7: IoT Device Integration

**7.1 Device Authentication**
- API key-based authentication for IoT devices
- Secure device registration and management

**7.2 Attendance Recording (Arrival Only)**
```typescript
// IoT devices call this endpoint
app.post('/api/attendance/record', async (req, res) => {
  const { cardUID, deviceId, deviceLocation } = req.body;
  // Find student by card, record arrival, send SMS notification, emit socket event
});
```

### Step 8: SMS Notifications

**8.1 SMS Service Integration**
```typescript
// src/functions/sms.ts
export async function sendAttendanceSMS(parentPhone, studentName, timestamp) {
  // Send arrival notification SMS using Africa's Talking or Twilio API
}
```

### Step 9: Error Handling & Logging

**9.1 Global Error Handling**
```typescript
// src/app.ts
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});
```

**9.2 Device Activity Logging**
- All device operations logged to DeviceLog collection
- Automatic cleanup of old logs
- Error tracking and analytics

### Step 10: Environment & Deployment Configuration

**10.1 Environment Variables**
```env
# .env
MONGODB_URI=mongodb://localhost:27017/school-attendance
JWT_SECRET=your-secure-jwt-secret
PORT=5000
AFRICAS_TALKING_API_KEY=your-sms-api-key
NODE_ENV=development
```

**10.2 Build & Run Scripts**
```json
// package.json
{
  "scripts": {
    "dev": "npx tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "clean": "rm -rf dist"
  }
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Africa's Talking account (for SMS) or Twilio account

### Installation
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Database Seeding (Optional)
Populate the database with sample data for testing and development:

```bash
# Make sure MongoDB is running and .env is configured
npm run seed
```

This will create:
- 2 sample schools
- Admin, school staff, and parent users
- 6 students across both schools
- IoT devices for attendance tracking
- Sample attendance records for the past 7 days

## 📡 API Endpoints

### 🔐 Authentication
```http
POST /api/auth/register  # Register user (admin, school, parent)
POST /api/auth/login     # User login (returns JWT with role)
```

### 👨‍💼 Admin Endpoints
```http
# School Management
POST   /api/schools           # Create school
GET    /api/schools           # List all schools
GET    /api/schools/:id       # Get school details
PUT    /api/schools/:id       # Update school
DELETE /api/schools/:id       # Deactivate school

# System Management
GET    /api/admin/logs        # System-wide logs
GET    /api/admin/logs/stats  # Log statistics
DELETE /api/admin/logs/cleanup # Cleanup old logs
GET    /api/admin/users       # All users
```

### 🏫 School Staff Endpoints
```http
# Student Management
POST   /api/school/students              # Create student
GET    /api/school/:schoolId/students    # List school students
GET    /api/school/students/:id          # Get student details
PUT    /api/school/students/:id          # Update student
DELETE /api/school/students/:id          # Deactivate student

# Parent Management
POST   /api/school/parents               # Create parent
GET    /api/school/:schoolId/parents     # List school parents
GET    /api/school/parents/:id           # Get parent details
PUT    /api/school/parents/:id           # Update parent
DELETE /api/school/parents/:id           # Deactivate parent

# Attendance Monitoring
GET    /api/school/:schoolId/attendance/today     # Today's attendance (who attended/absent)
GET    /api/school/:schoolId/attendance/report    # Attendance report for specific date
GET    /api/school/:schoolId/attendance/stats     # Attendance statistics over time
GET    /api/school/:schoolId/students/:studentId/attendance  # Individual student attendance history
```

### 👨‍👩‍👧 Parent Endpoints
```http
GET    /api/parent/profile              # Get profile
PUT    /api/parent/profile              # Update profile
GET    /api/parent/children             # List children
GET    /api/parent/children/:studentId/attendance  # Child attendance
GET    /api/parent/attendance-summary   # Attendance summary
```

### 📊 Attendance & IoT (Arrival Only)
```http
POST   /api/attendance/record              # Record student arrival (IoT devices)
GET    /api/attendance/student/:studentId  # Student arrival history
GET    /api/attendance/today/:schoolId     # Today's arrivals

# IoT Device Management
POST   /api/devices/register     # Register new IoT device
POST   /api/devices/auth         # Device authentication
POST   /api/devices/:deviceId/status  # Update device status
GET    /api/devices/:deviceId/health  # Device health info
GET    /api/devices/school/:schoolId  # School devices
```

## 🔌 WebSocket Real-time Events

### Client Connection
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

// Join school room for updates
socket.emit('join-school', 'school-id');

// Join device room for device-specific updates
socket.emit('join-device', 'device-id');
```

### Real-time Events
```javascript
// Attendance Events
socket.on('new-attendance', (data) => {
  console.log('New attendance:', data);
  // { studentName, type, timestamp, location, deviceId }
});

// Device Status Events
socket.on('device-status-update', (data) => {
  console.log('Device status:', data);
  // { deviceId, status, lastSeen, metrics }
});
```

## 🗄️ Database Schema

### User (Role-Based)
```javascript
{
  email: "user@school.com",
  password: "hashed-password",
  role: "school", // "admin" | "school" | "parent"
  firstName: "John",
  lastName: "Doe",
  schoolId: ObjectId, // For school staff
  parentId: ObjectId, // For parents
  isActive: true
}
```

### Student
```javascript
{
  firstName: "Sarah",
  lastName: "Smith",
  studentId: "STU001",
  cardUID: "ABC123456789",
  grade: "5",
  class: "A",
  parentId: ObjectId,
  schoolId: ObjectId,
  isActive: true
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth with role validation
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Middleware enforces permissions by role
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Configuration**: Secure cross-origin request handling
- **Device API Keys**: Secure IoT device authentication

## 🧪 Testing Examples

### Testing with Sample Data
After running `npm run seed`, you can test with pre-created accounts:

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"admin123"}'
```

#### School Staff Login
```bash
# Green Valley School Staff
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff.greenvalley@school.edu","password":"staff123"}'

# Sunrise School Staff
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff.sunrise@school.edu","password":"staff123"}'
```

#### Parent Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.smith@email.com","password":"parent123"}'
```

### Manual Setup Flow (Without Seeds)
```bash
# 1. Register admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"pass123","role":"admin","firstName":"Admin","lastName":"User"}'

# 2. Login admin and get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"pass123"}' | jq -r '.data.token')

# 3. Create school
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Green Valley School","address":"123 Main St","phone":"+1234567890","email":"info@gvschool.com"}'

# 4. Register school staff
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@gvschool.com","password":"pass123","role":"school","firstName":"School","lastName":"Staff","schoolId":"school-id-here"}'

# Continue with parent registration, student creation, device setup...
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school-attendance
JWT_SECRET=your-production-jwt-secret-here
AFRICAS_TALKING_API_KEY=production-api-key
AFRICAS_TALKING_USERNAME=production-username
PORT=5000
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🆘 Troubleshooting

### Authentication Issues
- Verify JWT token is included in Authorization header
- Check token expiration (7 days default)
- Ensure user has correct role for endpoint

### Role-Based Access Issues
- Confirm user registration included correct role
- Check middleware is applied to routes
- Verify schoolId/parentId references are correct

### Real-time Updates Not Working
- Ensure Socket.io client connects to correct port
- Check that client joined appropriate rooms
- Verify server WebSocket configuration

## 🤝 Architecture Decisions

### Why Role-Based Design?
- **Separation of Concerns**: Each role has specific responsibilities
- **Security**: Prevents unauthorized access to sensitive operations
- **Scalability**: Easy to add new roles or modify permissions
- **Maintainability**: Clear separation between admin, school, and parent logic

### Why Controllers Pattern?
- **Modularity**: Business logic separated from routing
- **Testability**: Controllers can be unit tested independently
- **Reusability**: Logic can be reused across different routes
- **Maintainability**: Changes to business logic don't affect routing

### Why JWT with Role Claims?
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple server instances
- **Flexible**: Role information available in every request
- **Secure**: Signed tokens prevent tampering

## 📄 License

ISC License - perfect for educational IoT projects!

---

**Built with ❤️ for educational IoT innovation!** 🚀📡🤖