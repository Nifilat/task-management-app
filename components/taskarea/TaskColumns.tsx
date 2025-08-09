// 'use client';

// import React from 'react';
// import type { Priority, Status, Task } from '@/data/types';
// import { Badge } from '../ui/badge';
// import { Column, ColumnDef } from '@tanstack/react-table';
// import {
//   ArrowUpCircle,
//   CheckCircle2,
//   Circle,
//   HelpCircle,
//   XCircle,
//   ArrowUp,
//   ArrowRight,
//   ArrowDown,
//   Star,
//   ChevronsUpDown,
//   EyeOff,
// } from 'lucide-react';
// import { Checkbox } from '../ui/checkbox';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '../ui/dropdown-menu';

// function renderStatusIcons(status: Status) {
//   switch (status) {
//     case 'Backlog':
//       return HelpCircle;
//     case 'Canceled':
//       return XCircle;
//     case 'Done':
//       return CheckCircle2;
//     case 'In Progress':
//       return ArrowUpCircle;
//     case 'Todo':
//       return Circle;
//     default:
//       break;
//   }
// }

// function renderPriorityIcons(priority: Priority) {
//   switch (priority) {
//     case 'Low':
//       return ArrowDown;
//     case 'Medium':
//       return ArrowRight;
//     case 'High':
//       return ArrowUp;
//     default:
//       break;
//   }
// }

// function formatDate(date: Date): string {
//   const day = date.getDate();
//   const month = date.toLocaleString('default', { month: 'long' });
//   const year = date.getFullYear();

//   const suffix =
//     day % 10 === 1 && day !== 11
//       ? 'st'
//       : day % 10 === 2 && day !== 12
//         ? 'nd'
//         : day % 10 === 3 && day !== 13
//           ? 'rd'
//           : 'th';

//   return `${day}${suffix} ${month} ${year}`;
// }

// type SortableHeaderProps = {
//   column: Column<Task, unknown>;
//   label: string;
// };

