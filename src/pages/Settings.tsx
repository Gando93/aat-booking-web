import { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Building,
  Cloud,
  RefreshCw,
  Wifi,
  WifiOff,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Plus,
  Edit,
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  DollarSign
} from 'lucide-react';
import type { SystemSettings, User, UserRole } from '../types';
import { generateId, today, DEFAULT_ROLE_PERMISSIONS } from '../types';
import { vercelSync, type SyncStatus } from '../services/vercelSync';

export default function Settings() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState('users');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    isAuthorized: false,
    lastSync: null,
    syncInProgress: false,
    error: null
  });
  const [lastSyncResult, setLastSyncResult] = useState<{
    type: 'success' | 'error';
    message: string;
    timestamp: string;
  } | null>(null);

  // User Management State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
    department: '',
    password: '',
    isActive: true
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    id: 'settings_1',
    companyName: 'AAT Booking System',
    companyEmail: 'info@aatbooking.com',
    companyPhone: '+220 123 4567',
    companyAddress: 'Banjul, The Gambia',
    defaultCurrency: 'EUR',
    timezone: 'GMT',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    emailNotifications: true,
    smsNotifications: false,
    autoConfirmBookings: false,
    requireDeposit: true,
    defaultDepositPercentage: 25,
    cancellationPolicy: 'Free cancellation up to 24 hours before the tour',
    termsAndConditions: 'Terms and conditions content...',
    privacyPolicy: 'Privacy policy content...',
    theme: 'light',
    language: 'en',
    autoSyncEnabled: true,
    autoSyncInterval: 5
  });

  // Notifications State
  const [notificationSettings, setNotificationSettings] = useState({
    emailBookingConfirm: true,
    emailBookingReminder: true,
    emailPaymentReceived: true,
    smsBookingConfirm: false,
    smsBookingReminder: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    // Initialize sync status
    vercelSync.getStatus().then(setSyncStatus);
    vercelSync.initialize();
    
    // Listen for sync status changes
    vercelSync.onStatusChange(setSyncStatus);
    
    // Load system settings from state
    if (state.systemSettings) {
      setSystemSettings(state.systemSettings);
    }
  }, [state.systemSettings]);

  const tabs = [
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'company', name: 'Company Settings', icon: Building },
    { id: 'system', name: 'System Settings', icon: SettingsIcon },
    { id: 'sync', name: 'Cloud Sync', icon: Cloud },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'permissions', name: 'Roles & Permissions', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  // User Management Functions
  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: '',
      password: '',
      isActive: true
    });
  };

  const handleAddUser = async () => {
    const newUser: User = {
      id: generateId(),
      ...userFormData,
      createdAt: today(),
      avatar: undefined
    };
    dispatch({ type: 'ADD_USER', user: newUser });
    setShowAddUserModal(false);
    resetUserForm();
    setLastSyncResult({
      type: 'success',
      message: 'User added successfully!',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: '',
      password: '',
      isActive: user.isActive
    });
    setShowAddUserModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    const updatedUser: User = {
      ...editingUser,
      ...userFormData,
    };
    dispatch({ type: 'UPDATE_USER', user: updatedUser });
    setShowAddUserModal(false);
    setEditingUser(null);
    resetUserForm();
    setLastSyncResult({
      type: 'success',
      message: 'User updated successfully!',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDeleteUser = async (userId: string) => {
    dispatch({ type: 'DELETE_USER', id: userId });
    setShowDeleteConfirm(null);
    setLastSyncResult({
      type: 'success',
      message: 'User deleted successfully!',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // System Settings Functions
  const handleSaveSystemSettings = () => {
    dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', settings: systemSettings });
    setLastSyncResult({
      type: 'success',
      message: 'System settings saved successfully!',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // Cloud Sync Functions
  const handleManualSync = async () => {
    try {
      console.log('🚀 Starting manual sync to cloud...');
      setLastSyncResult(null);
      await vercelSync.syncToCloud(state);
      
      setLastSyncResult({
        type: 'success',
        message: `Successfully uploaded ${state.users.length} users, ${state.bookings.length} bookings, and ${state.services.length} services to cloud!`,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error('❌ Manual sync failed:', error);
      setLastSyncResult({
        type: 'error',
        message: `Sync failed: ${(error as Error).message}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const handleSyncFromCloud = async () => {
    try {
      console.log('📥 Starting sync from cloud...');
      setLastSyncResult(null);
      
      const cloudData = await vercelSync.syncFromCloud();
      if (cloudData) {
        let updatedCount = 0;
        if (cloudData.bookings && cloudData.bookings.length > 0) {
          cloudData.bookings.forEach((booking: any) => {
            dispatch({ type: 'UPDATE_BOOKING', booking });
            updatedCount++;
          });
        }
        if (cloudData.services && cloudData.services.length > 0) {
          cloudData.services.forEach((service: any) => {
            dispatch({ type: 'UPDATE_SERVICE', service });
            updatedCount++;
          });
        }
        if (cloudData.users && cloudData.users.length > 0) {
          cloudData.users.forEach((user: any) => {
            dispatch({ type: 'UPDATE_USER', user });
            updatedCount++;
          });
        }
        
        setLastSyncResult({
          type: 'success',
          message: `Successfully downloaded and merged ${updatedCount} items from cloud!`,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        setLastSyncResult({
          type: 'error',
          message: 'No cloud data found or failed to retrieve data.',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error('❌ Sync from cloud failed:', error);
      setLastSyncResult({
        type: 'error',
        message: `Download failed: ${(error as Error).message}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const handleClearCloudData = async () => {
    if (confirm('Are you sure you want to clear all cloud data? This cannot be undone.')) {
      try {
        await vercelSync.clearCloudData();
        setLastSyncResult({
          type: 'success',
          message: 'Cloud data cleared successfully!',
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        setLastSyncResult({
          type: 'error',
          message: `Clear failed: ${(error as Error).message}`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  // Render Functions
  const renderUsersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.id !== 'admin_1' && (
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderCompanyTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Company Settings</h3>
        <p className="text-sm text-gray-600">Manage your company information and branding</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              value={systemSettings.companyName}
              onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Company Email
            </label>
            <input
              type="email"
              value={systemSettings.companyEmail}
              onChange={(e) => setSystemSettings({...systemSettings, companyEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Company Phone
            </label>
            <input
              type="tel"
              value={systemSettings.companyPhone}
              onChange={(e) => setSystemSettings({...systemSettings, companyPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Default Currency
            </label>
            <select
              value={systemSettings.defaultCurrency}
              onChange={(e) => setSystemSettings({...systemSettings, defaultCurrency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="GMD">Gambian Dalasi (GMD)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Company Address
          </label>
          <textarea
            value={systemSettings.companyAddress}
            onChange={(e) => setSystemSettings({...systemSettings, companyAddress: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveSystemSettings}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Company Settings
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSystemTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
        <p className="text-sm text-gray-600">Configure system behavior and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Timezone
            </label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GMT">GMT (Greenwich Mean Time)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="CET">CET (Central European Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Time Format
            </label>
            <select
              value={systemSettings.timeFormat}
              onChange={(e) => setSystemSettings({...systemSettings, timeFormat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="12h">12 Hour (AM/PM)</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Booking Settings</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-confirm bookings</label>
              <p className="text-xs text-gray-500">Automatically confirm new bookings</p>
            </div>
            <input
              type="checkbox"
              checked={systemSettings.autoConfirmBookings}
              onChange={(e) => setSystemSettings({...systemSettings, autoConfirmBookings: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require deposit</label>
              <p className="text-xs text-gray-500">Require deposit for all bookings</p>
            </div>
            <input
              type="checkbox"
              checked={systemSettings.requireDeposit}
              onChange={(e) => setSystemSettings({...systemSettings, requireDeposit: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {systemSettings.requireDeposit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Deposit Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={systemSettings.defaultDepositPercentage}
                onChange={(e) => setSystemSettings({...systemSettings, defaultDepositPercentage: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveSystemSettings}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save System Settings
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <p className="text-sm text-gray-600">Configure how and when you receive notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Email Notifications</h4>
            <div className="space-y-4">
              {Object.entries({
                emailBookingConfirm: 'Booking confirmations',
                emailBookingReminder: 'Booking reminders',
                emailPaymentReceived: 'Payment received',
                marketingEmails: 'Marketing emails'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <p className="text-xs text-gray-500">Receive {label.toLowerCase()} via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [key]: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">SMS Notifications</h4>
            <div className="space-y-4">
              {Object.entries({
                smsBookingConfirm: 'Booking confirmations',
                smsBookingReminder: 'Booking reminders'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <p className="text-xs text-gray-500">Receive {label.toLowerCase()} via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [key]: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Push Notifications</h4>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Browser notifications</label>
                <p className="text-xs text-gray-500">Receive push notifications in your browser</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  pushNotifications: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setLastSyncResult({
              type: 'success',
              message: 'Notification settings saved successfully!',
              timestamp: new Date().toLocaleTimeString()
            })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPermissionsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
        <p className="text-sm text-gray-600">Manage user roles and their permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DEFAULT_ROLE_PERMISSIONS.map((rolePermission) => (
          <motion.div
            key={rolePermission.role}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`text-lg font-semibold capitalize ${getRoleColor(rolePermission.role)} px-3 py-1 rounded-full inline-block`}>
                  {rolePermission.role}
                </h4>
                <p className="text-sm text-gray-600 mt-2">{rolePermission.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {rolePermission.permissions.map((permission) => (
                <div key={permission.module} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-sm text-gray-900 capitalize mb-2">
                    {permission.module}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {permission.actions.map((action) => (
                      <span
                        key={action}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderAppearanceTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
        <p className="text-sm text-gray-600">Customize the look and feel of your dashboard</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', preview: 'bg-white border-2' },
                { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-2' },
                { value: 'auto', label: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' }
              ].map((theme) => (
                <label key={theme.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={systemSettings.theme === theme.value}
                    onChange={(e) => setSystemSettings({...systemSettings, theme: e.target.value as any})}
                    className="sr-only"
                  />
                  <div className={`
                    ${theme.preview} 
                    ${systemSettings.theme === theme.value ? 'border-blue-500' : 'border-gray-300'} 
                    rounded-lg p-4 text-center transition-all hover:border-blue-300
                  `}>
                    <div className="text-sm font-medium text-gray-900">{theme.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Accent Color</label>
            <div className="grid grid-cols-6 gap-3">
              {[
                'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
                'bg-red-500', 'bg-orange-500', 'bg-pink-500'
              ].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full ${color} hover:scale-110 transition-transform`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Sidebar Style</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="sidebar" className="mr-3" defaultChecked />
                <span className="text-sm">Expanded (default)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="sidebar" className="mr-3" />
                <span className="text-sm">Collapsed</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="sidebar" className="mr-3" />
                <span className="text-sm">Auto-hide</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setLastSyncResult({
              type: 'success',
              message: 'Appearance settings saved successfully!',
              timestamp: new Date().toLocaleTimeString()
            })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Appearance Settings
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSyncTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Cloud Sync</h3>
        <p className="text-sm text-gray-600">Sync your data across devices using Vercel storage</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Connection Status */}
        <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {syncStatus.isConnected && syncStatus.isAuthorized ? (
                <Wifi className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className="font-medium">
                {syncStatus.isConnected && syncStatus.isAuthorized ? 'Connected to Vercel Storage' : 'Not Connected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {syncStatus.syncInProgress && (
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              )}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                syncStatus.isConnected && syncStatus.isAuthorized
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {syncStatus.isConnected && syncStatus.isAuthorized ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {syncStatus.lastSync && (
            <p className="text-sm text-gray-600 mb-2">
              Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
            </p>
          )}
          
          {syncStatus.error && (
            <p className="text-sm text-red-600 mb-2">
              Error: {syncStatus.error}
            </p>
          )}
        </div>

        {/* Last Sync Result */}
        <AnimatePresence>
          {lastSyncResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg border-2 ${
                lastSyncResult.type === 'success' 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start">
                {lastSyncResult.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    lastSyncResult.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastSyncResult.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {lastSyncResult.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Data Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📊 Current Data:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{state.users.length}</div>
              <div className="text-blue-800">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{state.bookings.length}</div>
              <div className="text-blue-800">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{state.services.length}</div>
              <div className="text-blue-800">Services</div>
            </div>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="space-y-4">
          <div className="flex space-x-3 flex-wrap gap-2">
            <motion.button
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4 mr-2" />
              {syncStatus.syncInProgress ? 'Uploading...' : 'Upload to Cloud'}
            </motion.button>
            
            <motion.button
              onClick={handleSyncFromCloud}
              disabled={syncStatus.syncInProgress}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 mr-2" />
              {syncStatus.syncInProgress ? 'Downloading...' : 'Download from Cloud'}
            </motion.button>

            <motion.button
              onClick={handleClearCloudData}
              disabled={syncStatus.syncInProgress}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cloud Data
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your system configuration and preferences</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'users' && renderUsersTab()}
              {activeTab === 'company' && renderCompanyTab()}
              {activeTab === 'system' && renderSystemTab()}
              {activeTab === 'sync' && renderSyncTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'permissions' && renderPermissionsTab()}
              {activeTab === 'appearance' && renderAppearanceTab()}
            </AnimatePresence>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        <AnimatePresence>
          {showAddUserModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                      resetUserForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userFormData.phone}
                      onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userFormData.password}
                          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={userFormData.isActive}
                      onChange={(e) => setUserFormData({ ...userFormData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active User
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                      resetUserForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="button"
                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete User
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
