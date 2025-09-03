export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer';

export interface User {
  id: string;
  email: string;
  phone?: string;  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type PaymentType = 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'other';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceType: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number; // in minutes
  status: BookingStatus;
  notes?: string;
  totalAmount: number;
  depositAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentType?: PaymentType;
  createdBy: string; // user ID
  createdAt: string;
  updatedAt: string;
  // Receipt and authentication
  receiptNumber?: string;
  qrCodeData?: string;
  // Additional fields
  roomNumber?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number;
  maxCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  // Excursion-specific fields
  highlights?: string[];
  pickupTime?: string;
  dropoffTime?: string;
  itemsToBring?: string[];
  currency?: string;
  thumbnail?: string; // URL or base64 image data
}

export interface SystemSettings {
  id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoConfirmBookings: boolean;
  requireDeposit: boolean;
  defaultDepositPercentage: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  privacyPolicy: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSyncEnabled: boolean;
  autoSyncInterval: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

export interface Permission {
  module: string;
  actions: string[];
}

export interface RolePermissions {
  role: UserRole;
  description: string;
  permissions: Permission[];
}

export interface AppState {
  user: User | null;
  users: User[];
  bookings: Booking[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  systemSettings: SystemSettings;
  rolePermissions: RolePermissions[];
}

export type AppAction =
  | { type: 'SET_USER'; user: User | null }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'ADD_BOOKING'; booking: Booking }
  | { type: 'UPDATE_BOOKING'; booking: Booking }
  | { type: 'DELETE_BOOKING'; id: string }
  | { type: 'ADD_SERVICE'; service: Service }
  | { type: 'UPDATE_SERVICE'; service: Service }
  | { type: 'DELETE_SERVICE'; id: string }
  | { type: 'ADD_USER'; user: User }
  | { type: 'UPDATE_USER'; user: User }
  | { type: 'DELETE_USER'; id: string }
  | { type: 'UPDATE_SYSTEM_SETTINGS'; settings: SystemSettings }
  | { type: 'RESTORE_STATE'; state: AppState }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'DELETE_NOTIFICATION'; id: string };

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function today(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AAT${year}${month}${day}${random}`;
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    description: 'Full system access',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'bookings', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'services', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'settings', actions: ['view', 'edit'] },
      { module: 'reports', actions: ['view', 'export'] }
    ]
  },
  {
    role: 'manager',
    description: 'Management level access',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'bookings', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'services', actions: ['view', 'create', 'edit'] },
      { module: 'users', actions: ['view', 'create', 'edit'] },
      { module: 'reports', actions: ['view'] }
    ]
  },
  {
    role: 'staff',
    description: 'Staff level access',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'bookings', actions: ['view', 'create', 'edit'] },
      { module: 'services', actions: ['view'] }
    ]
  },
  {
    role: 'viewer',
    description: 'Read-only access to basic information',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'bookings', actions: ['view'] },
      { module: 'services', actions: ['view'] }
    ]
  }
];
