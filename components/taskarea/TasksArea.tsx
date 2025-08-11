'use client';

import { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useCheckedPrioritiesStore } from '@/hooks/useCheckedPrioritiesStore';
import { useCheckedStatusesStore } from '@/hooks/useCheckedStatusesStore';
import { useQueryStore } from '@/hooks/useQueryStore';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { useAuth } from '@/hooks/useAuth';
import PriorityDropdown from '../dropdown/PriorityDropdown';
import StatusDropdown from '../dropdown/StatusDropdown';
import ViewColumnsDropDown from '../dropdown/ViewColumnsDropdown';
import { TasksTable } from './TasksTable';
import TableSkeleton from './TableSkeleton';
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
import PaginationArea from './pagination/PaginationArea';

const TasksArea = () => {
  const { setCheckedPriorities, checkedPriorities } = useCheckedPrioritiesStore();
  const { setCheckedStatuses, checkedStatuses } = useCheckedStatusesStore();
  const { query } = useQueryStore();
  const { tasks, loading, fetchTasks } = useTasksDataStore();
  const { user } = useAuth();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (user) {
      console.log('Calling fetchTasks...');
      fetchTasks(user.uid);
    }
  }, [fetchTasks, user]);

  const table = useReactTable({
    data: tasks || [],
    columns: tasksColumns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (query) {
      newFilters.push({ id: 'title', value: query });
    }

    if (checkedPriorities.length > 0) {
      newFilters.push({ id: 'priority', value: checkedPriorities });
    }

    if (checkedStatuses.length > 0) {
      newFilters.push({ id: 'status', value: checkedStatuses });
    }

    setColumnFilters(newFilters);
  }, [query, checkedPriorities, checkedStatuses]);

  // Debug logging (remove in production)
  useEffect(() => {
    console.log('Table state:', {
      columnFilters,
      sorting,
      filteredRowCount: table.getFilteredRowModel().rows.length,
      totalRowCount: table.getCoreRowModel().rows.length,
      checkedPriorities,
      checkedStatuses,
      query,
    });
  }, [columnFilters, sorting, table, checkedPriorities, checkedStatuses, query]);

  // Show loading if user is not available yet
  if (!user) {
    return <TableSkeleton />;
  }

  return (
    <div className="px-7 mt-5">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchInput />
              <StatusDropdown />
              <PriorityDropdown />

              <Button
                onClick={() => {
                  setCheckedPriorities([]);
                  setCheckedStatuses([]);
                  // Also clear the search query if needed
                  // setQuery('');
                }}
                variant={'ghost'}
                className="h-10"
              >
                <span>Reset</span>
                <X />
              </Button>
            </div>

            <ViewColumnsDropDown table={table} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <TableSkeleton /> : <TasksTable columns={tasksColumns} table={table} />}
        </CardContent>
        <CardFooter>
          <PaginationArea />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TasksArea;
