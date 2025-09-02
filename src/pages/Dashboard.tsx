import 'react';
import { useAppState } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  
  
} from 'lucide-react';
import { formatCurrency } from '../types';

export default function Dashboard() {
  const { state } = useAppState();

  // Calculate statistics
  const totalBookings = state.bookings.length;
  const totalRevenue = state.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalServices = state.services.length;
  const activeServices = state.services.filter(service => service.isActive).length;

  // Get recent bookings
  const recentBookings = state.bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate popular excursions
  const excursionBookings = state.bookings.filter(booking => 
    state.services.some(service => service.name === booking.serviceName && service.category !== 'Transportation' && service.category !== 'Accommodation')
  );

  const popularExcursions = state.services
    .filter(service => service.category !== 'Transportation' && service.category !== 'Accommodation')
    .map(excursion => {
      const bookings = excursionBookings.filter(booking => booking.serviceName === excursion.name);
      const revenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      return {
        ...excursion,
        bookingCount: bookings.length,
        revenue
      };
    })
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 3);

  const stats = [
    {
      name: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Active Services',
      value: `${activeServices}/${totalServices}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Users',
      value: state.users.length.toString(),
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your bookings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Excursions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Excursions</h2>
          <div className="space-y-4">
            {popularExcursions.map((excursion, index) => (
              <div key={excursion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                    <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{excursion.name}</p>
                    <p className="text-sm text-gray-500">{excursion.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{excursion.bookingCount} bookings</p>
                  <p className="text-sm text-gray-500">
                    <span className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(excursion.revenue)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.guestName}</p>
                    <p className="text-sm text-gray-500">{booking.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{booking.bookingDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <p className="text-sm text-gray-400">Create your first booking to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
