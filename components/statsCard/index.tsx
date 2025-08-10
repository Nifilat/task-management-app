'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { stats } from '@/constants/statsCard';
import { StatsCardProps } from '@/types';

function SingleStatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="p-4 shadow-none hover:shadow-sm transition-shadow">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-2xl font-bold text-foreground">
            {value}
          </CardDescription>
        </div>
        <div className="flex-shrink-0 size-7 rounded-md flex items-center justify-center text-sm bg-primary/25 font-bold text-primary">
          <Icon />
        </div>
      </CardHeader>
    </Card>
  );
}

interface StatsCardContainerProps {
  stats?: StatsCardProps[];
  className?: string;
}

function StatsCard({ 
  stats: customStats = stats, 
  className = "grid grid-cols-3 gap-6 max-sm:grid-cols-1 mt-7 p-6" 
}: StatsCardContainerProps) {
  if (!customStats?.length) {
    return null;
  }

  return (
    <div className={className}>
      {customStats.map((stat, index) => (
        <SingleStatsCard key={`${stat.title}-${index}`} {...stat} />
      ))}
    </div>
  );
}

export default StatsCard;
export { SingleStatsCard };