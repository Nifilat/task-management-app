import type { StatsCardProps } from './types';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

const SingleStatsCard = ({ title, value, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <CardDescription className="text-2xl font-bold text-foreground">{value}</CardDescription>
        </div>
        <div className="flex-shrink-0 size-7 rounded-md flex items-center justify-center text-sm bg-primary/25 font-bold text-primary">
          <Icon />
        </div>
      </CardHeader>
    </Card>
  );
};

export default SingleStatsCard;
