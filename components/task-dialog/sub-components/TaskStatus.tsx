import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/data/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowUpCircle, CheckCircle2, Circle, HelpCircle, LucideIcon, XCircle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { TaskFormData } from "../TaskDialogSchema";

type Status = {
    value: Task["status"];
    icon: LucideIcon
}

const statuses: Status[] = [
    {
        value:"Backlog",
        icon: HelpCircle,
    },
    {
        value:"Todo",
        icon: Circle,
    },
    {
        value:"In Progress",
        icon: ArrowUpCircle,
    },
    {
        value:"Done",
        icon: CheckCircle2,
    },
    {
        value:"Canceled",
        icon: XCircle,
    },
];

export default function TaskStatus() {
    const { control } = useFormContext<TaskFormData>();

    return (
        <div className="flex flex-col gap-2">
            <Label className="opacity text-sm font-medium">Task Status</Label>
            <Controller
                name="status"
                defaultValue="Backlog"
                control={control}
                render={({ field }) => {
                    return ( 
                        <Select
                            value={field.value}
                            onValueChange={(value: TaskFormData["status"]) => {
                                field.onChange(value)
                            }}
                        >
                            <SelectTrigger className="w-full h-11">
                                <SelectValue placeholder="Select a status..." />
                            </SelectTrigger>
                            <SelectContent className="poppins">
                                <SelectGroup>
                                    {statuses.map((status, index) => (
                                        <SelectItem key={index} value={status.value}>
                                            <div className="flex items-center gap-2">
                                                <status.icon size={15} />
                                                <span>{status.value}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    );
                }}
            />
        </div>
    )
}