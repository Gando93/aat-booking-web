import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { 
  GripVertical, 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  BarChart3,
  Plus,
  X,
  Clock,
  CheckCircle,
  Star,
  Euro,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { formatCurrency } from '../types';

interface Widget {
  id: string;
  title: string;
  component: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

interface ResizableWidgetProps {
  widget: Widget;
  onResize: (id: string, width: number, height: number) => void;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

function ResizableWidget({ widget, onResize, onRemove, children }: ResizableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'z-50 rotate-1 scale-105' : ''} transition-transform duration-200`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Resizable
        width={widget.width}
        height={widget.height}
        minConstraints={[widget.minWidth, widget.minHeight]}
        maxConstraints={[600, 500]}
        onResize={(_e, { size }) => {
          onResize(widget.id, size.width, size.height);
        }}
        resizeHandles={['se']}
      >
        <div
          className={`
            bg-white rounded-xl shadow-sm border border-gray-200 
            ${isDragging ? 'shadow-2xl' : 'hover:shadow-md'} 
            transition-all duration-200 overflow-hidden relative
          `}
          style={{ width: widget.width, height: widget.height }}
        >
          {/* Widget Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </button>
              <h3 className="font-semibold text-gray-900 text-sm">{widget.title}</h3>
            </div>
            <button
              onClick={() => onRemove(widget.id)}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Widget Content */}
          <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 65px)' }}>
            {children}
          </div>
        </div>
      </Resizable>
    </motion.div>
  );
}

// Enhanced Widget Components with Real Data
function StatsWidget({ title, value, change, icon: Icon, color, trend }: any) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {change}%
          </div>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}

function RecentBookingsWidget() {
  const { state } = useAppState();
  const recentBookings = state.bookings.slice(-5).reverse();

  return (
    <div className="h-full">
      <div className="space-y-3">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <motion.div 
              key={booking.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {booking.guestName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{booking.guestName}</p>
                    <p className="text-xs text-gray-600 truncate">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 ml-10">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Euro className="w-3 h-3 mr-1" />
                    {formatCurrency(booking.totalAmount, 'EUR')}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No recent bookings</p>
            <p className="text-xs">New bookings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PopularServicesWidget() {
  const { state } = useAppState();
  
  // Calculate booking counts per service
  const serviceBookings = state.bookings.reduce((acc, booking) => {
    acc[booking.serviceName] = (acc[booking.serviceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get services with booking counts and sort by popularity
  const popularServices = state.services
    .filter(service => service.isActive)
    .map(service => ({
      ...service,
      bookingCount: serviceBookings[service.name] || 0
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 4);

  return (
    <div className="h-full">
      <div className="space-y-3">
        {popularServices.length > 0 ? (
          popularServices.map((service, index) => (
            <motion.div 
              key={service.id} 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {index < 3 ? (
                    <Star className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                {service.bookingCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {service.bookingCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <span className="flex items-center">
                    <Euro className="w-3 h-3 mr-1" />
                    {formatCurrency(service.price, 'EUR')}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration}min
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No services yet</p>
            <p className="text-xs">Add services to see popularity</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionsWidget() {
  const actions = [
    { 
      label: 'New Booking', 
      icon: Plus, 
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      href: '/bookings'
    },
    { 
      label: 'Add User', 
      icon: Users, 
      color: 'bg-green-50 hover:bg-green-100 text-green-600',
      href: '/settings'
    },
    { 
      label: 'Reports', 
      icon: BarChart3, 
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
      href: '#'
    },
    { 
      label: 'Settings', 
      icon: Activity, 
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
      href: '/settings'
    },
  ];

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-3 h-full">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              onClick={() => {
                if (action.href !== '#') {
                  window.location.href = action.href;
                }
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${action.color}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function SystemStatusWidget() {
  const { state } = useAppState();
  
  const stats = [
    {
      label: 'Active Services',
      value: state.services.filter(s => s.isActive).length,
      total: state.services.length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Pending Bookings',
      value: state.bookings.filter(b => b.status === 'pending').length,
      total: state.bookings.length,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      label: 'Active Users',
      value: state.users.filter(u => u.isActive).length,
      total: state.users.length,
      icon: Users,
      color: 'text-blue-600'
    },
  ];

  return (
    <div className="h-full space-y-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
        
        return (
          <motion.div
            key={stat.label}
            className="p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-900">{stat.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {stat.value}/{stat.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  stat.color.includes('green') ? 'bg-green-500' :
                  stat.color.includes('yellow') ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
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

export default function DynamicDashboard() {
  const { state } = useAppState();
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'total-bookings',
      title: 'Total Bookings',
      component: 'stats',
      width: 280,
      height: 160,
      minWidth: 200,
      minHeight: 140,
    },
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      component: 'stats',
      width: 280,
      height: 160,
      minWidth: 200,
      minHeight: 140,
    },
    {
      id: 'active-services',
      title: 'Active Services',
      component: 'stats',
      width: 280,
      height: 160,
      minWidth: 200,
      minHeight: 140,
    },
    {
      id: 'total-users',
      title: 'Total Users',
      component: 'stats',
      width: 280,
      height: 160,
      minWidth: 200,
      minHeight: 140,
    },
    {
      id: 'recent-bookings',
      title: 'Recent Bookings',
      component: 'recent-bookings',
      width: 400,
      height: 320,
      minWidth: 300,
      minHeight: 250,
    },
    {
      id: 'popular-services',
      title: 'Popular Services',
      component: 'popular-services',
      width: 350,
      height: 320,
      minWidth: 280,
      minHeight: 250,
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      component: 'quick-actions',
      width: 300,
      height: 200,
      minWidth: 250,
      minHeight: 180,
    },
    {
      id: 'system-status',
      title: 'System Status',
      component: 'system-status',
      width: 320,
      height: 220,
      minWidth: 280,
      minHeight: 200,
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleResize = (id: string, width: number, height: number) => {
    setWidgets(widgets.map(widget => 
      widget.id === id 
        ? { ...widget, width, height }
        : widget
    ));
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const renderWidget = (widget: Widget) => {
    const totalRevenue = state.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    switch (widget.component) {
      case 'stats':
        const statsData = {
          'total-bookings': {
            title: 'Total Bookings',
            value: state.bookings.length.toString(),
            change: 12,
            icon: Calendar,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            trend: 'up' as const,
          },
          'total-revenue': {
            title: 'Total Revenue',
            value: formatCurrency(totalRevenue, 'EUR'),
            change: 8,
            icon: DollarSign,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            trend: 'up' as const,
          },
          'active-services': {
            title: 'Active Services',
            value: state.services.filter(s => s.isActive).length.toString(),
            change: 5,
            icon: Activity,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            trend: 'neutral' as const,
          },
          'total-users': {
            title: 'Total Users',
            value: state.users.length.toString(),
            change: 15,
            icon: Users,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            trend: 'up' as const,
          },
        };
        return <StatsWidget {...statsData[widget.id as keyof typeof statsData]} />;
      
      case 'recent-bookings':
        return <RecentBookingsWidget />;
      
      case 'popular-services':
        return <PopularServicesWidget />;
      
      case 'quick-actions':
        return <QuickActionsWidget />;
        
      case 'system-status':
        return <SystemStatusWidget />;
      
      default:
        return <div className="text-gray-500">Widget content</div>;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Drag widgets to reorder • Drag bottom-right corner to resize • Click X to remove</p>
      </motion.div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={widgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
            <AnimatePresence>
              {widgets.map((widget) => (
                <ResizableWidget
                  key={widget.id}
                  widget={widget}
                  onResize={handleResize}
                  onRemove={handleRemoveWidget}
                >
                  {renderWidget(widget)}
                </ResizableWidget>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Widget Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          alert('Add Widget feature coming soon! 🎉');
        }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
