import React from 'react';
import { useFleet } from '../../state/fleet/FleetContext';
import KpiCard from '../ui/KpiCard';
import { Truck, Wrench, Fuel, Calendar } from 'lucide-react';

export default function FleetKpis() {
  const { state } = useFleet();
  
  const totalVehicles = state.vehicles.length;
  const availableVehicles = state.vehicles.filter(v => v.status === 'available').length;
  const maintenanceVehicles = state.vehicles.filter(v => v.status === 'maintenance').length;
  const upcomingServices = state.vehicles.filter(v => 
    new Date(v.nextServiceAt) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Mock sparkline data
  const vehicleUtilizationData = [65, 70, 68, 75, 80, 78, 82];
  const maintenanceData = [2, 1, 3, 2, 1, 2, 1];
  const fuelEfficiencyData = [8.5, 8.2, 8.8, 8.1, 8.9, 8.3, 8.7];
  const serviceData = [3, 2, 4, 3, 2, 3, 2];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard
        title="Total Vehicles"
        value={totalVehicles}
        change={5.2}
        changeLabel="vs last month"
        icon={Truck}
        sparklineData={vehicleUtilizationData}
        sparklineColor="#3b82f6"
      />
      <KpiCard
        title="Available"
        value={availableVehicles}
        change={-2.1}
        changeLabel="vs last week"
        icon={Truck}
        sparklineData={maintenanceData}
        sparklineColor="#10b981"
      />
      <KpiCard
        title="In Maintenance"
        value={maintenanceVehicles}
        change={1.5}
        changeLabel="vs last week"
        icon={Wrench}
        sparklineData={maintenanceData}
        sparklineColor="#f59e0b"
      />
      <KpiCard
        title="Upcoming Services"
        value={upcomingServices}
        change={-0.8}
        changeLabel="this week"
        icon={Calendar}
        sparklineData={serviceData}
        sparklineColor="#ef4444"
      />
    </div>
  );
}
