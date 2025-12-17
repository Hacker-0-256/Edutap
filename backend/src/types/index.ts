// TypeScript interfaces for EduTap Backend

// ============================================
// User & Authentication Types
// ============================================

export interface IUser {
  _id: string;
  email: string;
  password: string;
  role: 'admin' | 'school' | 'parent';
  schoolId?: string;
  parentId?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  role: 'admin' | 'school' | 'parent';
  firstName: string;
  lastName: string;
  schoolId?: string;
  parentId?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    schoolId?: string;
    parentId?: string;
  };
  token: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: string;
  schoolId?: string;
  parentId?: string;
}

// ============================================
// Student Types
// ============================================

export interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  cardUID: string;
  cardStatus: 'active' | 'inactive' | 'lost' | 'stolen' | 'expired';
  grade: string;
  class: string;
  parentId: string;
  schoolId: string;
  accountId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudentRequest {
  firstName: string;
  lastName: string;
  studentId: string;
  cardUID: string;
  grade: string;
  class: string;
  parentId: string;
  schoolId: string;
  accountId?: string;
  initialBalance?: number;
}

export interface IUpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  grade?: string;
  class?: string;
  isActive?: boolean;
}

// ============================================
// Parent Types
// ============================================

export interface IParent {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  receiveSMS: boolean;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateParentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  receiveSMS?: boolean;
  schoolId: string;
}

// ============================================
// School Types
// ============================================

