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
import { useEffect, useMemo, useState } from 'react';
import type { Task } from '@/data/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function TaskDialog() {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  });

  const { addTask, selectedTask, setSelectedTask, fetchTasks } = useTasksDataStore();

  const { user } = useAuth();

  const { handleSubmit, reset } = methods;

  const { isOpen, setIsOpen } = useOpenDialogStore();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = useMemo(() => Boolean(selectedTask), [selectedTask]);

  // Prefill when editing
  useEffect(() => {
    if (selectedTask) {
      reset({
        title: selectedTask.title,
        status: selectedTask.status,
        priority: selectedTask.priority,
        label: selectedTask.label,
      });
    } else {
      // Optional: set defaults for new task
      reset({
        title: '',
        status: 'Backlog',
        priority: 'Low',
        label: 'Bug',
      });
    }
  }, [selectedTask, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);

    if (isEditing && selectedTask) {
      // Update existing
      try {
        // TODO: Implement task update service call
        toast('Task update feature coming soon!');
        setIsOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.log(error);
        toast('Failed to update the task!', {
          description: 'An unexpected error occurred.',
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Create new
    const newTask: Task = {
      taskId: '',
      title: data.title,
      status: data.status,
      priority: data.priority,
      label: data.label,
      isFavorite: false,
      userId: '',
      createdAt: new Date(),
    };

    try {
      const result = await addTask(newTask, user?.uid ?? '');
      await fetchTasks(user?.uid ?? '');
      toast(
        `${result.success ? `The Task ${newTask.taskId} added successfully!` : 'Failed to add the task!'}`,
        {
          id: `add-toast-${newTask.taskId}`,
          description: result.message,
        }
      );

      if (user?.uid) {
        await fetchTasks(user.uid);
      } // Refresh the tasks list
      reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);

      toast('Failed to add the task!', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // When dialog closes by outside click or close button, clear editing state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedTask(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setSelectedTask(null)}>Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="poppins max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the fields and save your changes'
              : 'Fill in the form to add a task'}
          </DialogDescription>
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
                    {isEditing ? 'Saving Changes...' : 'Adding Task...'}
                  </>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Add New Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
