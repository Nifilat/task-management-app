'use client';

import React from 'react';
import SingleStatsCard from './SingleStatsCard';
import { stats } from '@/constants/statsCard';

const StatsCard = () => {
  return (
    <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1 mt-7 p-6">
      {stats.map((stat, index) => (
        <SingleStatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCard;
