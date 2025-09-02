import { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction } from '../types';
import { today } from '../types';

const STORAGE_KEY = 'aat-booking-state';

// Initial state with all 10 excursions
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
      name: 'Senegal Safari',
      description: 'Cross-border safari to Fathala Reserve with wildlife viewing',
      category: 'Wildlife Tours',
      duration: 480,
      price: 95,
      maxCapacity: 10,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Ferry to Barra',
        'Cross into Senegal',
        'Safari in Fathala Reserve (4x4 jeep)'
      ],
      pickupTime: '6:00 AM',
      dropoffTime: '6:00 PM',
      itemsToBring: [
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
      name: 'Jungle & Baobab Island',
      description: 'Nature walk through jungle to mystical Baobab Island',
      category: 'Nature Tours',
      duration: 300,
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
      pickupTime: '9:00 AM',
      dropoffTime: '2:00 PM',
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
      name: 'Casamance Adventure',
      description: 'Cross-border adventure to Casamance region of Senegal',
      category: 'Nature Tours',
      duration: 480,
      price: 85,
      maxCapacity: 10,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Cross border to Casamance',
        'Boat ride past Bird Island',
        'Kailo Island voodoo culture',
        'Lunch in Abene'
      ],
      pickupTime: '6:30 AM',
      dropoffTime: '6:30 PM',
      itemsToBring: [
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
      name: 'Mangrove Pirogue Cruise',
      description: 'Relaxing boat cruise through mangrove channels',
      category: 'Water Tours',
      duration: 240,
      price: 45,
      maxCapacity: 15,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Pirogue cruise through mangroves',
        'Stops for swimming and fishing',
        'Full onboard lunch'
      ],
      pickupTime: '10:00 AM',
      dropoffTime: '2:00 PM',
      itemsToBring: [
        'Swimwear & towel',
        'Sunscreen',
        'Hat',
        'Relaxation mode 😌',
        'From Jan - March: Sweater for early morning'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_8',
      name: 'Roots Heritage Tour',
      description: 'Historical tour following the "Roots" trail to Juffureh',
      category: 'Cultural Tours',
      duration: 360,
      price: 65,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Ferry to Barra',
        'Albreda & Juffureh villages',
        'Visit St. James Island',
        '"Roots" history tour'
      ],
      pickupTime: '8:00 AM',
      dropoffTime: '2:00 PM',
      itemsToBring: [
        'Camera',
        'Sunscreen',
        'Walking shoes',
        'Curiosity about history',
        'From Jan - March: a Sweater for early morning'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_9',
      name: 'Bird Watching Tour',
      description: 'Early morning bird watching in the mangroves',
      category: 'Wildlife Tours',
      duration: 180,
      price: 35,
      maxCapacity: 8,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Early morning creek tour',
        'Guided bird spotting',
        'Picnic breakfast'
      ],
      pickupTime: '6:30 AM',
      dropoffTime: '9:30 AM',
      itemsToBring: [
        'Binoculars',
        'Hat & sunglasses',
        'Light clothing',
        'Water'
      ],
      currency: 'EUR'
    },
    {
      id: 'excursion_10',
      name: 'Historical Sites Tour',
      description: 'Tour of important historical sites and monuments',
      category: 'Historical Tours',
      duration: 300,
      price: 50,
      maxCapacity: 12,
      isActive: true,
      createdAt: today(),
      highlights: [
        'Nature walk through the reserve',
        'Wildlife rescue center',
        'Lunch at Lamin Lodge'
      ],
      pickupTime: '9:00 AM',
      dropoffTime: '2:00 PM',
      itemsToBring: [
        'Sturdy shoes',
        'Insect repellent',
        'Water bottle',
        'Camera'
      ],
      currency: 'EUR'
    },
    {
      id: 'service_2',
      name: 'Airport Transfer',
      description: 'Private airport transfer service',
      category: 'Transportation',
      duration: 60,
      price: 30,
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
};

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
      return { ...state, bookings: [...state.bookings, action.booking] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.booking.id ? action.booking : booking
        ),
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.id),
      };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.service] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.service.id ? service : service
        ),
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.id),
      };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.user] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.user.id ? action.user : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.id),
      };
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

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'RESTORE_STATE', state: parsedState });
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
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
