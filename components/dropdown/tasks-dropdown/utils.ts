import { Task } from "@/data/types";
import { Kind } from "./types";
import { useTasksDataStoreInterface } from "@/hooks/useTasksDataStore";
import { toast } from "sonner";
import { generateRandomThreeDigitNumber } from "@/functions/generateRandomNumber";

export async function handleMenuItemClick(
    kind: Kind,
    tasks: Task[] | null,
    selectedTask: Task | null,
    updateTasks: useTasksDataStoreInterface["updateTasks"],
    
) {
    if(!tasks || !selectedTask) return;

    switch (kind) {
        case "favorite":
            const taskToUpdate: Task = {
                ...selectedTask,
                isFavorite: !selectedTask.isFavorite,
            };
            const updateTasksArray = tasks.map((task) => 
                task.taskId === selectedTask.taskId ? taskToUpdate : task
            );
            const favoriteResult = await updateTasks(updateTasksArray);
            if(!favoriteResult.success) {
                toast("Operation failed",{
                description: "Something went wrong",
            });
            } else {
                toast("Task updated!",{
                description: favoriteResult.message,
            });
            }
            break;
        case "copy":
            const copiedTask: Task = {
                ...selectedTask,
                taskId: `Task-${generateRandomThreeDigitNumber()}`,
                title: `${selectedTask.title} - copy`,
                createdAt: new Date(),
            };
            const addCopiedTask = [...tasks, copiedTask];
            const result = await updateTasks(addCopiedTask, 'copy');
            toast(`${result.success ? "Copied successfully!" : "Copy failed"}`,{
                id: `copy-toast-${copiedTask.taskId}`,
                description: result.message,
            });
            break;
        case "delete":
            const deleteTaskArray = tasks.filter(
                (task) => task.taskId !== selectedTask.taskId
            );
            const deleteResult = await updateTasks(deleteTaskArray, 'delete');
            toast(`${deleteResult.success ? "Deletion successfully!" : "Deletion failed"}`,{
                description: deleteResult.message,
            });
            break;
        default:
            break;
    }
}