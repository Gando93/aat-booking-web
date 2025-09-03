import { useState, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingDown,
  BarChart3,
  Settings,
  ChevronRight,
  Eye,
  RotateCcw,
  Zap,
  Target,
  Award,
  Briefcase,
  MessageCircle,
  Bell,
  Map,
  Star,
  FileText,
  Globe,
  Calendar as CalendarEvent,
  Search,
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { formatCurrency } from '../types';

const ResponsiveGridLayout = WidthProvider(Responsive);
const localizer = momentLocalizer(moment);

interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  component: string;
  category: 'essential' | 'analytics' | 'management' | 'communication' | 'tools';
  icon: any;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
}

const DEFAULT_WIDGETS = ['total-bookings', 'total-revenue', 'calendar', 'recent-activity'];

// Available widgets library
const WIDGET_LIBRARY: WidgetConfig[] = [
  // Essential widgets (shown by default)
  { id: 'total-bookings', title: 'Total Bookings', description: 'Overview of all bookings', component: 'stat', category: 'essential', icon: CalendarIcon, defaultSize: { w: 3, h: 4 }, minSize: { w: 2, h: 3 } },
  { id: 'total-revenue', title: 'Total Revenue', description: 'Revenue overview', component: 'stat', category: 'essential', icon: DollarSign, defaultSize: { w: 3, h: 4 }, minSize: { w: 2, h: 3 } },
  { id: 'calendar', title: 'Booking Calendar', description: 'Interactive calendar view', component: 'calendar', category: 'essential', icon: CalendarEvent, defaultSize: { w: 8, h: 10 }, minSize: { w: 6, h: 8 } },
  { id: 'recent-activity', title: 'Recent Activity', description: 'Latest bookings and updates', component: 'activity-feed', category: 'essential', icon: Activity, defaultSize: { w: 4, h: 10 }, minSize: { w: 3, h: 8 } },
  
  // Analytics widgets
  { id: 'revenue-chart', title: 'Revenue Chart', description: 'Monthly revenue trends', component: 'revenue-chart', category: 'analytics', icon: BarChart3, defaultSize: { w: 6, h: 8 }, minSize: { w: 4, h: 6 } },
  { id: 'service-performance', title: 'Service Performance', description: 'Top performing services', component: 'service-insights', category: 'analytics', icon: Award, defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 6 } },
  { id: 'booking-trends', title: 'Booking Trends', description: 'Booking patterns over time', component: 'booking-trends', category: 'analytics', icon: TrendingUp, defaultSize: { w: 6, h: 6 }, minSize: { w: 4, h: 4 } },
  { id: 'customer-insights', title: 'Customer Insights', description: 'Customer behavior analysis', component: 'customer-insights', category: 'analytics', icon: Users, defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 4 } },
  
  // Management widgets
  { id: 'quick-actions', title: 'Quick Actions', description: 'Common tasks and shortcuts', component: 'quick-actions', category: 'management', icon: Zap, defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 4 } },
  { id: 'system-health', title: 'System Health', description: 'System status and metrics', component: 'system-health', category: 'management', icon: Target, defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 6 } },
  { id: 'user-management', title: 'User Management', description: 'Team members overview', component: 'user-management', category: 'management', icon: Users, defaultSize: { w: 6, h: 6 }, minSize: { w: 4, h: 4 } },
  { id: 'service-status', title: 'Service Status', description: 'Service availability status', component: 'service-status', category: 'management', icon: Briefcase, defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 4 } },
  
  // Communication widgets
  { id: 'notifications', title: 'Notifications', description: 'System notifications and alerts', component: 'notifications', category: 'communication', icon: Bell, defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 6 } },
  { id: 'messages', title: 'Messages', description: 'Customer messages and inquiries', component: 'messages', category: 'communication', icon: MessageCircle, defaultSize: { w: 6, h: 8 }, minSize: { w: 4, h: 6 } },
  { id: 'reviews', title: 'Customer Reviews', description: 'Latest customer feedback', component: 'reviews', category: 'communication', icon: Star, defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 4 } },
  
  // Tools widgets
  { id: 'weather', title: 'Weather', description: 'Local weather conditions', component: 'weather', category: 'tools', icon: Globe, defaultSize: { w: 3, h: 4 }, minSize: { w: 2, h: 3 } },
  { id: 'search', title: 'Quick Search', description: 'Search bookings and services', component: 'search', category: 'tools', icon: Search, defaultSize: { w: 4, h: 3 }, minSize: { w: 3, h: 2 } },
  { id: 'reports', title: 'Reports', description: 'Generate and download reports', component: 'reports', category: 'tools', icon: FileText, defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 4 } },
  { id: 'map', title: 'Location Map', description: 'Service locations and routes', component: 'map', category: 'tools', icon: Map, defaultSize: { w: 6, h: 8 }, minSize: { w: 4, h: 6 } },
];

