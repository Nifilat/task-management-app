'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Separator } from '../ui/separator';
import TaskLabel from './sub-components/TaskLabel';
import TaskPriority from './sub-components/TaskPriority';
import TaskStatus from './sub-components/TaskStatus';
import TaskTitle from './sub-components/TaskTitle';
import { useAuth } from '@/hooks/useAuth';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TaskFormData, taskFormSchema } from './TaskDialogSchema';
import { useTasksDataStore } from '@/hooks/useTasksDataStore';
import { useOpenDialogStore } from '@/hooks/useOpenDialogStore';
import { useEffect, useState } from 'react';
import type { Task } from '@/data/types';
import { toast } from 'sonner';

export default function TaskDialog() {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      status: 'Backlog',
      priority: 'Low',
      label: 'Bug',
    },
  });

  const { addTask, updateTask, setSelectedTask, fetchTasks } = useTasksDataStore();
  const { user } = useAuth();
  const { handleSubmit, reset } = methods;
  const { taskToEdit, mode, isOpen, setIsOpen } = useOpenDialogStore();
  const isEditing = mode === 'edit';
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        label: taskToEdit.label,
      });
    } else {
      reset({
        title: '',
        status: 'Backlog',
        priority: 'Low',
        label: 'Bug',
      });
    }
  }, [taskToEdit, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && taskToEdit && user?.uid) {
        const result = await updateTask(taskToEdit.taskId, data);
        toast(
          result.success
            ? `Task ${taskToEdit.taskId} updated successfully!`
            : `Failed to update task ${taskToEdit.taskId}`,
          { description: result.message }
        );
      } else {
        const newTask: Task = {
          taskId: '',
          ...data,
          isFavorite: false,
          userId: user?.uid ?? '',
          createdAt: new Date(),
        };
        const result = await addTask(newTask);
        toast(result.message);
      }

      if (user?.uid) await fetchTasks(user.uid);

      reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast('Operation failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open, 'create', null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedTask(null);
            setIsOpen(true);
          }}
        >
          Add New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update and save your changes' : 'Fill in the form to add a task'}
          </DialogDescription>
          <Separator className="mt-3" />
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-8 grid grid-cols-2 gap-5">
              <TaskTitle />
              <TaskStatus />
              <TaskPriority />
              <TaskLabel />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>{isEditing ? 'Saving...' : 'Adding...'}</>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Add Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
