import { useState, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign,
  Activity,
  Plus,
  X,
  TrendingUp,
  Star,
  ArrowRight,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { formatCurrency } from '../types';

const ResponsiveGridLayout = WidthProvider(Responsive);
const localizer = momentLocalizer(moment);

interface WidgetData {
  i: string;
  title: string;
  component: string;
  w: number;
  h: number;
  x: number;
  y: number;
  minW: number;
  minH: number;
}

// Clean, simple widget wrapper
function Widget({ title, children, onRemove, id }: { title: string; children: React.ReactNode; onRemove?: (id: string) => void; id: string }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          {onRemove && (
            <button
              onClick={() => onRemove(id)}
              className="p-1 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      )}
      <div className="p-4 h-full overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// Stat widget with clean design
function StatWidget({ title, value, change, icon: Icon, trend, color }: any) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            +{change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

// Calendar widget
function CalendarWidget() {
  const { state } = useAppState();
  
  const events = useMemo(() => {
    return state.bookings.map(booking => ({
      id: booking.id,
      title: `${booking.guestName} - ${booking.serviceName}`,
      start: new Date(booking.createdAt),
      end: new Date(new Date(booking.createdAt).getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
      resource: booking,
    }));
  }, [state.bookings]);

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        defaultView="month"
        eventPropGetter={(_event: any) => ({
          style: {
            backgroundColor: '#3b82f6',
            borderRadius: '6px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            fontSize: '12px'
          }
        })}
        dayPropGetter={(date: any) => ({
          style: {
            backgroundColor: moment().isSame(date, 'day') ? '#eff6ff' : 'transparent',
          }
        })}
        components={{
          toolbar: ({ label, onNavigate, onView }: any) => (
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('PREV')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <button
                  onClick={() => onNavigate('NEXT')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-1">
                {['month', 'week', 'day'].map(view => (
                  <button
                    key={view}
                    onClick={() => onView(view)}
                    className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors capitalize"
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          )
        }}
      />
    </div>
  );
}

// Recent bookings with clean design
function RecentBookingsWidget() {
  const { state } = useAppState();
  const recentBookings = state.bookings.slice(-4).reverse();

  return (
    <div className="h-full">
      <div className="space-y-3">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {booking.guestName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{booking.guestName}</p>
                <p className="text-xs text-gray-500 truncate">{booking.serviceName}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  {formatCurrency(booking.totalAmount, 'EUR')}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recent bookings</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Popular services widget
function PopularServicesWidget() {
  const { state } = useAppState();
  
  const serviceBookings = state.bookings.reduce((acc, booking) => {
    acc[booking.serviceName] = (acc[booking.serviceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularServices = state.services
    .filter(service => service.isActive)
    .map(service => ({
      ...service,
      bookingCount: serviceBookings[service.name] || 0
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 3);

  return (
    <div className="h-full">
      <div className="space-y-3">
        {popularServices.map((service, index) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              'bg-orange-500'
            }`}>
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm truncate">{service.name}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatCurrency(service.price, 'EUR')}</span>
                <span>•</span>
                <span>{service.duration}min</span>
                {service.bookingCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">{service.bookingCount} bookings</span>
                  </>
                )}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Quick actions grid
function QuickActionsWidget() {
  const actions = [
    { label: 'New Booking', icon: Plus, color: 'bg-blue-500', href: '/bookings' },
    { label: 'Add Service', icon: Activity, color: 'bg-green-500', href: '/services' },
    { label: 'Reports', icon: BarChart3, color: 'bg-purple-500', href: '#' },
    { label: 'Settings', icon: Settings, color: 'bg-orange-500', href: '/settings' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            onClick={() => action.href !== '#' && (window.location.href = action.href)}
            className={`${action.color} rounded-xl p-4 text-white hover:scale-105 transition-transform flex flex-col items-center justify-center space-y-2`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center">{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// System overview widget
function SystemOverviewWidget() {
  const { state } = useAppState();
  
  const stats = [
    {
      label: 'Services',
      value: state.services.filter(s => s.isActive).length,
      total: state.services.length,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending',
      value: state.bookings.filter(b => b.status === 'pending').length,
      total: state.bookings.length,
      color: 'bg-yellow-500'
    },
    {
      label: 'Users',
      value: state.users.filter(u => u.isActive).length,
      total: state.users.length,
      color: 'bg-green-500'
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => {
        const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{stat.label}</span>
              <span className="text-sm font-bold text-gray-900">{stat.value}/{stat.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AndroidStyleDashboard() {
  const { state } = useAppState();
  const [layouts, setLayouts] = useState({});

  const totalRevenue = state.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  const defaultLayout: WidgetData[] = [
    // Top stats row
    { i: 'total-bookings', title: '', component: 'stat', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'total-revenue', title: '', component: 'stat', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'active-services', title: '', component: 'stat', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'total-users', title: '', component: 'stat', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    
    // Main content row
    { i: 'calendar', title: 'Booking Calendar', component: 'calendar', x: 0, y: 2, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'recent-bookings', title: 'Recent Bookings', component: 'recent-bookings', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
    
    // Bottom row
    { i: 'popular-services', title: 'Popular Services', component: 'popular-services', x: 0, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'quick-actions', title: 'Quick Actions', component: 'quick-actions', x: 4, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'system-overview', title: 'System Overview', component: 'system-overview', x: 8, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
  ];

  const [currentLayout, setCurrentLayout] = useState(defaultLayout);

  const onLayoutChange = (_layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  const removeWidget = (widgetId: string) => {
    setCurrentLayout(currentLayout.filter(widget => widget.i !== widgetId));
  };

  const renderWidget = (widget: WidgetData) => {
    switch (widget.component) {
      case 'stat':
        const statsData = {
          'total-bookings': {
            title: 'Total Bookings',
            value: state.bookings.length,
            change: 12,
            icon: CalendarIcon,
            trend: 'up',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
          },
          'total-revenue': {
            title: 'Total Revenue',
            value: formatCurrency(totalRevenue, 'EUR'),
            change: 8,
            icon: DollarSign,
            trend: 'up',
            color: 'bg-gradient-to-br from-green-500 to-green-600',
          },
          'active-services': {
            title: 'Active Services',
            value: state.services.filter(s => s.isActive).length,
            change: 5,
            icon: Activity,
            trend: 'up',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
          },
          'total-users': {
            title: 'Total Users',
            value: state.users.length,
            change: 15,
            icon: Users,
            trend: 'up',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
          },
        };
        return <StatWidget {...statsData[widget.i as keyof typeof statsData]} />;
      
      case 'calendar':
        return <CalendarWidget />;
      
      case 'recent-bookings':
        return <RecentBookingsWidget />;
      
      case 'popular-services':
        return <PopularServicesWidget />;
      
      case 'quick-actions':
        return <QuickActionsWidget />;
        
      case 'system-overview':
        return <SystemOverviewWidget />;
      
      default:
        return <div>Widget content</div>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Drag widgets to rearrange • Resize by dragging corners • Widgets snap to grid</p>
      </motion.div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        compactType="vertical"
        preventCollision={false}
        isDraggable={true}
        isResizable={true}
        autoSize={true}
        draggableHandle=".drag-handle"
      >
        {currentLayout.map((widget) => (
          <div key={widget.i} className="relative group">
            <Widget 
              title={widget.title} 
              onRemove={widget.title ? removeWidget : undefined}
              id={widget.i}
            >
              {renderWidget(widget)}
            </Widget>
            {/* Drag handle */}
            <div className="drag-handle absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 bg-gray-100 rounded">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>

      {/* Add Widget Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => alert('Add Widget feature coming soon! 🎉')}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
