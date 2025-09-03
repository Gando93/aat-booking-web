import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction } from '../types';
import { today } from '../types';

const STORAGE_KEY = 'aat-booking-state';

// Initial state
const initialState: AppState = {
  user: null,
  users: [
    {
      id: 'admin_1',
      email: 'admin@aatbooking.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      createdAt: today(),
    }
  ],
  bookings: [],
  services: [
    {
      id: 'excursion_1',
      name: 'Orientation Tour',
      description: 'One-day tour covering Banjul, Serrekunda, and Kololi with cultural experiences',
      category: 'Day Tours',
      duration: 360,
      price: 40,
      maxCapacity: 15,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Banjul: Albert Market & National Museum',
        'Serrekunda: Batik workshop',
        'Kololi: Monkey forest'
      ],
      pickupTime: '8:30 AM',
      dropoffTime: '2:30 PM',
      itemsToBring: [
        'Comfortable shoes',
        'Water',
        'Sunscreen',
        'Camera'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_2',
      name: '2-Day Gambia Adventure',
      description: 'Two-day adventure including ferry crossing, stone circles, and wildlife viewing',
      category: 'Multi-Day Tours',
      duration: 2880,
      price: 165,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Ferry crossing to the north',
        'Wassu Stone Circles',
        'Boat trip to Baboon Island Hippo\'s, Chimpanzees',
        'Georgetown & overnight at Sillahkunda Lodge'
      ],
      pickupTime: '5:30 AM (Day 1)',
      dropoffTime: '4:00 PM (Day 2)',
      itemsToBring: [
        'Overnight bag',
        'Insect repellent',
        'Flashlight',
        'Comfortable clothes and shoes',
        'From Jan till March a sweater'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_3',
      name: '4-Wheel Drive Adventure',
      description: 'Off-road adventure to remote villages and secluded beaches',
      category: 'Adventure Tours',
      duration: 540,
      price: 75,
      maxCapacity: 8,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Remote bush villages',
        'Local school visit',
        'Halahin River boat trip',
        'Secluded beach lunch',
        'Tanji fishing village'
      ],
      pickupTime: '8:00 AM',
      dropoffTime: '5:00 PM',
      itemsToBring: [
        'Hat & sunscreen',
        'Water bottle',
        'Camera',
        'Cash',
        'Swimwear',
        'From Jan - March sweater'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_4',
      name: 'Senegal - Fathala Wild Reserve',
      description: 'Cross-border safari adventure to Senegal\'s wildlife reserve',
      category: 'Wildlife Tours',
      duration: 630,
      price: 115,
      maxCapacity: 10,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Ferry to Barra',
        'Cross into Senegal',
        'Safari in Fathala Reserve (4x4 jeep)'
      ],
      pickupTime: '5:30 AM',
      dropoffTime: '4:00 PM',
      itemsToBring: [
        'Passport (mandatory)',
        'Yellow Fever vaccination book',
        'Hat & sunglasses',
        'Binoculars',
        'Snacks',
        'From Jan till March Sweater'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_5',
      name: 'Sita Joyeh (Baobab Island)',
      description: 'Jungle walk and boat trip to mystical Baobab Island',
      category: 'Nature Tours',
      duration: 510,
      price: 55,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Jungle walk',
        'Boat to Baobab Island',
        'Visit local marabout (witch doctor)',
        'Lunch on the island'
      ],
      pickupTime: '8:00 AM',
      dropoffTime: '4:30 PM',
      itemsToBring: [
        'Walking shoes',
        'Curiosity 😊',
        'Camera',
        'Insect repellent'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_6',
      name: 'Explore Senegal',
      description: 'Cross-border cultural tour to Casamance region',
      category: 'Cultural Tours',
      duration: 720,
      price: 90,
      maxCapacity: 15,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Cross border to Casamance',
        'Boat ride past Bird Island',
        'Kailo Island voodoo culture',
        'Lunch in Abene'
      ],
      pickupTime: '7:00 AM',
      dropoffTime: '7:00 PM',
      itemsToBring: [
        'Passport',
        'Yellow Fever Vaccination Book',
        'Sturdy shoes',
        'Sunscreen',
        'Sense of adventure!',
        'From Jan – March Sweater'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_7',
      name: 'River Memories',
      description: 'Relaxing pirogue cruise through mangroves with swimming and fishing',
      category: 'Water Tours',
      duration: 480,
      price: 65,
      maxCapacity: 10,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Pirogue cruise through mangroves',
        'Stops for swimming and fishing',
        'Full onboard lunch'
      ],
      pickupTime: '9:00 AM',
      dropoffTime: '5:00 PM',
      itemsToBring: [
        'Swimming clothes',
        'Towel',
        'Sunscreen',
        'Camera (waterproof)'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_8',
      name: 'Senegal - Toubacouta',
      description: 'Cross-border adventure to Senegal\'s delta region',
      category: 'Cultural Tours',
      duration: 720,
      price: 95,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Ferry to Barra',
        'Drive through Senegal countryside',
        'Boat trip in Saloum Delta',
        'Traditional lunch'
      ],
      pickupTime: '5:30 AM',
      dropoffTime: '7:30 PM',
      itemsToBring: [
        'Passport (mandatory)',
        'Yellow Fever vaccination book',
        'Comfortable clothes',
        'Hat & sunscreen',
        'Camera',
        'From Jan – March Sweater'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_9',
      name: 'Jufureh & Kunta Kinteh Island',
      description: 'Historical journey to the roots of African-American heritage',
      category: 'Historical Tours',
      duration: 420,
      price: 50,
      maxCapacity: 15,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Jufureh village (Alex Haley\'s Roots)',
        'Kunta Kinteh Island (former James Island)',
        'Slave trade history',
        'Traditional lunch'
      ],
      pickupTime: '8:00 AM',
      dropoffTime: '3:00 PM',
      itemsToBring: [
        'Comfortable walking shoes',
        'Hat & sunscreen',
        'Water bottle',
        'Camera',
        'Respectful attire'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_10',
      name: 'Makasutu Culture Forest',
      description: 'Sacred forest experience with traditional culture and wildlife',
      category: 'Nature Tours',
      duration: 300,
      price: 45,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Sacred forest walk',
        'Traditional music & dance',
        'Wildlife spotting',
        'Local craft demonstrations'
      ],
      pickupTime: '2:00 PM',
      dropoffTime: '7:00 PM',
      itemsToBring: [
        'Insect repellent',
        'Comfortable shoes',
        'Camera',
        'Light jacket for evening'
      ],
      currency: 'EUR'
    },
    {
      id: 'service_2',
      name: 'Airport Transfer',
      description: 'Professional airport pickup and drop-off service',
      category: 'Transportation',
      duration: 60,
      price: 25,
      maxCapacity: 4,
      isActive: true,
      createdAt: today(),
      currency: 'EUR'
    },
    {
      id: 'service_3',
      name: 'Hotel Booking',
      description: 'Hotel reservation and booking service',
      category: 'Accommodation',
      duration: 30,
      price: 0,
      maxCapacity: 1,
      isActive: true,
      createdAt: today(),
      currency: 'EUR'
    }
  ],
  isLoading: false,
  error: null,
  notifications: [],
  systemSettings: {
    id: "settings_1",
    companyName: "AAT Booking System",
    companyEmail: "info@aatbooking.com",
    companyPhone: "+220 123 4567",
    companyAddress: "Banjul, The Gambia",
    defaultCurrency: "EUR",
    timezone: "GMT",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    emailNotifications: true,
    smsNotifications: false,
    autoConfirmBookings: false,
    requireDeposit: true,
    defaultDepositPercentage: 25,
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    termsAndConditions: "Terms and conditions content...",
    privacyPolicy: "Privacy policy content...",
    theme: "light",
    language: "en",
    autoSyncEnabled: true,
    autoSyncInterval: 5
  },
  rolePermissions: []};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(b => b.id === action.booking.id ? action.booking : b)
      };
    case 'DELETE_BOOKING':
      return { ...state, bookings: state.bookings.filter(b => b.id !== action.id) };
    case 'ADD_SERVICE':
      return { ...state, services: [action.service, ...state.services] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s => s.id === action.service.id ? action.service : s)
      };
    case 'DELETE_SERVICE':
      return { ...state, services: state.services.filter(s => s.id !== action.id) };
    case 'ADD_USER':
      return { ...state, users: [action.user, ...state.users] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.user.id ? action.user : u)
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.id) };
    case 'RESTORE_STATE':
      return action.state;
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount with detailed logging
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      console.log("🔍 Checking localStorage for saved data...");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log("📊 Found saved data:", {
          users: parsedState.users?.length || 0,
          bookings: parsedState.bookings?.length || 0,
          services: parsedState.services?.length || 0
        });
        // Always restore if there is saved data
        if (parsedState && parsedState.users) {
          console.log("✅ Restoring saved state...");
          dispatch({ type: "RESTORE_STATE", state: parsedState });
        } else {
          console.log("⚠️ No valid data to restore");
        }
      } else {
        console.log("❌ No saved data found in localStorage");
      }
    } catch (error) {
      console.error("💥 Error loading state from localStorage:", error);
    }
  }, []);

  // Save state to localStorage whenever it changes with detailed logging
  useEffect(() => {
    try {
      console.log("💾 Saving state to localStorage:", {
        users: state.users.length,
        bookings: state.bookings.length,
        services: state.services.length
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log("✅ State saved successfully");
    } catch (error) {
      console.error("💥 Error saving state to localStorage:", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
