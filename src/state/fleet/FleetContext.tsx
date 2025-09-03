import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Vehicle, VehicleAssignment, MaintenanceLog, FleetState } from '../../types/fleet';

// Mock data for development
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tour Bus Alpha',
    type: 'bus',
    capacity: 50,
    status: 'available',
    odometer: 125000,
    fuelLevel: 85,
    nextServiceAt: '2024-01-15',
    licensePlate: 'ABC-123',
    year: 2020,
    make: 'Mercedes',
    model: 'Tourismo',
    color: 'White',
    qrCode: 'QR-ALPHA-001',
    documents: ['insurance.pdf', 'registration.pdf'],
    notes: 'Excellent condition, recently serviced'
  },
  {
    id: '2',
    name: 'Van Beta',
    type: 'van',
    capacity: 12,
    status: 'assigned',
    odometer: 89000,
    fuelLevel: 60,
    nextServiceAt: '2024-01-20',
    licensePlate: 'DEF-456',
    year: 2021,
    make: 'Ford',
    model: 'Transit',
    color: 'Blue',
    qrCode: 'QR-BETA-002',
    documents: ['insurance.pdf', 'registration.pdf'],
    notes: 'Currently assigned to City Tour'
  },
  {
    id: '3',
    name: 'Car Gamma',
    type: 'car',
    capacity: 4,
    status: 'maintenance',
    odometer: 45000,
    fuelLevel: 30,
    nextServiceAt: '2024-01-10',
    licensePlate: 'GHI-789',
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    qrCode: 'QR-GAMMA-003',
    documents: ['insurance.pdf', 'registration.pdf'],
    notes: 'In for routine maintenance'
  }
];

const mockAssignments: VehicleAssignment[] = [
  {
    id: '1',
    vehicleId: '2',
    bookingId: 'booking-1',
    startTime: '2024-01-08T09:00:00Z',
    endTime: '2024-01-08T17:00:00Z',
    driverId: 'driver-1',
    route: 'City Center → Airport → Hotel District',
    status: 'scheduled',
    notes: 'Full day city tour'
  }
];

const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'service',
    date: '2024-01-01',
    mileage: 124500,
    cost: 450,
    description: 'Regular 6-month service',
    performedBy: 'AutoCare Center',
    nextDue: '2024-07-01',
    documents: ['service-report.pdf']
  }
];

type FleetAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VEHICLES'; payload: Vehicle[] }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'SET_ASSIGNMENTS'; payload: VehicleAssignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: VehicleAssignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: VehicleAssignment }
  | { type: 'SET_MAINTENANCE_LOGS'; payload: MaintenanceLog[] }
  | { type: 'ADD_MAINTENANCE_LOG'; payload: MaintenanceLog };

const initialState: FleetState = {
  vehicles: mockVehicles,
  assignments: mockAssignments,
  maintenanceLogs: mockMaintenanceLogs,
  loading: false,
  error: null
};

function fleetReducer(state: FleetState, action: FleetAction): FleetState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v)
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(v => v.id !== action.payload)
      };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'SET_MAINTENANCE_LOGS':
      return { ...state, maintenanceLogs: action.payload };
    case 'ADD_MAINTENANCE_LOG':
      return { ...state, maintenanceLogs: [...state.maintenanceLogs, action.payload] };
    default:
      return state;
  }
}

const FleetContext = createContext<{
  state: FleetState;
  dispatch: React.Dispatch<FleetAction>;
} | null>(null);

export function FleetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fleetReducer, initialState);

  return (
    <FleetContext.Provider value={{ state, dispatch }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}
