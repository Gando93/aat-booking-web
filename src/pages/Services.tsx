import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Clock, Users, MapPin, Camera, Upload } from 'lucide-react';
import type { Service } from '../types';
import { generateId, today, formatCurrency } from '../types';

export default function Services() {
  const { state, dispatch } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Tours', 'Transportation', 'Accommodation']));
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
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
    thumbnail: '',
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
      thumbnail: '',
    });
  };

  // Map normalized categories back to specific categories
  const getSpecificCategory = (category: string, serviceName: string) => {
    if (category === "Tours") {
      if (serviceName.toLowerCase().includes("adventure") || serviceName.toLowerCase().includes("4-wheel")) return "Adventure Tours";
      if (serviceName.toLowerCase().includes("senegal") || serviceName.toLowerCase().includes("cultural") || serviceName.toLowerCase().includes("explore")) return "Cultural Tours";
      if (serviceName.toLowerCase().includes("wildlife") || serviceName.toLowerCase().includes("safari") || serviceName.toLowerCase().includes("fathala")) return "Wildlife Tours";
      if (serviceName.toLowerCase().includes("river") || serviceName.toLowerCase().includes("water") || serviceName.toLowerCase().includes("boat") || serviceName.toLowerCase().includes("pirogue")) return "Water Tours";
      if (serviceName.toLowerCase().includes("historical") || serviceName.toLowerCase().includes("roots") || serviceName.toLowerCase().includes("kunta") || serviceName.toLowerCase().includes("jufureh")) return "Historical Tours";
      if (serviceName.toLowerCase().includes("nature") || serviceName.toLowerCase().includes("forest") || serviceName.toLowerCase().includes("baobab") || serviceName.toLowerCase().includes("makasutu")) return "Nature Tours";
      if (serviceName.toLowerCase().includes("2-day") || serviceName.toLowerCase().includes("multi")) return "Multi-Day Tours";
      return "Day Tours";
    }
    if (category === "Transportation") return "Airport Transfer";
    if (category === "Accommodation") return "Hotel Booking";
    return category;
  };

  // Map detailed category to normalized category for editing
  const getNormalizedCategory = (category: string) => {
    if (category.includes("Tours")) return "Tours";
    if (category === "Airport Transfer") return "Transportation";
    if (category === "Hotel Booking") return "Accommodation";
    return category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const specificCategory = getSpecificCategory(formData.category, formData.name);
    
    if (editingService) {
      const updatedService: Service = {
        ...editingService,
        ...formData,
        category: specificCategory,
        updatedAt: today(),
      };
      dispatch({ type: 'UPDATE_SERVICE', service: updatedService });
    } else {
      const newService: Service = {
        id: generateId(),
        ...formData,
        category: specificCategory,
        createdAt: today(),
        updatedAt: today(),
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
      category: getNormalizedCategory(service.category),
      duration: service.duration,
      price: service.price,
      maxCapacity: service.maxCapacity,
      isActive: service.isActive,
      highlights: service.highlights || [],
      pickupTime: service.pickupTime || '',
      dropoffTime: service.dropoffTime || '',
      itemsToBring: service.itemsToBring || [],
      currency: service.currency || 'EUR',
      thumbnail: service.thumbnail || '',
    });
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      dispatch({ type: 'DELETE_SERVICE', id });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, thumbnail: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleServiceExpansion = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  // Group services by category
  const servicesByCategory = state.services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Category mappings for consistent naming
  const categoryMappings: Record<string, string> = {
    'Day Tours': 'Tours',
    'Multi-Day Tours': 'Tours',
    'Adventure Tours': 'Tours',
    'Cultural Tours': 'Tours',
    'Wildlife Tours': 'Tours',
    'Nature Tours': 'Tours',
    'Water Tours': 'Tours',
    'Historical Tours': 'Tours',
    'Airport Transfer': 'Transportation',
    'Hotel Booking': 'Accommodation',
  };

  // Normalize categories
  const normalizedServicesByCategory: Record<string, Service[]> = {};
  Object.entries(servicesByCategory).forEach(([originalCategory, services]) => {
    const normalizedCategory = categoryMappings[originalCategory] || originalCategory;
    if (!normalizedServicesByCategory[normalizedCategory]) {
      normalizedServicesByCategory[normalizedCategory] = [];
    }
    normalizedServicesByCategory[normalizedCategory].push(...services);
  });

  const categories = Object.keys(normalizedServicesByCategory).sort();

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your tours, transfers, and accommodation services</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>

        {/* Services by Category */}
        <div className="space-y-4 sm:space-y-6">
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategoryExpansion(category)}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{category}</h2>
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {normalizedServicesByCategory[category].length}
                  </span>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Category Content */}
              {expandedCategories.has(category) && (
                <div className="border-t border-gray-200 p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {normalizedServicesByCategory[category].map((service) => (
                      <div key={service.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Service Image */}
                        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-xl overflow-hidden">
                          {service.thumbnail ? (
                            <img
                              src={service.thumbnail}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-white/70" />
                            </div>
                          )}
                          
                          {/* Action Buttons Overlay */}
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                            </button>
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              service.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        {/* Service Content */}
                        <div className="p-4">
                          {/* Title and Category */}
                          <div className="mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
                              {service.name}
                            </h3>
                            <p className="text-xs text-gray-500">{service.category}</p>
                          </div>

                          {/* Price and Details */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              {formatCurrency(service.price, service.currency || 'EUR')}
                            </span>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.duration}min
                              </div>
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {service.maxCapacity}
                              </div>
                            </div>
                          </div>

                          {/* Pickup Time */}
                          {service.pickupTime && (
                            <div className="flex items-center text-xs text-gray-600 mb-3">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">Pickup: {service.pickupTime}</span>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                            {service.description}
                          </p>

                          {/* Show Details Button */}
                          <button
                            onClick={() => toggleServiceExpansion(service.id)}
                            className="w-full text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center py-2 border-t border-gray-100"
                          >
                            {expandedServices.has(service.id) ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show Details
                              </>
                            )}
                          </button>

                          {/* Expanded Details */}
                          {expandedServices.has(service.id) && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                              {service.highlights && service.highlights.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900 mb-2">Highlights</h4>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {service.highlights.map((highlight, index) => (
                                      <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-0.5">•</span>
                                        <span className="flex-1">{highlight}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {service.itemsToBring && service.itemsToBring.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900 mb-2">Items to Bring</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {service.itemsToBring.map((item, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(service.pickupTime || service.dropoffTime) && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900 mb-2">Schedule</h4>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    {service.pickupTime && <div>Pickup: {service.pickupTime}</div>}
                                    {service.dropoffTime && <div>Dropoff: {service.dropoffTime}</div>}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-6 h-6 transform rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {formData.thumbnail ? (
                          <img
                            src={formData.thumbnail}
                            alt="Service preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Tours">Tours</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Accommodation">Accommodation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (EUR)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        min="1"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Service
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                      <input
                        type="text"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        placeholder="e.g., 8:30 AM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Time</label>
                      <input
                        type="text"
                        value={formData.dropoffTime}
                        onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                        placeholder="e.g., 2:30 PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingService(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      {editingService ? 'Update Service' : 'Add Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
