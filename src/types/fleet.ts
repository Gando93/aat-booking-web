export interface Vehicle {
  id: string;
  name: string;
  type: 'bus' | 'van' | 'car' | 'boat';
  capacity: number;
  status: 'available' | 'assigned' | 'maintenance' | 'offline';
  odometer: number;
  fuelLevel: number;
  nextServiceAt: string;
  licensePlate: string;
  year: number;
  make: string;
  model: string;
  color: string;
  qrCode?: string;
  documents?: string[];
  notes?: string;
}

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  bookingId: string;
  startTime: string;
  endTime: string;
  driverId?: string;
  route?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: 'service' | 'repair' | 'inspection' | 'cleaning';
  date: string;
  mileage: number;
  cost: number;
  description: string;
  performedBy: string;
  nextDue?: string;
  documents?: string[];
}

export interface FleetState {
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
  maintenanceLogs: MaintenanceLog[];
  loading: boolean;
  error: string | null;
}
