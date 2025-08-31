import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { InteractiveStatsCardProps } from './types';

const SingleStatsCard = memo(function SingleStatsCard({
  title,
  value,
  icon: Icon,
  onClick,
  isActive = false,
}: InteractiveStatsCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      className={`
        p-4 shadow-none hover:shadow-md transition-all duration-200 cursor-pointer border-2
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${
          isActive
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-transparent hover:border-primary/20'
        }
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Filter by ${title}. Current value: ${value}`}
      aria-pressed={isActive}
    >
      <CardHeader className="p-0 flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <CardDescription
            className={`
              text-2xl font-bold sm:text-3xl transition-colors
              ${isActive ? 'text-primary' : 'text-foreground'}
            `}
          >
            {value}
          </CardDescription>
        </div>
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors
            ${isActive ? 'text-primary bg-primary/30' : 'text-primary bg-primary/25'}
          `}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
    </Card>
  );
});

SingleStatsCard.displayName = 'SingleStatsCard';

export default SingleStatsCard;
