
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: string | { value: number; isPositive: boolean };
  trendType?: 'up' | 'down' | 'neutral';
  color?: string;
  className?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendType = 'neutral',
  color = 'primary',
  className = ''
}: StatsCardProps) => {
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
  
  // Get color classes based on the color prop
  const getColorClasses = () => {
    switch (color) {
      case 'health':
        return 'from-green-400 to-green-600';
      case 'real-estate':
        return 'from-amber-400 to-amber-600';
      case 'success':
        return 'from-emerald-400 to-emerald-600';
      case 'warning':
        return 'from-yellow-400 to-yellow-600';
      case 'danger':
        return 'from-red-400 to-red-600';
      case 'info':
        return 'from-blue-400 to-blue-600';
      default: // primary
        return 'from-primary/60 to-primary';
    }
  };

  const colorClasses = getColorClasses();
  
  // Trend icon based on trend type
  const getTrendIcon = () => {
    switch (actualTrendType) {
      case 'up':
        return <ArrowUp className="h-3 w-3" />;
      case 'down':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">
                {description}
              </p>
            )}
            
            {trendDisplay && (
              <div className={`mt-2 inline-flex items-center text-xs font-medium ${
                actualTrendType === 'up' ? 'text-green-600 bg-green-50' : 
                actualTrendType === 'down' ? 'text-red-600 bg-red-50' : 
                'text-gray-600 bg-gray-50'
              } px-2 py-1 rounded-full`}>
                <span className="mr-1">{getTrendIcon()}</span>
                {trendDisplay}
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-3 rounded-full bg-opacity-10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