export interface ISchool {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSchoolRequest {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
}

// ============================================
// Attendance Types
// ============================================

export interface IAttendance {
  _id: string;
  studentId: string;
  schoolId: string;
  type: 'check-in';
  timestamp: Date;
  date: string;
  deviceId: string;
  deviceLocation: string;
  smsNotificationSent: boolean;
  smsNotificationError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecordAttendanceRequest {
  cardUID: string;
  deviceId: string;
  deviceLocation: string;
}

export interface IAttendanceResponse {
  success: boolean;
  attendance: {
    id: string;
    studentName: string;
    type: string;
    timestamp: Date;
    location: string;
  };
  smsNotification: {
    sent: boolean;
    parentPhone?: string;
    error?: string;
  };
}

// ============================================
// Account Types
// ============================================

export interface IAccount {
  _id: string;
  studentId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  lastTopUp?: Date;
  stats?: {
    totalTopUps: number;
    totalSpent: number;
    totalTransactions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountBalanceResponse {
  success: boolean;
  account: {
    balance: number;
    currency: string;
    isActive: boolean;
    lastTopUp?: Date;
    stats?: {
      totalTopUps: number;
      totalSpent: number;
      totalTransactions: number;
    };
  };
  student: {
    name: string;
    studentId: string;
  };
}

export interface IAdjustBalanceRequest {
  amount: number;
  reason: string;
  description?: string;
}

// ============================================
// Transaction Types
// ============================================

export interface ITransaction {
  _id: string;
  studentId: string;
  accountId: string;
  type: 'purchase' | 'top-up' | 'refund' | 'adjustment' | 'reversal';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  merchantId?: string;
  deviceId?: string;
  deviceLocation?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed' | 'cancelled';
  reference: string;
  relatedTransactionId?: string;
  paymentMethod?: 'mobile_money' | 'bank_transfer' | 'cash' | 'card' | 'other';
  paymentReference?: string;
  errorMessage?: string;
  date: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionHistoryResponse {
  success: boolean;
  count: number;
  transactions: Array<{
    id: string;
    reference: string;
    type: string;
    amount: number;
    balanceAfter: number;
    merchant?: {
      name: string;
      type: string;
    };
    description?: string;
    status: string;
    timestamp: Date;
    date: string;
  }>;
}

export interface IRefundTransactionRequest {
  reason?: string;
}

// ============================================
// Payment Types
// ============================================

export interface IProcessPaymentRequest {
  cardUID: string;
  amount: number;
  deviceId: string;
  deviceLocation: string;
  description?: string;
  transactionRef?: string;
}

export interface IProcessPaymentResponse {
  success: boolean;
  transaction: {
    id: string;
    reference: string;
    amount: number;
    balanceAfter: number;
    timestamp: Date;
    duplicate?: boolean;
  };
  student: {
    name: string;
    studentId: string;
  };
  merchant: {
    name: string;
    type: string;
  };
}

// ============================================
// Top-up Types
// ============================================

export interface ITopUp {
  _id: string;
  studentId: string;
  accountId: string;
  parentId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash' | 'card' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionRef?: string;
  internalRef: string;
  failureReason?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInitiateTopUpRequest {
  studentId: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash' | 'card' | 'other';
}

export interface ICreateManualTopUpRequest {
  studentId: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash' | 'card' | 'other';
  parentId?: string;
  paymentReference?: string;
}

export interface IProcessTopUpRequest {
  paymentReference?: string;
  gatewayResponse?: any;
}

export interface ITopUpResponse {
  success: boolean;
  topUp: {
    id: string;
    topUpReference?: string;
    internalRef: string;
    amount: number;
    paymentMethod: string;
    status: string;
    initiatedAt?: Date;
    processedAt?: Date;
  };
  student?: {
    name: string;
    studentId: string;
  };
}

// ============================================
// Merchant Types
// ============================================

export interface IMerchant {
  _id: string;
  name: string;
  type: string;
  schoolId: string;
  location?: {
    zone?: string;
    building?: string;
    floor?: string;
    room?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    managerName?: string;
  };
  operatingHours?: any;
  isActive: boolean;
  stats?: {
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    lastSale?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMerchantRequest {
  name: string;
  type: string;
  schoolId: string;
  location?: {
    zone?: string;
    building?: string;
    floor?: string;
    room?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    managerName?: string;
  };
  operatingHours?: any;
}

// ============================================
// Device Types
// ============================================

export interface IDevice {
  _id: string;
  deviceId: string;
  name: string;
  deviceType: 'esp32' | 'rfid_reader' | 'pos' | 'canteen_reader' | 'attendance_reader';
  schoolId: string;
  merchantId?: string;
  location?: {
    zone?: string;
    building?: string;
    floor?: string;
    room?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  capabilities?: string[];
  apiKey: string;
  secretKey: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  configuration?: {
    firmwareVersion?: string;
    heartbeatInterval?: number;
    maxRetries?: number;
    timeout?: number;
  };
  stats?: {
    totalScans: number;
    successfulScans: number;
    failedScans: number;
    uptime: number;
    lastReset: Date;
  };
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterDeviceRequest {
  deviceId: string;
  name: string;
  deviceType: 'esp32' | 'rfid_reader' | 'pos' | 'canteen_reader' | 'attendance_reader';
  schoolId: string;
  location?: {
    zone?: string;
    building?: string;
    floor?: string;
    room?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  capabilities?: string[];
  merchantId?: string;
}

// ============================================
// Card Tap Types
// ============================================

export interface ICardTapRequest {
  cardUID: string;
  deviceId: string;
  deviceLocation: string;
  amount?: number;
  description?: string;
  transactionRef?: string;
}

export interface ICardTapResponse {
  success: boolean;
  type: 'attendance' | 'payment';
  message: string;
  data: IAttendanceResponse | IProcessPaymentResponse;
}

// ============================================
// Card Management Types
// ============================================

export interface IDeactivateCardRequest {
  reason: 'lost' | 'stolen' | 'other';
  otherReason?: string;
}

export interface IReplaceCardRequest {
  newCardUID: string;
  reason?: string;
}

export interface ICardStatusResponse {
  success: boolean;
  card: {
    cardUID: string;
    status: string;
    student?: {
      name: string;
      studentId: string;
    };
    deactivatedAt?: Date;
    deactivatedBy?: string;
    deactivationReason?: string;
  };
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface IAdminTransactionsResponse {
  success: boolean;
  data: {
    transactions: Array<{
      id: string;
      reference: string;
      type: string;
      amount: number;
      status: string;
      student?: {
        name: string;
        studentId: string;
        grade: string;
        class: string;
      };
      merchant?: {
        name: string;
        type: string;
      };
      balanceAfter: number;
      timestamp: Date;
      date: string;
    }>;
    summary: {
      totalRevenue: number;
      totalTransactions: number;
      averageAmount: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface IAdminSalesAnalyticsResponse {
  success: boolean;
  data: {
    salesByDate: Array<{
      date: string;
      totalRevenue: number;
      transactionCount: number;
      averageAmount: number;
    }>;
    salesByMerchant: Array<{
      merchant?: {
        id: string;
        name: string;
        type: string;
      };
      totalRevenue: number;
      transactionCount: number;
      averageAmount: number;
    }>;
    overallSummary: {
      totalRevenue: number;
      totalTransactions: number;
      averageAmount: number;
      minAmount: number;
      maxAmount: number;
    };
  };
}

export interface IAdminAccountSummariesResponse {
  success: boolean;
  data: {
    accounts: Array<{
      id: string;
      balance: number;
      currency: string;
      student?: {
        name: string;
        studentId: string;
        grade: string;
        class: string;
      };
      lastTopUp?: Date;
      isActive: boolean;
    }>;
    statistics: {
      totalBalance: number;
      accountCount: number;
      averageBalance: number;
      minBalance: number;
      maxBalance: number;
    };
  };
}

// ============================================
// Export Types
// ============================================

export interface IExportQueryParams {
  format?: 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
  schoolId?: string;
  merchantId?: string;
  type?: string;
}

// ============================================
// Error Types
// ============================================

export interface IErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface ISuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

// ============================================
// Request/Response Helpers
// ============================================

export type ApiResponse<T = any> = ISuccessResponse<T> | IErrorResponse;

