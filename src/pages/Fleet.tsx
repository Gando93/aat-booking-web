import React, { useState } from 'react';
import { FleetProvider, useFleet } from '../state/fleet/FleetContext';
import FleetKpis from '../components/fleet/FleetKpis';
import VehicleCard from '../components/fleet/VehicleCard';
import { Vehicle } from '../types/fleet';
import { Plus, Grid, Calendar as CalendarIcon } from 'lucide-react';

function FleetContent() {
  const { state } = useFleet();
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar'>('overview');

  const handleViewVehicle = (vehicle: Vehicle) => {
    console.log('View vehicle:', vehicle);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    console.log('Edit vehicle:', vehicle);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    console.log('Delete vehicle:', vehicle);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle fleet, assignments, and maintenance</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* KPIs */}
      <FleetKpis />

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Grid className="h-4 w-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'calendar'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Calendar</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div>
          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onView={handleViewVehicle}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>

          {/* Empty State */}
          {state.vehicles.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first vehicle to the fleet.</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Add Vehicle
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
          <p className="text-gray-500">Fleet calendar view coming soon...</p>
        </div>
      )}
    </div>
  );
}

export default function Fleet() {
  return (
    <FleetProvider>
      <FleetContent />
    </FleetProvider>
  );
}
