import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import Sparkline from './Sparkline';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  sparklineColor?: string;
  className?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  sparklineData,
  sparklineColor = '#3b82f6',
  className = ''
}: KpiCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-gray-400" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
            {change !== undefined && (
              <div className="flex items-center space-x-1 mt-1">
                <Badge 
                  variant={isPositive ? 'success' : isNegative ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {isPositive ? '+' : ''}{change}%
                </Badge>
                {changeLabel && (
                  <span className="text-xs text-gray-500">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          {sparklineData && (
            <div className="ml-4">
              <Sparkline 
                data={sparklineData} 
                color={sparklineColor}
                height={40}
                width={80}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
