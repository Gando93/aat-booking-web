import type { Vehicle } from '../../types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Users, 
  Gauge, 
  Fuel, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onView?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ 
  vehicle, 
  onView, 
  onEdit, 
  onDelete 
}: VehicleCardProps) {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available': return 'success';
      case 'assigned': return 'info';
      case 'maintenance': return 'warning';
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'van': return '🚐';
      case 'car': return '🚗';
      case 'boat': return '⛵';
      default: return '🚗';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(vehicle.type)}</span>
            <div>
              <CardTitle className="text-lg">{vehicle.name}</CardTitle>
              <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
            </div>
          </div>
          <Badge variant={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{vehicle.capacity} seats</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-gray-400" />
            <span>{vehicle.odometer.toLocaleString()} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4 text-gray-400" />
            <span>{vehicle.fuelLevel}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(vehicle.nextServiceAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-gray-500">
            License: {vehicle.licensePlate}
          </div>
          <div className="flex items-center space-x-1">
            {onView && (
              <button
                onClick={() => onView(vehicle)}
                className="p-1 hover:bg-gray-100 rounded"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(vehicle)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Edit Vehicle"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vehicle)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
                title="Delete Vehicle"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
