import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'school'; // Only admin and school staff can login
  schoolId?: string;
  schoolName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    const userRole = response.data.data?.user?.role as string | undefined;
    
    // Reject parent logins - parents should not have access to the dashboard
    if (userRole === 'parent') {
      throw new Error('Parents do not have access to the admin dashboard. Parents receive information via SMS notifications only.');
    }
    
    // Only allow admin and school staff
    if (userRole !== 'admin' && userRole !== 'school') {
      throw new Error('Access denied. Only administrators and school staff can login.');
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

