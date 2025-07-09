
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: string | { value: number; isPositive: boolean };
  trendType?: 'up' | 'down' | 'neutral';
}

const StatsCard = ({ title, value, icon, description, trend, trendType = 'neutral' }: StatsCardProps) => {
  // Format the trend display
  const getTrendDisplay = () => {
    if (!trend) return null;
    
    if (typeof trend === 'string') {
      return trend;
    } else {
      // Format trend object to string with + or - sign
      const prefix = trend.isPositive ? '+' : '';
      return `${prefix}${trend.value}%`;
    }
  };

  // Determine trend type if not explicitly provided
  const determineTrendType = () => {
    if (trendType !== 'neutral') return trendType;
    if (typeof trend === 'object' && 'isPositive' in trend) {
      return trend.isPositive ? 'up' : 'down';
    }
    return 'neutral';
  };

  const actualTrendType = determineTrendType();
  const trendDisplay = getTrendDisplay();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendDisplay) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trendDisplay && (
              <span className={`mr-1 ${
                actualTrendType === 'up' ? 'text-green-600' : 
                actualTrendType === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trendDisplay}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
