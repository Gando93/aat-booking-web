import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppState } from './context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Fleet from './pages/Fleet';
import Login from './pages/Login';

function AppContent() {
  const { state } = useAppState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  if (!state.user) {
    return <Login />;
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-900 font-medium capitalize">
                {location.pathname.slice(1) || 'Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Online
              </div>
            </div>
          </div>
          {/* Visible build banner for deployment verification */}
          <div className="mt-3 rounded-lg bg-gradient-to-r from-blue-500/10 via-fuchsia-500/10 to-emerald-500/10 border border-blue-200/40 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>Build deployed</span>
              <span>{new Date().toISOString()}</span>
            </div>
          </div>
        </div>

        {/* Page content with animations */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ type: "tween", ease: "anticipate", duration: 0.3 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/fleet" element={<Fleet />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
