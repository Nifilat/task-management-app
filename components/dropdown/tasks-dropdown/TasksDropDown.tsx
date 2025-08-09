'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { LucideEllipsis } from "lucide-react";
import { MENU_ITEMS } from "./constants";
import { MenuItem } from "./MenuItems";
import { SubLabelMenu } from "./SubLabelMenu";
import { Trash } from "lucide-react";
import { useTasksDataStore } from "@/hooks/useTasksDataStore";
import { MenuItemType } from "./types";
import { Label, Task } from "@/data/types";
import { tasks } from "@/data/tasks-data";
import { toast } from "sonner";

export function TasksDropDown({
    onOpen,
    onClose,
}: {
    onOpen: () => void;
    onClose: () => void;
}){
    const [selectedLabel, setSelectedLabel] = useState("Bug");

    const { selectedTask, updateTasks } = useTasksDataStore();

    const [menuItemsArray, setMenuItemsArray] = useState<MenuItemType[]>(MENU_ITEMS);

    useEffect(() => {
        setMenuItemsArray((prev) => 
            prev.map((item) => {
                if(item.kind === "favorite") {
                    return {
                        ...item,
                        label: selectedTask?.isFavorite ? "Unfavorite" : "Favorite",
                    };
                }
                return item;
            })
        );
    }, [selectedTask]);

    useEffect(() => {
        if(selectedTask) {
            setSelectedLabel(selectedTask.label);
        }
    }, [selectedTask]);

    const clickedLabelItem = async (newLabel: string) => {
        const validLabels: Label[] = ['Bug', 'Deployment', 'Documentation', 'Feature', 'Refactoring', 'Testing'];
        if(!validLabels.includes(newLabel as Label)) {
            console.error(`The type ${newLabel} is incorrect`);
            return;
        }
        
        if(selectedTask && tasks) {
            const updatedTask: Task = {
                ...selectedTask,
                label: newLabel as Label,
            };

            const updateTasksArray = tasks.map((task) =>
            task.taskId === selectedTask.taskId ? updatedTask : task
            );
            
            try {
                const result = await updateTasks(updateTasksArray);
                toast(`${result.success ? `${selectedTask.taskId} Updated successfully!` : `${selectedTask.taskId} Updated failed`}`,{
                description: result.message,
            });
            } catch (error) {
                console.error("Failed to update tasks:", error);
            }
        }
    };
        
    return(
        <DropdownMenu
            onOpenChange={(open: boolean) => (open ? onOpen() : onClose())}
        >
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                    <LucideEllipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 poppins">
                <DropdownMenuGroup>
                    {menuItemsArray.map((item) => (
                        <MenuItem 
                            key={item.label} 
                            kind={item.kind}
                            Icon={item.icon}
                            label={item.label}
                            shortcut={item.shortcut}
                        />
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <SubLabelMenu
                        onClickedLabelItem={clickedLabelItem}
                        value={selectedLabel}
                        onValueChange={setSelectedLabel}
                    />
                    <DropdownMenuSeparator />
                    <MenuItem 
                            Icon={Trash}
                            kind='delete'
                            label='Delete'
                            shortcut='⇧⌘Q'
                            className="text-red-500"
                        />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}