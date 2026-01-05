import { z } from 'zod';

// ============================================
// Authentication Schemas
// ============================================

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
    role: z.enum(['admin', 'school', 'parent']),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    schoolId: z.string().optional(),
    parentId: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

// ============================================
// Student Schemas
// ============================================

export const createStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    studentId: z.string().min(1, 'Student ID is required'),
    cardUID: z.string().min(1, 'Card UID is required'),
    grade: z.string().min(1, 'Grade is required'),
    class: z.string().min(1, 'Class is required'),
    parentId: z.string().min(1, 'Parent ID is required'),
    schoolId: z.string().min(1, 'School ID is required'),
    accountId: z.string().optional(),
    initialBalance: z.number().min(0).optional()
  })
});

// Register student with parent/guardian in one step
export const registerStudentWithParentSchema = z.object({
  body: z.object({
    // Student information
    firstName: z.string().min(1, 'Student first name is required'),
    lastName: z.string().min(1, 'Student last name is required'),
    studentId: z.string().min(1, 'Student ID is required'),
    cardUID: z.string().min(1, 'Card UID is required'),
    grade: z.string().min(1, 'Grade is required'),
    class: z.string().min(1, 'Class is required'),
    schoolId: z.string().min(1, 'School ID is required'),
    initialBalance: z.number().min(0).optional(),
    // Parent/Guardian information
    parentFirstName: z.string().min(1, 'Parent first name is required'),
    parentLastName: z.string().min(1, 'Parent last name is required'),
    parentPhone: z.string().min(1, 'Parent phone number is required'),
    parentEmail: z.string().email('Invalid parent email format').optional().or(z.literal('')),
    parentAddress: z.string().optional(),
    parentReceiveSMS: z.boolean().optional().default(true)
  })
});

export const updateStudentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Student ID is required')
  }),
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    grade: z.string().min(1).optional(),
    class: z.string().min(1).optional(),
    isActive: z.boolean().optional()
  })
});

// ============================================
// Parent Schemas
// ============================================

export const createParentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    address: z.string().optional(),
    receiveSMS: z.boolean().default(true),
    schoolId: z.string().min(1, 'School ID is required')
  })
});

// ============================================
// Payment Schemas
// ============================================

export const processPaymentSchema = z.object({
  body: z.object({
    cardUID: z.string().min(1, 'Card UID is required'),
    amount: z.number().positive('Amount must be greater than zero'),
    deviceId: z.string().min(1, 'Device ID is required'),
    deviceLocation: z.string().min(1, 'Device location is required'),
    description: z.string().optional(),
    transactionRef: z.string().optional()
  })
});

// ============================================
// Top-up Schemas
// ============================================

export const initiateTopUpSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    amount: z.number().positive('Amount must be greater than zero'),
    paymentMethod: z.enum(['mobile_money', 'bank_transfer', 'cash', 'card', 'other'])
  })
});

export const createManualTopUpSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    amount: z.number().positive('Amount must be greater than zero'),
    paymentMethod: z.enum(['mobile_money', 'bank_transfer', 'cash', 'card', 'other']),
    parentId: z.string().optional(),
    paymentReference: z.string().optional()
  })
});

export const processTopUpSchema = z.object({
  params: z.object({
    topUpId: z.string().min(1, 'Top-up ID is required')
  }),
  body: z.object({
    paymentReference: z.string().optional(),
    gatewayResponse: z.any().optional()
  })
});

// ============================================
// Card Tap Schema
// ============================================

export const cardTapSchema = z.object({
  body: z.object({
    cardUID: z.string().min(1, 'Card UID is required'),
    deviceId: z.string().min(1, 'Device ID is required'),
    deviceLocation: z.string().min(1, 'Device location is required'),
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    transactionRef: z.string().optional()
  })
});

// ============================================
// Card Management Schemas
// ============================================

export const deactivateCardSchema = z.object({
  params: z.object({
    cardUID: z.string().min(1, 'Card UID is required')
  }),
  body: z.object({
    reason: z.enum(['lost', 'stolen', 'other']),
    otherReason: z.string().optional()
  })
});

export const replaceCardSchema = z.object({
  params: z.object({
    cardUID: z.string().min(1, 'Card UID is required')
  }),
  body: z.object({
    newCardUID: z.string().min(1, 'New card UID is required'),
    reason: z.string().optional()
  })
});

// ============================================
// Account Schemas
// ============================================

export const adjustBalanceSchema = z.object({
  params: z.object({
    studentId: z.string().min(1, 'Student ID is required')
  }),
  body: z.object({
    amount: z.number().refine((val) => val !== 0, {
      message: 'Amount cannot be zero'
    }),
    reason: z.string().min(1, 'Reason is required'),
    description: z.string().optional()
  })
});

// ============================================
// Merchant Schemas
// ============================================

export const createMerchantSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Merchant name is required'),
    type: z.string().min(1, 'Merchant type is required'),
    schoolId: z.string().min(1, 'School ID is required'),
    location: z.object({
      zone: z.string().optional(),
      building: z.string().optional(),
      floor: z.string().optional(),
      room: z.string().optional()
    }).optional(),
    contact: z.object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      managerName: z.string().optional()
    }).optional(),
    operatingHours: z.any().optional()
  })
});

// ============================================
// Device Schemas
// ============================================

export const registerDeviceSchema = z.object({
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    name: z.string().min(1, 'Device name is required'),
    deviceType: z.enum(['esp32', 'rfid_reader', 'pos', 'canteen_reader', 'attendance_reader']),
    schoolId: z.string().min(1, 'School ID is required'),
    location: z.object({
      zone: z.string().optional(),
      building: z.string().optional(),
      floor: z.string().optional(),
      room: z.string().optional(),
      coordinates: z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional()
      }).optional()
    }).optional(),
    capabilities: z.array(z.string()).optional(),
    merchantId: z.string().optional()
  })
});

// ============================================
// School Schemas
// ============================================

export const createSchoolSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'School name is required'),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal(''))
  })
});

// ============================================
// Query Parameter Schemas
// ============================================

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
});

export const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional()
  })
});

