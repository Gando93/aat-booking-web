import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Plus, Edit, Trash2, Settings, Star } from 'lucide-react';
import type { Service } from '../types';
import { generateId, today, formatCurrency } from '../types';

export default function Services() {
  const { state, dispatch } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: 60,
    price: 0,
    maxCapacity: 1,
    isActive: true,
    highlights: [] as string[],
    pickupTime: '',
    dropoffTime: '',
    itemsToBring: [] as string[],
    currency: 'EUR',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      duration: 60,
      price: 0,
      maxCapacity: 1,
      isActive: true,
      highlights: [],
      pickupTime: '',
      dropoffTime: '',
      itemsToBring: [],
      currency: 'EUR',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      const updatedService: Service = {
        ...editingService,
        ...formData,
      };
      dispatch({ type: 'UPDATE_SERVICE', service: updatedService });
    } else {
      const newService: Service = {
        id: generateId('service'),
        ...formData,
        createdAt: today(),
      };
      dispatch({ type: 'ADD_SERVICE', service: newService });
    }
    
    resetForm();
    setShowAddModal(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      maxCapacity: service.maxCapacity,
      isActive: service.isActive,
      highlights: service.highlights || [],
      pickupTime: service.pickupTime || '',
      dropoffTime: service.dropoffTime || '',
      itemsToBring: service.itemsToBring || [],
      currency: service.currency || 'EUR',
    });
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      dispatch({ type: 'DELETE_SERVICE', id });
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(state.services.map(service => service.category)));

  // Group services by category
  const servicesByCategory = state.services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof state.services>);

  // Filter categories if needed
  const filteredCategories = categoryFilter === 'all' 
    ? Object.keys(servicesByCategory)
    : [categoryFilter].filter(cat => servicesByCategory[cat]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your available services and packages</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Service
          </button>
        </div>
      </div>

      {/* Categorized Services */}
      {filteredCategories.map((category) => {
        const services = servicesByCategory[category];
        return (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
              {services.length} service{services.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-gray-400 hover:text-primary-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-900">
                      {service.duration >= 1440 
                        ? `${Math.round(service.duration / 1440)} day${Math.round(service.duration / 1440) > 1 ? 's' : ''}`
                        : service.duration >= 60 
                        ? `${Math.round(service.duration / 60)} hour${Math.round(service.duration / 60) > 1 ? 's' : ''}`
                        : `${service.duration} minutes`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="text-gray-900 font-semibold text-primary-600">
                      {formatCurrency(service.price, service.currency || 'EUR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Capacity:</span>
                    <span className="text-gray-900">{service.maxCapacity} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {service.highlights && service.highlights.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Highlights:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {service.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="w-3 h-3 text-yellow-400 mr-1 mt-0.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                        {service.highlights.length > 3 && (
                          <li className="text-gray-400">+{service.highlights.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {service.pickupTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pickup:</span>
                      <span className="text-gray-900">{service.pickupTime}</span>
                    </div>
                  )}
                  {service.dropoffTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dropoff:</span>
                      <span className="text-gray-900">{service.dropoffTime}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (€) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 8:30 AM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 5:30 PM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.dropoffTime}
                      onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter highlights, one per line"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.highlights.join('\n')}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items to Bring (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter items, one per line"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.itemsToBring.join('\n')}
                    onChange={(e) => setFormData({ ...formData, itemsToBring: e.target.value.split('\n').filter(i => i.trim()) })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingService ? 'Update' : 'Create'} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