// Beautiful gradient backgrounds for stats
const gradients = [
  'from-blue-500 via-blue-600 to-blue-700',
  'from-emerald-500 via-emerald-600 to-emerald-700',
  'from-purple-500 via-purple-600 to-purple-700',
  'from-orange-500 via-orange-600 to-orange-700',
];

// Modern widget wrapper with beautiful styling
function ModernWidget({ title, children, onRemove, id, className = '' }: { 
  title?: string; 
  children: React.ReactNode; 
  onRemove?: (id: string) => void; 
  id: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden h-full backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ minHeight: '200px' }}
    >
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
          {onRemove && (
            <button
              onClick={() => onRemove(id)}
              className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      )}
      <div className={`${title ? 'p-4' : 'p-6'} h-full overflow-hidden flex flex-col justify-center`} style={{ minHeight: title ? '160px' : '200px' }}>
        {children}
      </div>
    </motion.div>
  );
}

// Beautiful stat card inspired by Linear/Stripe
function BeautifulStatCard({ title, value, change, icon: Icon, trend, gradient, subtitle, onClick }: any) {
  return (
    <div className="h-full w-full" onClick={onClick}>
      <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 h-full text-white relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200`} style={{ minHeight: '180px' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-white/20"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-white/10"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
            {change && (
              <div className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                <span className="text-sm font-medium">{change}%</span>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-2xl font-bold mb-1">{value}</p>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            {subtitle && (
              <p className="text-white/60 text-xs mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive calendar with click handlers
function InteractiveCalendarWidget() {
  const { state } = useAppState();
  const [_selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const events = useMemo(() => {
    return state.bookings.map(booking => ({
      id: booking.id,
      title: `${booking.guestName} - ${booking.serviceName}`,
      start: new Date(booking.createdAt),
      end: new Date(new Date(booking.createdAt).getTime() + 2 * 60 * 60 * 1000),
      resource: booking,
    }));
  }, [state.bookings]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    alert(`Booking Details:\n\nGuest: ${event.resource.guestName}\nService: ${event.resource.serviceName}\nAmount: ${formatCurrency(event.resource.totalAmount, 'EUR')}\nStatus: ${event.resource.status}`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const confirmed = confirm(`Create new booking for ${slotInfo.start.toLocaleDateString()}?`);
    if (confirmed) {
      window.location.href = '/bookings';
    }
  };

  return (
    <div className="h-full w-full" style={{ minHeight: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', minHeight: '500px' }}
        views={['month', 'week', 'day']}
        defaultView="month"
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSelectSlot}
        selectable={true}
        eventPropGetter={(_event: any) => ({
          style: {
            backgroundColor: '#3b82f6',
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: '0px',
            display: 'block',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer'
          }
        })}
        dayPropGetter={(date: any) => ({
          style: {
            backgroundColor: moment().isSame(date, 'day') ? '#f0f9ff' : 'transparent',
          }
        })}
        components={{
          toolbar: ({ label, onNavigate, onView }: any) => (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('PREV')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 text-gray-600" />
                </button>
                <h3 className="font-bold text-lg text-gray-900">{label}</h3>
                <button
                  onClick={() => onNavigate('NEXT')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['month', 'week', 'day'].map(view => (
                  <button
                    key={view}
                    onClick={() => onView(view)}
                    className="px-3 py-1 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 capitalize text-gray-600 hover:text-gray-900"
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

// Add Widget Modal
function AddWidgetModal({ isOpen, onClose, onAddWidget, activeWidgets }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Widgets', icon: Activity },
    { id: 'essential', name: 'Essential', icon: Zap },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'management', name: 'Management', icon: Settings },
    { id: 'communication', name: 'Communication', icon: MessageCircle },
    { id: 'tools', name: 'Tools', icon: Briefcase },
  ];

  const filteredWidgets = WIDGET_LIBRARY.filter(widget => 
    (selectedCategory === 'all' || widget.category === selectedCategory) &&
    !activeWidgets.includes(widget.id)
  );

  if (!isOpen) return null;

  return (
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
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Widgets</h2>
              <p className="text-gray-600">Choose widgets to add to your dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex h-96">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-gray-100 p-4">
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWidgets.map(widget => {
                const Icon = widget.icon;
                return (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group p-4 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onAddWidget(widget)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{widget.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{widget.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                            {widget.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Widget components (simplified versions of existing ones)
function RecentActivityWidget() {
  const { state } = useAppState();
  const recentBookings = state.bookings.slice(-5).reverse();

  return (
    <div className="h-full w-full">
      <div className="space-y-3">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              onClick={() => alert(`Booking Details:\n\nGuest: ${booking.guestName}\nService: ${booking.serviceName}\nAmount: ${formatCurrency(booking.totalAmount, 'EUR')}`)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">
                  {booking.guestName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{booking.guestName}</p>
                <p className="text-gray-600 text-xs truncate">{booking.serviceName}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Other widget components would go here...
function QuickActionsWidget() {
  const actions = [
    { label: 'New Booking', icon: Plus, gradient: 'from-blue-500 to-blue-600', href: '/bookings' },
    { label: 'Add Service', icon: Briefcase, gradient: 'from-emerald-500 to-emerald-600', href: '/services' },
    { label: 'Analytics', icon: BarChart3, gradient: 'from-purple-500 to-purple-600', href: '#' },
    { label: 'Settings', icon: Settings, gradient: 'from-orange-500 to-orange-600', href: '/settings' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full w-full">
      {actions.map((action, _index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            onClick={() => action.href !== '#' && (window.location.href = action.href)}
            className={`bg-gradient-to-br ${action.gradient} rounded-xl p-4 text-white hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center space-y-2 shadow-sm hover:shadow-lg group`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5" />
            <p className="text-xs font-semibold">{action.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function ModernDashboard() {
  const { state } = useAppState();
  
  // Persistent layout state
  const [layouts, setLayouts] = useState(() => {
    try {
      const saved = localStorage.getItem('aat-dashboard-layouts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active widgets state
  const [activeWidgets, setActiveWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('aat-dashboard-widgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  const [showAddWidget, setShowAddWidget] = useState(false);

  const handleResetDashboard = () => {
    setLayouts({});
    localStorage.removeItem('aat-dashboard-layouts');
    setActiveWidgets(DEFAULT_WIDGETS);
    localStorage.setItem('aat-dashboard-widgets', JSON.stringify(DEFAULT_WIDGETS));
  };

  const totalRevenue = state.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  // Save layouts to localStorage
  const onLayoutChange = (_layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    localStorage.setItem('aat-dashboard-layouts', JSON.stringify(allLayouts));
  };

  // Add widget
  const handleAddWidget = (widget: WidgetConfig) => {
    const newActiveWidgets = [...activeWidgets, widget.id];
    setActiveWidgets(newActiveWidgets);
    localStorage.setItem('aat-dashboard-widgets', JSON.stringify(newActiveWidgets));
    setShowAddWidget(false);
  };

  // Remove widget
  const handleRemoveWidget = (widgetId: string) => {
    const newActiveWidgets = activeWidgets.filter((id: string) => id !== widgetId);
    setActiveWidgets(newActiveWidgets);
    localStorage.setItem('aat-dashboard-widgets', JSON.stringify(newActiveWidgets));
  };

  // Generate layout for active widgets
  const generateLayout = () => {
    let x = 0, y = 0;
    return activeWidgets.map((widgetId: string) => {
      const widget = WIDGET_LIBRARY.find(w => w.id === widgetId);
      if (!widget) return null;
      
      const layout = {
        i: widgetId,
        x,
        y,
        w: widget.defaultSize.w,
        h: widget.defaultSize.h,
        minW: widget.minSize.w,
        minH: widget.minSize.h,
      };
      
      x += widget.defaultSize.w;
      if (x >= 12) {
        x = 0;
        y += widget.defaultSize.h;
      }
      
      return layout;
    }).filter(Boolean);
  };

  const currentLayouts = layouts.lg ? layouts : { lg: generateLayout() };

  const renderWidget = (widgetId: string) => {
    const widget = WIDGET_LIBRARY.find(w => w.id === widgetId);
    if (!widget) return <div>Widget not found</div>;

    switch (widget.component) {
      case 'stat':
        const statsData = {
          'total-bookings': {
            title: 'Total Bookings',
            value: state.bookings.length,
            change: 12,
            icon: CalendarIcon,
            trend: 'up',
            gradient: gradients[0],
            subtitle: 'This month',
            onClick: () => window.location.href = '/bookings'
          },
          'total-revenue': {
            title: 'Total Revenue',
            value: formatCurrency(totalRevenue, 'EUR'),
            change: 18,
            icon: DollarSign,
            trend: 'up',
            gradient: gradients[1],
            subtitle: 'All time',
            onClick: () => alert(`Revenue Breakdown:\n\nTotal: ${formatCurrency(totalRevenue, 'EUR')}\nBookings: ${state.bookings.length}\nAverage: ${formatCurrency(totalRevenue / Math.max(state.bookings.length, 1), 'EUR')}`)
          },
        };
        return <BeautifulStatCard {...statsData[widgetId as keyof typeof statsData]} />;
      
      case 'calendar':
        return <InteractiveCalendarWidget />;
      
      case 'activity-feed':
        return <RecentActivityWidget />;
      
      case 'quick-actions':
        return <QuickActionsWidget />;
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <widget.icon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">{widget.title}</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live</span>
            </div>
            <button 
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={handleResetDashboard}
              title="Reset dashboard"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      <ResponsiveGridLayout
        className="layout"
        layouts={currentLayouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        margin={[20, 20]}
        containerPadding={[0, 0]}
        isDraggable={true}
        isResizable={true}
        useCSSTransforms={true}
        compactType="vertical"
        preventCollision={false}
      >
        {activeWidgets.length === 0 ? (
          <div key="empty-state" className="col-span-12">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No widgets on your dashboard</h3>
              <p className="text-gray-500 mt-2">Add widgets to start building your personalized dashboard.</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowAddWidget(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Widgets
                </button>
                <button
                  onClick={handleResetDashboard}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        ) : (
          activeWidgets.map((widgetId: string) => {
            const widget = WIDGET_LIBRARY.find(w => w.id === widgetId);
            return (
              <div key={widgetId}>
                <ModernWidget 
                  title={widget?.title} 
                  id={widgetId}
                  onRemove={widget?.category !== 'essential' ? handleRemoveWidget : undefined}
                  className="h-full"
                >
                  {renderWidget(widgetId)}
                </ModernWidget>
              </div>
            );
          })
        )}
      </ResponsiveGridLayout>

      {/* Add Widget Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 z-40 group"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddWidget(true)}
      >
        <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
      </motion.button>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddWidget && (
          <AddWidgetModal
            isOpen={showAddWidget}
            onClose={() => setShowAddWidget(false)}
            onAddWidget={handleAddWidget}
            activeWidgets={activeWidgets}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
