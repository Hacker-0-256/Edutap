# EduTap Admin Dashboard

React + TypeScript frontend for the EduTap school management system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images, logos, etc.
│   ├── components/       # Reusable components
│   │   ├── layout/      # Header, Sidebar, MainLayout
│   │   └── common/      # Common UI components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main app component
├── public/             # Static files
└── package.json
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - UI component library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Query** - Data fetching & caching
- **Socket.io Client** - Real-time updates
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 📝 Features

- ✅ Authentication (Login/Logout)
- ✅ Dashboard with statistics
- ✅ Responsive layout
- 🚧 Student Management (In Progress)
- 🚧 Attendance Monitoring (In Progress)
- 🚧 Payment/Transaction Management (In Progress)
- 🚧 Device Management (In Progress)
- 🚧 Reports & Export (In Progress)

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. The token is automatically included in API requests via axios interceptors.

## 🎨 UI Theme

The app uses Ant Design with custom theme colors matching the EduTap brand:
- Primary: #1890FF (Blue)
- Success: #52C41A (Green)
- Warning: #FA8C16 (Orange)
- Error: #F5222D (Red)

## 📱 Responsive Design

The layout is responsive and works on:
- Desktop (> 1200px)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## 🚀 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📚 Documentation

See the main project README and UI_SPECIFICATION.md for detailed documentation.
