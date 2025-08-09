import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import TaskLabel from "./sub-components/TaskLabel";
import TaskPriority from "./sub-components/TaskPriority";
import TaskStatus from "./sub-components/TaskStatus";
import TaskTitle from "./sub-components/TaskTitle";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskFormSchema } from "./TaskDialogSchema";
import { useTasksDataStore } from "@/hooks/useTasksDataStore";
import { useOpenDialogStore } from "@/hooks/useOpenDialogStore";
import { useState } from "react";
import { generateRandomThreeDigitNumber } from "@/functions/generateRandomNumber";
import { Task } from "@/data/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


export default function TaskDialog(){
    const methods = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
    });

    const { addTask } = useTasksDataStore();

    const { handleSubmit, reset } = methods;

    const { isOpen, setIsOpen } = useOpenDialogStore();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: TaskFormData) => {
        setIsLoading(true);

        const newTask: Task = {
            taskId: `Task-${generateRandomThreeDigitNumber()}`,
            title: data.title,
            status: data.status,
            priority: data.priority,
            label: data.label,
            isFavorite: false,
            createdAt: new Date(),
        };

        try {
            const result = await addTask(newTask);
            toast(`${result.success ? `The Task ${newTask.taskId} Added successfully!` : "Failed to add the task!"}`,{
                id: `add-toast-${newTask.taskId}`,
                description: result.message,
            });

            reset();
            setIsOpen(false);
        } catch (error) {
            console.log(error);

            toast("Failed to add the task!",{
                description: "An unexpected error occured.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add New Task</Button>
            </DialogTrigger>
            <DialogContent className="poppins max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Task</DialogTitle>
                    <DialogDescription>Fill in the form to add a task</DialogDescription>
                    <div className="mt-4">
                        <Separator className="mt-3" />
                    </div>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-8">
                            <div className="grid grid-cols-2 gap-5">
                                <TaskTitle />
                                <TaskStatus />
                            </div>
                            <div className="grid grid-cols-2 gap-5 mt-6">
                                <TaskPriority />
                                <TaskLabel />
                            </div>
                        </div>
                        <DialogFooter className="mb-4 mt-9">
                            <DialogClose asChild>
                                <Button type="button" variant={'secondary'} className="px-9">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding Task...
                                    </>
                                ) : (
                                    "Add new Task"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}