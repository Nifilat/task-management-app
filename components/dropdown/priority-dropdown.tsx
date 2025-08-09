// import React from 'react';
// import Dropdown from './Dropdown';
// import { priorities } from '@/constants/status';
// import type { Priority } from './types';

// const PriorityDropDown = () => {
//   const [selectedPriority, setSelectedPriority] = React.useState<Priority | null>(null);

//   const handlePriorityChange = (item: Priority | null) => {
//     setSelectedPriority(item);
//   };

//   return (
//     <Dropdown
//       items={priorities}
//       selectedItem={selectedPriority}
//       onSelectedItemChange={handlePriorityChange}
//       title="Priority"
//       placeholder="Change Priority..."
//       groupHeading="Priorities"
//       badges={['Low', 'Medium']}
//     />
//   );
// };

// export default PriorityDropDown;

'use client'

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CirclePlus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useCheckedPrioritiesStore } from "@/hooks/useCheckedPrioritiesStore";
import { Priority } from "@/data/types";
import { useTasksDataStore } from "@/hooks/useTasksDataStore";
import { tasks } from "@/data/tasks-data";


type SinglePriorityItem = {
    value: string;
    label: string;
    icon: LucideIcon;
    count: number;
}

const prioritiesArray: SinglePriorityItem[] = [
    {
        value: 'low',
        label: 'Low',
        icon: ArrowDown,
        count: 0,
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: ArrowRight,
        count: 0,
    },
    {
        value: 'high',
        label: 'High',
        icon: ArrowUp,
        count: 0,
    },
];

const PriorityDropDown = () => {
    const [open, setOpen] = useState(false);

    const { checkedPriorities, setCheckedPriorities } = useCheckedPrioritiesStore();

    // const { tasks } = useTasksDataStore();

    function updateTheSelection(label: string) {
        const validPriorities: Priority[] = ["Low", "Medium", "High"];

        if(!validPriorities.includes(label as Priority)) {
            console.error("Invalid priority type");
            return;
        }

        const priority = label as Priority;

        const newCheckedPriorities = checkedPriorities.includes(priority)
            ? checkedPriorities.filter((p) => p !== priority)
            : [...checkedPriorities, priority];
        
        setCheckedPriorities(newCheckedPriorities);
    }

    const priorityCounts: SinglePriorityItem[] = useMemo(() => {
        if(!tasks) {
            return prioritiesArray;
        }
        const countByLow = tasks?.filter((task) => task.priority === "Low").length;
        const countByMedium = tasks?.filter(
            (task) => task.priority === "Medium"
        ).length;
        const countByHigh = tasks?.filter(
            (task) => task.priority === "High"
        ).length;

        return prioritiesArray.map((priority) => {
            switch( priority.value) {
                case "low":
                    return { ...priority, count: countByLow };
                case "medium":
                    return { ...priority, count: countByMedium };
                case "high":
                    return { ...priority, count: countByHigh };
                default:
                    return priority;
            }
        });

    }, [tasks]);

    return (
        <div className='flex items-center space-x-4'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild >
                    <Button size='sm' variant={'outline'} className='h-10 justify-start border-dashed px-5'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <CirclePlus/>
                                <span>Priority</span>
                            </div>
                            {checkedPriorities?.length > 0 && (
                                <>
                                    <Separator orientation="vertical" className="h-6 border-1 border-gray-300" />
                                    <div className='flex items-center gap-2'>
                                        {checkedPriorities.map((checkedPriority, index) => (
                                            <Badge key={index} variant={'secondary'} >
                                                {checkedPriority}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="p-0 poppins w-52"
                    side="bottom"
                    align="center"
                >
                    <Command>
                        <CommandInput placeholder="Change priority..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {priorityCounts.map((priority) => (
                                    <CommandItem
                                        key={priority.value}
                                        value={priority.value}
                                        className="flex justify-between"
                                        onSelect={() => updateTheSelection(priority.label)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Checkbox 
                                                checked = {checkedPriorities.includes(
                                                    priority.label as Priority
                                                )}
                                            />
                                            <priority.icon />
                                            <span>{priority.label}</span>
                                        </div>  
                                        <pre>{priority.count}</pre>                                      
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

export default PriorityDropDown
