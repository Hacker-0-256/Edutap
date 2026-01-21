import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddEditStudent from './pages/AddEditStudent';
import AttendanceMonitoring from './pages/AttendanceMonitoring';
import AttendanceHistory from './pages/AttendanceHistory';
import Payments from './pages/Payments';
import PaymentVerification from './pages/PaymentVerification';
import TransactionDetails from './pages/TransactionDetails';
import AccountBalances from './pages/AccountBalances';
import AccountDetails from './pages/AccountDetails';
import Devices from './pages/Devices';
import RegisterDevice from './pages/RegisterDevice';
import DeviceDetails from './pages/DeviceDetails';
import Merchants from './pages/Merchants';
import AddEditMerchant from './pages/AddEditMerchant';
import MerchantSalesReport from './pages/MerchantSalesReport';
import CardManagement from './pages/CardManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Schools from './pages/Schools';
import Users from './pages/Users';
import SystemLogs from './pages/SystemLogs';
import { RoleGuard } from './components/common/RoleGuard';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
    borderRadius: 4,
  },
};

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/add"
        element={
          <ProtectedRoute>
            <AddEditStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/edit/:id"
        element={
          <ProtectedRoute>
            <AddEditStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AttendanceMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/history"
        element={
          <ProtectedRoute>
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/verify"
        element={
          <ProtectedRoute>
            <PaymentVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/:id"
        element={
          <ProtectedRoute>
            <TransactionDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <AccountBalances />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/:id"
        element={
          <ProtectedRoute>
            <AccountDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/devices/register"
        element={
          <ProtectedRoute>
            <RegisterDevice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/devices/:id"
        element={
          <ProtectedRoute>
            <DeviceDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants"
        element={
          <ProtectedRoute>
            <Merchants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants/add"
        element={
          <ProtectedRoute>
            <AddEditMerchant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants/edit/:id"
        element={
          <ProtectedRoute>
            <AddEditMerchant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants/:id/sales"
        element={
          <ProtectedRoute>
            <MerchantSalesReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cards"
        element={
          <ProtectedRoute>
            <CardManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      
      {/* Admin-only routes */}
      <Route
        path="/schools"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <Schools />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <Users />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <SystemLogs />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
