import { Document, Types } from 'mongoose';
  import { 
    UserRole, 
    CardStatus, 
    AttendanceType, 
    TransactionType, 
    DeviceType, 
    DeviceStatus,
    NotificationType 
  } from '../types/enums';

// Base interface for all models
// export interface IBaseDocument extends Document {
//   _id: Types.ObjectId;
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
// }


// Omit the conflicting properties from the Document type first
export interface IBaseDocument extends Omit<Document, '_id' | 'createdAt' | 'updatedAt'> {
  // Now, define your desired types explicitly
  _id: Types.ObjectId;
  id: string; // The virtual property
  createdAt: Date;
  updatedAt: Date;
}

// User Interface
export interface IUser extends IBaseDocument {
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  
  // Student-specific fields
  studentDetails?: {
    rollNumber: string;
    classId: Types.ObjectId;
    section: string;
    admissionDate: Date;
    currentStatus: 'active' | 'graduated' | 'transferred';
  };

  // Parent-specific fields
  parentDetails?: {
    children: Types.ObjectId[];
    notificationPreferences: {
      push: boolean;
      sms: boolean;
      email: boolean;
    };
  };

  // Staff/Admin fields
  employeeId?: string;
  department?: string;

  // Profile
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    address?: string;
    photoUrl?: string;
  };

  // Settings
  settings: {
    language: string;
    theme: string;
  };

  // Status
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  passwordChangedAt?: Date;
  refreshToken?: string;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

// Card Interface
export interface ICard extends IBaseDocument {
  cardUID: string;
  studentId: Types.ObjectId;
  linkedParentIds: Types.ObjectId[];
  
  cardType: 'student' | 'staff' | 'visitor';
  status: CardStatus;
  balance: number;
  
  issueDate: Date;
  expiryDate: Date;
  lastUsed: Date;
  
  security: {
    pinHash: string;
    failedAttempts: number;
    lastFailedAttempt: Date;
  };
  
  metadata: {
    manufacturer: string;
    batchNumber: string;
    issuedBy: Types.ObjectId;
  };
}

// Attendance Interface
export interface IAttendance extends IBaseDocument {
  eventType: AttendanceType;
  cardId: Types.ObjectId;
  studentId: Types.ObjectId;
  deviceId: Types.ObjectId;
  
  timestamp: Date;
  location: {
    gate: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  
  automated: boolean;
  verified: boolean;
  
  metadata: {
    readerSignal: number;
    temperature?: number;
  };
  
  // Indexed fields for partitioning
  date: string; // "YYYY-MM-DD"
  hour: number; // 0-23
}

// Transaction Interface
export interface ITransaction extends IBaseDocument {
  transactionType: TransactionType;
  amount: number;
  currency: string;
  
  purchaseDetails?: {
    items: Array<{
      itemId: Types.ObjectId;
      name: string;
      quantity: number;
      unitPrice: number;
    }>;
    canteenId: Types.ObjectId;
    totalAmount: number;
  };
  
  topUpDetails?: {
    method: 'cash' | 'card' | 'bank_transfer' | 'online';
    initiatedBy: Types.ObjectId;
    receiptNumber: string;
    previousBalance: number;
    newBalance: number;
  };
  
  cardId: Types.ObjectId;
  studentId: Types.ObjectId;
  parentId?: Types.ObjectId;
  
  status: 'completed' | 'pending' | 'failed' | 'reversed';
  
  audit: {
    initiatedByDevice: Types.ObjectId;
    verifiedBy?: Types.ObjectId;
    sessionId: string;
  };
}

// Device Interface
export interface IDevice extends IBaseDocument {
  deviceId: string;
  deviceType: DeviceType;
  name: string;
  
  location: {
    building: string;
    floor: number;
    room: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  
  status: DeviceStatus;
  lastPing: Date;
  
  configuration: {
    ipAddress: string;
    firmwareVersion: string;
    supportedProtocols: string[];
  };
  
  capabilities: {
    nfc: boolean;
    pinEntry: boolean;
    receiptPrinting: boolean;
    biometrics: boolean;
  };
  
  security: {
    apiKeyHash: string;
    allowedIPs: string[];
    lastKeyRotation: Date;
  };
}

// Class Interface
export interface IClass extends IBaseDocument {
  className: string;
  section: string;
  academicYear: string;
  
  classTeacherId: Types.ObjectId;
  roomId: Types.ObjectId;
  
  schedule: {
    periodTimings: Array<{
      period: number;
      startTime: string;
      endTime: string;
      subject: string;
      teacherId: Types.ObjectId;
    }>;
    breaks: Array<{
      name: string;
      startTime: string;
      endTime: string;
    }>;
  };
  
  students: Types.ObjectId[];
  capacity: number;
  currentStrength: number;
  
  metadata: {
    curriculum: string;
    syllabusUrl: string;
  };
}