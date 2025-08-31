'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';

const SearchInput = dynamic(() => import('./SearchInput'), { ssr: false });
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PriorityDropdown = dynamic(() => import('../dropdown/PriorityDropdown'));
const StatusDropdown = dynamic(() => import('../dropdown/StatusDropdown'));
const ViewColumnsDropDown = dynamic(() => import('../dropdown/ViewColumnsDropdown'), {
  ssr: false,
});
const TasksTable = dynamic(() => import('./TasksTable').then(m => m.TasksTable), {
  ssr: false,
});
const TableSkeleton = dynamic(() => import('./TableSkeleton'));

import { tasksColumns } from './TaskColumns';
import {
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

const PaginationArea = dynamic(() => import('./pagination/PaginationArea'));

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTasks, selectTasks, selectTasksLoading } from '@/lib/features/tasks/tasksSlice';
import {
  resetFilters,
  selectCheckedPriorities,
  selectCheckedStatuses,
  selectQuery,
} from '@/lib/features/filters/filtersSlice';
import { globalTaskSearch } from '@/utils/tableFilters';

const TasksArea = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const loading = useAppSelector(selectTasksLoading);
  const checkedPriorities = useAppSelector(selectCheckedPriorities);
  const checkedStatuses = useAppSelector(selectCheckedStatuses);
  const query = useAppSelector(selectQuery);
  const { user } = useAuth();

  const columns = tasksColumns;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Check for any active filters
  const hasActiveFilters = useMemo(() => {
    const hasQuery = query && query.trim().length > 0;
    const hasPriorities = checkedPriorities.length > 0;
    const hasStatuses = checkedStatuses.length > 0;
    return hasQuery || hasPriorities || hasStatuses;
  }, [query, checkedPriorities, checkedStatuses]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  const table = useReactTable({
    data: tasks || [],
    columns,
    state: {
      globalFilter: query,
      sorting,
      columnFilters,
      pagination,
    },
    globalFilterFn: globalTaskSearch,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (checkedPriorities.length > 0) {
      newFilters.push({ id: 'priority', value: checkedPriorities });
    }

    if (checkedStatuses.length > 0) {
      newFilters.push({ id: 'status', value: checkedStatuses });
    }

    setColumnFilters(newFilters);
  }, [checkedPriorities, checkedStatuses]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const memoizedTable = useMemo(() => table, [table]);

  const ResetButton = () => {
    if (!hasActiveFilters) return null;
    return (
      <Button onClick={handleResetFilters} variant="ghost" className="h-8 md:h-10" size="sm">
        <span>Reset</span>
        <X className="ml-1 h-4 w-4" />
      </Button>
    );
  };

  if (!user) {
    return <TableSkeleton />;
  }

  return (
    <div className="px-4 sm:px-7 mt-5">
      <Card>
        <CardHeader className="space-y-4">
          {/* Mobile Layout */}
          <div className="flex flex-col space-y-3 md:hidden">
            <div className="w-full">
              <SearchInput />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <StatusDropdown />
                <PriorityDropdown />
                <ResetButton />
              </div>
              <ViewColumnsDropDown table={memoizedTable} />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-2xl">
              <div className="flex-1 min-w-0">
                <SearchInput />
              </div>
              <StatusDropdown />
              <PriorityDropdown />
              <ResetButton />
            </div>
            <div className="ml-4">
              <ViewColumnsDropDown table={memoizedTable} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {loading ? (
            <TableSkeleton />
          ) : (
            <TasksTable columns={tasksColumns} table={memoizedTable} />
          )}
        </CardContent>

        <CardFooter className="px-4 sm:px-6">
          <PaginationArea table={memoizedTable} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TasksArea;
