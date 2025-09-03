import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import type { Vehicle, VehicleAssignment } from '../../types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Truck, MapPin } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface FleetCalendarProps {
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: string;
  vehicleId: string;
  status: string;
  route?: string;
}

export default function FleetCalendar({ vehicles, assignments }: FleetCalendarProps) {
  const events: CalendarEvent[] = assignments.map(assignment => {
    const vehicle = vehicles.find(v => v.id === assignment.vehicleId);
    return {
      id: assignment.id,
      title: `${vehicle?.name || 'Unknown Vehicle'} - ${assignment.route || 'Assignment'}`,
      start: new Date(assignment.startTime),
      end: new Date(assignment.endTime),
      resource: vehicle?.id || '',
      vehicleId: assignment.vehicleId,
      status: assignment.status,
      route: assignment.route
    };
  });

  const resources = vehicles.map(vehicle => ({
    resourceId: vehicle.id,
    resourceTitle: vehicle.name
  }));

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6';
    switch (event.status) {
      case 'scheduled': backgroundColor = '#10b981'; break;
      case 'in-progress': backgroundColor = '#f59e0b'; break;
      case 'completed': backgroundColor = '#6b7280'; break;
      case 'cancelled': backgroundColor = '#ef4444'; break;
    }
    return { style: { backgroundColor, borderRadius: '4px', opacity: 0.9, color: 'white', border: 0 } };
  };

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const vehicle = vehicles.find(v => v.id === event.vehicleId);
    return (
      <div className="p-1">
        <div className="flex items-center space-x-1">
          <Truck className="h-3 w-3" />
          <span className="text-xs font-medium truncate">{vehicle?.name}</span>
        </div>
        {event.route && (
          <div className="flex items-center space-x-1 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="text-xs truncate">{event.route}</span>
          </div>
        )}
        <Badge variant={event.status === 'scheduled' ? 'success' : event.status === 'in-progress' ? 'warning' : event.status === 'completed' ? 'secondary' : 'destructive'} className="text-xs mt-1">
          {event.status}
        </Badge>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fleet Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            resources={resources}
            resourceIdAccessor="resourceId"
            resourceTitleAccessor="resourceTitle"
            views={['month', 'week', 'day']}
            step={60}
            timeslots={1}
            showMultiDayTimes
            popup
            eventPropGetter={eventStyleGetter}
            components={{ event: EventComponent }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
