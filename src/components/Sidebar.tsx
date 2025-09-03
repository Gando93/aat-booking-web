import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  X,
  User,
  Bell,
  LogOut,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Truck
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

// Notification component
function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const notifications = [
    { id: 1, title: 'New booking received', message: 'John Doe booked City Tour', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment confirmed', message: 'Payment of €150 confirmed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Service updated', message: 'Airport Transfer pricing updated', time: '3 hours ago', unread: false },
    { id: 4, title: 'System backup', message: 'Daily backup completed successfully', time: '1 day ago', unread: false },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
              notification.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.unread ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
}

// Profile dropdown component
function ProfileDropdown({ isOpen }: { isOpen: boolean }) {
  const { state, dispatch } = useAppState();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{state.user?.name}</p>
            <p className="text-sm text-gray-500">{state.user?.email}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </button>
        <hr className="my-2" />
        <button 
          onClick={() => dispatch({ type: 'SET_USER', user: null })}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { state } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Fleet', href: '/fleet', icon: Truck, roles: ['admin', 'manager', 'staff'] },
    { name: 'Users', href: '/users', icon: Users },
  ];

  const unreadCount = 2; // This would come from your notification state

  return (
    <motion.div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      animate={{ width: collapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AAT</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AAT Booking</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const userRole = state.user?.role || 'staff';
          
          // Check role-based visibility
          if (item.roles && !item.roles.includes(userRole)) {
            return null;
          }
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bookings</span>
                <span className="text-sm font-semibold text-blue-600">
                  {state.bookings.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Users</span>
                <span className="text-sm font-semibold text-purple-600">
                  {state.users.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">
                  {state.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {state.user?.email}
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp className="h-4 w-4 text-gray-600" />
              </button>
              <ProfileDropdown
                isOpen={showProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
