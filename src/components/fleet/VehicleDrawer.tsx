import type { Vehicle, VehicleAssignment, MaintenanceLog } from '../../types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { X, Truck, Users, Gauge, Fuel, Calendar, QrCode, Wrench, MapPin } from 'lucide-react';

interface VehicleDrawerProps {
  vehicle: Vehicle | null;
  assignments: VehicleAssignment[];
  maintenanceLogs: MaintenanceLog[];
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleDrawer({ vehicle, assignments, maintenanceLogs, isOpen, onClose }: VehicleDrawerProps) {
  if (!isOpen || !vehicle) return null;

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available': return 'success';
      case 'assigned': return 'info';
      case 'maintenance': return 'warning';
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  const vehicleAssignments = assignments.filter(a => a.vehicleId === vehicle.id);
  const vehicleMaintenanceLogs = maintenanceLogs.filter(m => m.vehicleId === vehicle.id);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">{vehicle.name}</h2>
                <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">License Plate</div>
                    <div className="mt-1 text-sm">{vehicle.licensePlate}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{vehicle.capacity} seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{new Date(vehicle.nextServiceAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {vehicle.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Notes</div>
                    <div className="mt-1 text-sm text-gray-700">{vehicle.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {vehicle.qrCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>QR Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Recent Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicleAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {vehicleAssignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="info">{assignment.status}</Badge>
                          <span className="text-sm text-gray-500">{new Date(assignment.startTime).toLocaleDateString()}</span>
                        </div>
                        {assignment.route && <div className="text-sm text-gray-700">{assignment.route}</div>}
                        {assignment.notes && <div className="text-xs text-gray-500 mt-1">{assignment.notes}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No recent assignments</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Wrench className="h-5 w-5" />
                  <span>Maintenance History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicleMaintenanceLogs.length > 0 ? (
                  <div className="space-y-3">
                    {vehicleMaintenanceLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{log.type}</Badge>
                          <span className="text-sm font-medium">€{log.cost}</span>
                        </div>
                        <div className="text-sm text-gray-700">{log.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(log.date).toLocaleDateString()} • {log.performedBy}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No maintenance records</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
