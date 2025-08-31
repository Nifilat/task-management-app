import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { selectAllTasks, selectTasksLoading } from '@/lib/features/tasks/tasksSlice';
import {
  selectCheckedStatuses,
  selectCheckedPriorities,
  setCheckedStatuses,
  setCheckedPriorities,
  resetFilters,
} from '@/lib/features/filters/filtersSlice';
import type { StatsCardType } from '@/components/statsCard/types';
import {
  calculateTaskStats,
  isCardActive,
  getCardFilterConfig,
} from '@/components/statsCard/utils';

/**
 * Hook for managing stats card data and state
 */
export const useStatsCard = () => {
  const tasks = useAppSelector(selectAllTasks);
  const loading = useAppSelector(selectTasksLoading);
  const checkedStatuses = useAppSelector(selectCheckedStatuses);
  const checkedPriorities = useAppSelector(selectCheckedPriorities);
  const dispatch = useAppDispatch();

  const stats = useMemo(() => {
    return calculateTaskStats(tasks, loading);
  }, [tasks, loading]);

  const filterState = useMemo(
    () => ({
      checkedStatuses,
      checkedPriorities,
    }),
    [checkedStatuses, checkedPriorities]
  );

  return {
    stats,
    filterState,
    dispatch,
  };
};

/**
 * Hook for handling card interactions
 */
export const useStatsCardInteractions = () => {
  const dispatch = useAppDispatch();
  const checkedStatuses = useAppSelector(selectCheckedStatuses);
  const checkedPriorities = useAppSelector(selectCheckedPriorities);

  const handleCardClick = (cardTitle: StatsCardType) => {
    const filterState = { checkedStatuses, checkedPriorities };
    const isCurrentlyActive = isCardActive(cardTitle, filterState);

    if (isCurrentlyActive) {
      dispatch(resetFilters());
      return;
    }

    const filterConfig = getCardFilterConfig(cardTitle);
    dispatch(setCheckedStatuses(filterConfig.statuses));
    dispatch(setCheckedPriorities(filterConfig.priorities));
  };

  const getCardActiveState = (cardTitle: StatsCardType) => {
    const filterState = { checkedStatuses, checkedPriorities };
    return isCardActive(cardTitle, filterState);
  };

  return {
    handleCardClick,
    getCardActiveState,
  };
};
