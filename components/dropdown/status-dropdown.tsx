// import React from 'react';
// import Dropdown from './Dropdown';
// import { statuses } from '@/constants/status';
// import type { Status } from './types';

// const StatusDropDown = () => {
//   const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null);

//   const handleStatusChange = (item: Status | null) => {
//     setSelectedStatus(item);
//   };

//   return (
//     <Dropdown
//       items={statuses}
//       selectedItem={selectedStatus}
//       onSelectedItemChange={handleStatusChange}
//       title="Status"
//       placeholder="Change Status..."
//       groupHeading="Statuses"
//       badges={['Todo', 'Done']}
//     />
//   );
// };

// export default StatusDropDown;

'use client'

import { ArrowUpCircle, CheckCircle2, Circle, HelpCircle, LucideIcon, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Checkbox } from '../ui/checkbox';
import { useCheckedStatusesStore } from '@/hooks/useCheckedStatusesStore';
import { Status } from '@/data/types';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { tasks } from '@/data/tasks-data';

type SingleStatusItem = {
    value: string;
    label: string;
    icon: LucideIcon;
    count: number;
}

const statusesArray: SingleStatusItem[] = [
    {
        value: 'backlog',
        label: 'Backlog',
        icon: HelpCircle,
        count: 0,
    },
    {
        value: 'todo',
        label: 'Todo',
        icon: Circle,
        count: 0,
    },
    {
        value: 'in progress',
        label: 'In Progress',
        icon: ArrowUpCircle,
        count: 0,
    },
    {
        value: 'done',
        label: 'Done',
        icon: CheckCircle2,
        count: 0,
    },
    {
        value: 'canceled',
        label: 'Canceled',
        icon: XCircle,
        count: 0,
    },
];

const StatusDropDown = () => {
    const [open, setOpen] = useState(false);
    const { checkedStatuses, setCheckedStatuses } = useCheckedStatusesStore();

    // const { tasks } = useTasksDataStore();

    function updateTheSelection(label: string) {
            const validStatuses: Status[] = [
                "Backlog",
                "Canceled", 
                "Done",
                "In Progress",
                "Todo"
            ];
    
            if(!validStatuses.includes(label as Status)) {
                console.error("Invalid status type");
                return;
            }
    
            const status = label as Status;
    
            const newCheckedStatuses = checkedStatuses.includes(status)
                ? checkedStatuses.filter((p) => p !== status)
                : [...checkedStatuses, status];
            
            setCheckedStatuses(newCheckedStatuses);
    }
    
    const statusCounts: SingleStatusItem[] = useMemo(() => {
        if(!tasks) {
            return statusesArray;
        }
        
        return statusesArray.map((status) => {
            switch( status.value) {
                case "backlog":
                    return { 
                        ...status, 
                        count: tasks.filter((task) => task.status === "Backlog").length 
                    };
                case "canceled":
                    return { 
                        ...status, 
                        count: tasks.filter((task) => task.status === "Canceled").length 
                    };
                case "done":
                    return { 
                        ...status, 
                        count: tasks.filter((task) => task.status === "Done").length 
                    };
                case "in progress":
                    return { 
                        ...status, 
                        count: tasks.filter((task) => task.status === "In Progress").length 
                    };
                case "todo":
                    return { 
                        ...status, 
                        count: tasks.filter((task) => task.status === "Todo").length 
                    };
                default:
                    return status;
            }
        });
    
    }, [tasks]);

    function ShowCheckedStatuses() {
        const checkedStatusesLength = checkedStatuses.length;

        if(checkedStatusesLength > 0) {
            if( checkedStatusesLength <= 2) {
                return (
                    <>
                        <Separator
                            orientation='vertical'
                            className='h-6 border-1 border-gray-300'
                        />
                        <div className='flex items-center gap-2'>
                            {checkedStatuses.map((status, index) => (
                                <Badge key={index} variant={'secondary'}>
                                    {status}
                                </Badge>
                            ))}
                        </div>
                    </>
                );
            } else {
                return <Badge variant={'secondary'}>3 Selected</Badge>
            }
        }
    }
    
    return (
        <div className='flex items-center space-x-4'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild >
                    <Button size='sm' variant={'outline'} className='h-10 justify-start border-dashed px-5'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <PlusCircle />
                                <span>Status</span>
                            </div>
                            
                            <ShowCheckedStatuses />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 poppins" side='bottom' align='center'>
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statusCounts.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        className="flex justify-between"
                                        onSelect={() => updateTheSelection(status.label)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox 
                                                checked={checkedStatuses.includes(
                                                    status.label as Status
                                                )}
                                            />
                                            <status.icon />
                                            <span>{status.label}</span>
                                        </div>  
                                        <pre>{status.count}</pre>                                      
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default StatusDropDown
