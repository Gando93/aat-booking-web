import { useState, useEffect } from 'react';
import type { Vehicle } from '../../types/fleet';
import { X, Save, Truck } from 'lucide-react';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

export default function VehicleForm({ vehicle, isOpen, onClose, onSave }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    capacity: 4,
    odometer: 0,
    fuelLevel: 100,
    status: 'available' as Vehicle['status'],
    nextServiceAt: new Date().toISOString().split('T')[0],
    notes: '',
    qrCode: '',
    documents: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        capacity: vehicle.capacity,
        odometer: vehicle.odometer,
        fuelLevel: vehicle.fuelLevel,
        status: vehicle.status,
        nextServiceAt: vehicle.nextServiceAt.split('T')[0],
        notes: vehicle.notes || '',
        qrCode: vehicle.qrCode || '',
        documents: vehicle.documents || []
      });
    } else {
      setFormData({
        name: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        capacity: 4,
        odometer: 0,
        fuelLevel: 100,
        status: 'available',
        nextServiceAt: new Date().toISOString().split('T')[0],
        notes: '',
        qrCode: '',
        documents: []
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.odometer < 0) newErrors.odometer = 'Odometer cannot be negative';
    if (formData.fuelLevel < 0 || formData.fuelLevel > 100) newErrors.fuelLevel = 'Fuel level must be between 0-100%';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Invalid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const vehicleData: Vehicle = {
      id: vehicle?.id || `vehicle-${Date.now()}`,
      name: formData.name.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: formData.year,
      licensePlate: formData.licensePlate.trim(),
      capacity: formData.capacity,
      odometer: formData.odometer,
      fuelLevel: formData.fuelLevel,
      status: formData.status,
      nextServiceAt: new Date(formData.nextServiceAt).toISOString(),
      notes: formData.notes.trim() || undefined,
      qrCode: formData.qrCode.trim() || undefined,
      documents: formData.documents.length > 0 ? formData.documents : undefined
    };

    onSave(vehicleData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">
                  {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <p className="text-sm text-gray-500">
                  {vehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Bus #1, Van Alpha"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.licensePlate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., ABC-123"
                  />
                  {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.make ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Mercedes, Ford"
                  />
                  {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Sprinter, Transit"
                  />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                    max="50"
                  />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Vehicle['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextServiceAt}
                    onChange={(e) => handleInputChange('nextServiceAt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={formData.odometer}
                    onChange={(e) => handleInputChange('odometer', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.odometer ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                  />
                  {errors.odometer && <p className="text-red-500 text-xs mt-1">{errors.odometer}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Level (%)
                  </label>
                  <input
                    type="number"
                    value={formData.fuelLevel}
                    onChange={(e) => handleInputChange('fuelLevel', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fuelLevel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                    max="100"
                  />
                  {errors.fuelLevel && <p className="text-red-500 text-xs mt-1">{errors.fuelLevel}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about this vehicle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code
                </label>
                <input
                  type="text"
                  value={formData.qrCode}
                  onChange={(e) => handleInputChange('qrCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="QR code identifier (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{vehicle ? 'Update Vehicle' : 'Add Vehicle'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
