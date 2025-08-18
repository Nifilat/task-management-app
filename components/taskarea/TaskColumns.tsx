'use client';

import { Priority, Status, Task } from '@/data/types';
import {
  Timer,
  ChevronsUpDown,
  Circle,
  HelpCircle,
  Star,
  CircleOff,
  CircleCheckBig,
} from 'lucide-react';
import { ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { TasksDropdown } from '../dropdown/TasksDropdown';
import { priorityFilter, statusFilter, titleFilter } from '@/utils/tableFilters';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSelectedTask } from '@/lib/features/tasks/tasksSlice';
import { formatDateString } from '@/utils/date';

function renderStatusIcons(status: Status) {
  switch (status) {
    case 'Backlog':
      return HelpCircle;
    case 'Todo':
      return Circle;
    case 'In Progress':
      return Timer;
    case 'Done':
      return CircleCheckBig;
    case 'Canceled':
      return CircleOff;
    default:
      break;
  }
}

function renderPriorityIcons(priority: Priority) {
  switch (priority) {
    case 'Low':
      return ArrowDown;
    case 'Medium':
      return ArrowRight;
    case 'High':
      return ArrowUp;
    default:
      break;
  }
}

type SortableHeaderProps = {
  column: Column<Task, unknown>;
  label: string;
};

const SortableHeader = ({ column, label }: SortableHeaderProps) => {
  const isSorted = column.getIsSorted();
  const SortingIcon =
    isSorted === 'asc' ? ArrowUp : isSorted === 'desc' ? ArrowDown : ChevronsUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-start py-[14px] select-none cursor-pointer p-2 gap-1 
                        ${isSorted && 'text-primary'}`}
          aria-label={`Sort by ${label}`}
        >
          {label}
          <SortingIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
        {label !== 'Title' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                column.toggleVisibility();
              }}
            >
              <EyeOff className="mr-2 size-4 text-opacity-90" />
              Hide
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const tasksColumns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const allPageRowsSelected = table.getRowModel().rows.every(row => row.getIsSelected());
      const somePageRowsSelected =
        !allPageRowsSelected && table.getRowModel().rows.some(row => row.getIsSelected());

      return (
        <Checkbox
          checked={allPageRowsSelected || (somePageRowsSelected && 'indeterminate')}
          onCheckedChange={value =>
            table.getRowModel().rows.forEach(row => row.toggleSelected(!!value))
          }
          aria-label="Select all on current page"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'taskId',
    header: 'Task',
    enableSorting: true,
  },
  {
    accessorKey: 'isFavorite',
    header: '',
    cell: ({ row }) => {
      const FavoriteIcon = row.original.isFavorite && Star;
      return FavoriteIcon && <FavoriteIcon size={14} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ row }) => {
      const taskLabel = row.original.label;
      const taskTitle = row.original.title;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={'outline'}>{taskLabel}</Badge>
          <span>{taskTitle}</span>
        </div>
      );
    },
    filterFn: titleFilter,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const StatusIcon = renderStatusIcons(row.original.status);
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2 text-sm">
          {StatusIcon && <StatusIcon size={17} className="text-gray-600 opacity-95" />}
          <span>{status}</span>
        </div>
      );
    },
    filterFn: statusFilter,
    enableSorting: true,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <SortableHeader column={column} label="Priority" />,
    cell: ({ row }) => {
      const PriorityIcon = renderPriorityIcons(row.original.priority);
      const priority = row.original.priority;
      return (
        <div className="flex items-center gap-2 text-sm">
          {PriorityIcon && <PriorityIcon size={17} className="text-gray-600 opacity-95" />}
          <span>{priority}</span>
        </div>
      );
    },
    filterFn: priorityFilter,
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} label="Created At" />,
    cell: ({ row }) => {
      const dateString = row.original.createdAt;
      const formattedDate = formatDateString(dateString);
      return formattedDate;
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return <ShowTaskDropDown task={row.original} />;
    },
    enableSorting: false,
  },
];

function ShowTaskDropDown({ task }: { task: Task }) {
  const dispatch = useAppDispatch();

  return (
    <TasksDropdown
      onOpen={() => dispatch(setSelectedTask(task))}
      onClose={() => dispatch(setSelectedTask(null))}
    />
  );
}
