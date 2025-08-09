'use client';

import { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useCheckedPrioritiesStore } from '@/hooks/useCheckedPrioritiesStore';
import { useCheckedStatusesStore } from '@/hooks/useCheckedStatusesStore';
import { useQueryStore } from '@/hooks/useQueryStore';
import PriorityDropDown from '../dropdown/priority-dropdown';
import StatusDropDown from '../dropdown/status-dropdown';
import ViewColumnsDropDown from '../dropdown/view-columns-dropdown';
import { TasksTable } from './TasksTable';
import TableSkeleton from './TableSkeleton';
import { tasksColumns } from './TaskColumns';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { useReactTable, ColumnFiltersState, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { titleFilter } from '../filters/titleFilter';
import { statusFilter } from '../filters/statusFilter';
import { priorityFilter } from '../filters/priorityFilter';
import PaginationArea from './pagination/PaginationArea';
import { tasks } from '@/data/tasks-data';

const TasksArea = () => {
  const { setCheckedPriorities, checkedPriorities} = useCheckedPrioritiesStore();
    const { setCheckedStatuses, checkedStatuses} = useCheckedStatusesStore();
    // const { tasks } = useTasksDataStore();


    const { query } = useQueryStore();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: tasks || [],
        columns: tasksColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
        filterFns: { titleFilter, priorityFilter, statusFilter },
    });

    useEffect(() => {
        const newFilter: ColumnFiltersState = [];

        if(query) {
            newFilter.push({ id: 'title', value: query});
        }
        
        if(checkedPriorities.length > 0) {
            newFilter.push({ id: 'priority', value: checkedPriorities});
        }
        
        if(checkedStatuses.length > 0) {
            newFilter.push({ id: 'status', value: checkedStatuses});
        }

        setColumnFilters(newFilter);
    }, [query, checkedPriorities, checkedStatuses]);
  return (
    <div className="px-7 mt-5">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchInput />
              {/* status drop down */}
              <StatusDropDown />
              {/* priority drop down */}
              <PriorityDropDown />

              <Button onClick={() => {setCheckedPriorities([]); setCheckedStatuses([]); }} variant={'ghost'} className="h-10">
                <span>Reset</span>
                <X />
              </Button>
            </div>

            {/* DropDownViewColumns */}
            <ViewColumnsDropDown table={table}/>
          </div>
        </CardHeader>
        <CardContent>{!tasks ? (
                        <TableSkeleton />
                    ) : (
                        <TasksTable columns={tasksColumns} table={table} />
                    )}</CardContent>
        <CardFooter><PaginationArea /></CardFooter>
      </Card>
    </div>
  );
};

export default TasksArea;
