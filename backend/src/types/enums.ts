export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum CardStatus {
  ACTIVE = 'active',
  LOST = 'lost',
  STOLEN = 'stolen',
  BLOCKED = 'blocked',
  EXPIRED = 'expired',
  INACTIVE = 'inactive'
}

export enum AttendanceType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  LATE = 'late',
  ABSENT = 'absent'
}

export enum TransactionType {
  CANTEEN_PURCHASE = 'canteen_purchase',
  TOP_UP = 'top_up',
  REFUND = 'refund',
  FEE_PAYMENT = 'fee_payment',
  CARD_ISSUANCE = 'card_issuance'
}

export enum DeviceType {
  GATE_READER = 'gate_reader',
  CANTEEN_POS = 'canteen_pos',
  TOP_UP_TERMINAL = 'top_up_terminal',
  CLASSROOM_READER = 'classroom_reader'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  FAULTY = 'faulty'
}

export enum NotificationType {
  ATTENDANCE = 'attendance',
  LOW_BALANCE = 'low_balance',
  TRANSACTION = 'transaction',
  SYSTEM = 'system',
  SECURITY = 'security'
}