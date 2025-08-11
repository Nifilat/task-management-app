'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { StatsCardProps } from '@/types';
import { Task } from '@/data/types';
import { ListTodoIcon, CircleCheckIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { StatsCardContainerProps } from './types';

function SingleStatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="p-4 shadow-none hover:shadow-sm transition-shadow">
      <CardHeader className="p-0 flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <CardDescription className="text-2xl font-bold text-foreground sm:text-3xl">{value}</CardDescription>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-primary bg-primary/25">
          <Icon  />
        </div>
      </CardHeader>
    </Card>
  );
}

function StatsCard({
  className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-7 p-4 sm:p-6',
}: StatsCardContainerProps) {
  const { tasks, loading } = useTasksDataStore();

  const stats = useMemo((): StatsCardProps[] => {
    if (!tasks || loading) {
      return [
        {
          title: 'Total Tasks',
          value: loading ? '--' : 0,
          icon: ListTodoIcon,
        },
        {
          title: 'Completed Tasks',
          value: loading ? '--' : 0,
          icon: CircleCheckIcon,
        },
        {
          title: 'Pending Tasks',
          value: loading ? '--' : 0,
          icon: ClockIcon,
        },
        {
          title: 'High Priority Tasks',
          value: loading ? '--' : 0,
          icon: TriangleAlertIcon,
        },
      ];
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task: Task) => task.status === 'Done').length;
    const pendingTasks = tasks.filter(
      (task: Task) =>
        task.status === 'Todo' || task.status === 'In Progress' || task.status === 'Backlog'
    ).length;
    const highPriorityTasks = tasks.filter((task: Task) => task.priority === 'High').length;

    return [
      {
        title: 'Total Tasks',
        value: totalTasks,
        icon: ListTodoIcon,
      },
      {
        title: 'Completed Tasks',
        value: completedTasks,
        icon: CircleCheckIcon,
      },
      {
        title: 'Pending Tasks',
        value: pendingTasks,
        icon: ClockIcon,
      },
      {
        title: 'High Priority Tasks',
        value: highPriorityTasks,
        icon: TriangleAlertIcon,
      },
    ];
  }, [tasks, loading]);

  return (
    <div className={className}>
      {stats.map((stat, index) => (
        <SingleStatsCard key={`${stat.title}-${index}`} {...stat} />
      ))}
    </div>
  );
}

export default StatsCard;
export { SingleStatsCard };
