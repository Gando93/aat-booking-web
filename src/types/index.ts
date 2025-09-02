export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
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
  // Excursion-specific fields
  highlights?: string[];
  pickupTime?: string;
  dropoffTime?: string;
  itemsToBring?: string[];
  currency?: string;
}

export interface AppState {
  user: User | null;
  users: User[];
  bookings: Booking[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
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
  | { type: 'RESTORE_STATE'; state: AppState };

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