// const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
//   const sortDirection = column.getIsSorted();
//   const SortingIcon =
//     sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ChevronsUpDown;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="" asChild>
//         <div
//           className={`flex items-start py-[14px] select-none cursor-pointer p-2 gap-1 ${
//             sortDirection ? 'text-primary' : ''
//           }`}
//           aria-label={`Sort by ${label}`}
//         >
//           {label}
//           <SortingIcon className="h-4 w-4" />
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="start" side="bottom">
//         <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
//           <ArrowUp className="mr-2 h-4 w-4" />
//           Asc
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
//           <ArrowDown className="mr-2 h-4 w-4" />
//           Desc
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           <EyeOff className="mr-2 size-7 text-opacity-90" />
//           Hide
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export const taskColumns: ColumnDef<Task>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={value => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'taskId',
//     header: 'Task',
//   },
//   {
//     accessorKey: 'isFavorite',
//     header: '',
//     cell: ({ row }) => {
//       const FavoriteIcon = row.original.isFavorite && Star;
//       return FavoriteIcon && <FavoriteIcon size={14} />;
//     },
//   },
//   {
//     accessorKey: 'title',
//     header: ({ column }) => <SortableHeader column={column} label="Title" />,
//     cell: ({ row }) => {
//       const taskLabel = row.original.label;
//       const taskTitle = row.original.title;
//       return (
//         <div className="flex items-center gap-2">
//           <Badge variant={'outline'}>{taskLabel}</Badge>
//           <span>{taskTitle}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'status',
//     header: ({ column }) => <SortableHeader column={column} label="Status" />,
//     cell: ({ row }) => {
//       const StatusIcon = renderStatusIcons(row.original.status);
//       const status = row.original.status;
//       return (
//         <div className="flex items-center gap-2 text-sm">
//           {StatusIcon && <StatusIcon size={17} className="text-gray-600 opacity-95" />}
//           <span>{status}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'priority',
//     header: ({ column }) => <SortableHeader column={column} label="Priority" />,
//     cell: ({ row }) => {
//       const PriorityIcon = renderPriorityIcons(row.original.priority);
//       const priority = row.original.priority;
//       return (
//         <div>
//           {PriorityIcon && (
//             <div className="flex items-center gap-2 text-sm">
//               <PriorityIcon className="text-gray-600 opacity-95" />
//               {priority}
//             </div>
//           )}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'createdAt',
//     header: ({ column }) => <SortableHeader column={column} label="Created At" />,
//     cell: ({ row }) => {
//       const date = row.original.createdAt;
//       const formattedDate = formatDate(date);

//       return formattedDate;
//     },
//   },
//   {
//     id: 'actions',
//   },
// ];

// export default SortableHeader;

'use client'

import { Priority, Status, Task } from "@/data/types";
import { ArrowUpCircle, ArrowUpDown, CheckCircle2, Circle, HelpCircle, Star, XCircle } from "lucide-react"
import { ArrowRight, ArrowDown, ArrowUp  } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import Dropdown from "../dropdown/Dropdown";
import { useTasksDataStore } from "@/hooks/useTasksDataStore";
import { TasksDropDown } from "../dropdown/tasks-dropdown/TasksDropDown";

function renderStatusIcons(status: Status) {
    switch (status) {
        case 'Backlog':
            return HelpCircle;
        case 'Todo':
            return Circle;
        case 'In Progress':
            return ArrowUpCircle;
        case 'Done':
            return CheckCircle2;
        case 'Canceled':
            return XCircle;
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

function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix = 
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `${day}${suffix} ${month}, ${year}`;
}

type SortableHeaderProps = {
    column: Column<Task, unknown>;
    label: string;
};

const SortableHeader = ({ column, label }: SortableHeaderProps) => {
    const isSorted = column.getIsSorted();
    const SortingIcon = 
        isSorted === 'asc' ? ArrowUp :
        isSorted === 'desc' ? ArrowDown : ArrowUpDown;

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
            <DropdownMenuContent align="start" side="bottom" className="poppins">
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Desc
                </DropdownMenuItem>
                {label !=="Title" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => {
                                column.toggleVisibility();
                            }}
                        >
                            <EyeOff className="mr-2 size-7 text-opacity-90" />
                            Hide
                        </DropdownMenuItem> 
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const tasksColumns: ColumnDef<Task>[] = [
    {
        id: 'select',
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox 
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "taskId",
        header: "Task"
    },
    {
        accessorKey: "isFavorite",
        header: "",
        cell: ({ row }) => {
            const FavoriteIcon = row.original.isFavorite && Star;
            return FavoriteIcon && <FavoriteIcon size={14} />
        },
    },
    {
        accessorKey:"title",
        header: ({ column}) => <SortableHeader column={column} label="Title" />,
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
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) => {
            const StatusIcon = renderStatusIcons(row.original.status);
            const status = row.original.status;
            return (
                <div className="flex items-center gap-2 text-sm">
                    {StatusIcon && (
                        <StatusIcon size={17} className="text-gray-600 opacity-95" />
                    )}
                    <span>{status}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => <SortableHeader column={column} label="Priority" />,
        cell: ({ row }) => {
            const PriorityIcon = renderPriorityIcons(row.original.priority);
            const priority = row.original.priority;
            return (
                <div className="flex items-center gap-2 text-sm">
                    {PriorityIcon && (
                        <PriorityIcon size={17} className="text-gray-600 opacity-95" />
                    )}
                    <span>{priority}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column} label="Created At" />,
        cell: ({ row }) => {
            const date = row.original.createdAt;
            const formattedDate = formatDate(date);
            return formattedDate;
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            return <ShowTaskDropDown task={row.original} />
        }
    },
];

function ShowTaskDropDown({ task }: { task: Task }) {
    const { setSelectedTask } = useTasksDataStore();

    return (
        <TasksDropDown
            onOpen={() => setSelectedTask(task)}
            onClose={() => setSelectedTask(null)}
        />
    )
}