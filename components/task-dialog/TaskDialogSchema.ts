import { z } from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']),
    priority: z.enum(['Low', 'Medium', 'High']),
    label: z.enum(['Bug', 'Feature', 'Documentation', 'Testing', 'Deployment', 'Refactoring']),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;