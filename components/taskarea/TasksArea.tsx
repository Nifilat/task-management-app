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

  const columns = tasksColumns;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (user) {
      console.log('Calling fetchTasks...');
      fetchTasks(user.uid);
    }
  }, [fetchTasks, user]);

  const table = useReactTable({
    data: tasks || [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
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
  useEffect(() => {}, [columnFilters, sorting, table, checkedPriorities, checkedStatuses, query]);

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
          <PaginationArea table={table} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TasksArea;
