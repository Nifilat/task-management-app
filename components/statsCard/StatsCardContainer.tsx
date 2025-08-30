'use client';

import SingleStatsCard from './SingleStatsCard';
import { useStatsCard, useStatsCardInteractions } from '@/hooks/statsCard';
import type { StatsCardContainerProps, StatsCardType } from './types';

/**
 * Main container component for stats cards
 * Handles data fetching, state management, and orchestration
 */
function StatsCardContainer({
  className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-7 p-4 sm:p-6',
}: StatsCardContainerProps) {
  const { stats } = useStatsCard();
  const { handleCardClick, getCardActiveState } = useStatsCardInteractions();

  return (
    <div className={className}>
      {stats.map((stat, index) => (
        <SingleStatsCard
          key={`${stat.title}-${index}`}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          onClick={() => handleCardClick(stat.title as StatsCardType)}
          isActive={getCardActiveState(stat.title as StatsCardType)}
        />
      ))}
    </div>
  );
}

export default StatsCardContainer;
