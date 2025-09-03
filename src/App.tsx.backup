import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Settings from './pages/Settings';
import { Menu } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 lg:hidden"
              >
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="relative w-80 h-full"
                >
                  <Sidebar onClose={() => setSidebarOpen(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop sidebar */}
          <motion.div 
            className="hidden lg:flex flex-shrink-0"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Sidebar onClose={() => {}} />
          </motion.div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile header */}
            <motion.div 
              className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3"
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Menu className="w-6 h-6 text-gray-600" />
                  </motion.button>
                  <h1 className="text-xl font-semibold text-gray-900">AAT Booking</h1>
                </div>
              </div>
            </motion.div>

            {/* Page content */}
            <motion.main 
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  } />
                  <Route path="/bookings" element={
                    <motion.div
                      key="bookings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Bookings />
                    </motion.div>
                  } />
                  <Route path="/services" element={
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Services />
                    </motion.div>
                  } />
                  <Route path="/settings" element={
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Settings />
                    </motion.div>
                  } />
                  <Route path="/users" element={
                    <motion.div
                      key="users"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                          <p className="text-gray-600">User management is available in the Settings page.</p>
                          <motion.button
                            onClick={() => window.location.href = '/settings'}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Go to Settings
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  } />
                </Routes>
              </AnimatePresence>
            </motion.main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
