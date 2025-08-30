'use client';

import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TaskFormData, taskFormSchema } from './TaskDialogSchema';
import { useAppDispatch } from '@/hooks';
import {
  addTaskAsync,
  updateTaskAsync,
  setSelectedTask,
  fetchTasksAsync,
} from '@/lib/features/tasks/tasksSlice';
import { useOpenDialogStore } from '@/hooks/useOpenDialogStore';
import { useEffect, useState } from 'react';
import type { TaskInput } from '@/data/types';
import { toast } from 'sonner';

export default function TaskDialog() {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      status: 'Backlog',
      priority: 'Low',
      label: 'Bug',
      description: '',
    },
  });

  const dispatch = useAppDispatch();
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
        description: taskToEdit.description || '',
      });
    } else {
      reset({
        title: '',
        status: 'Backlog',
        priority: 'Low',
        label: 'Bug',
        description: '',
      });
    }
  }, [taskToEdit, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && taskToEdit && user?.uid) {
        const result = await dispatch(
          updateTaskAsync({
            taskId: taskToEdit.taskId,
            updates: {
              ...data,
              userId: user.uid, // Include userId for authentication
            },
          })
        ).unwrap();

        toast(
          result.success
            ? `Task ${taskToEdit.taskId} updated successfully!`
            : `Failed to update task ${taskToEdit.taskId}`,
          { description: result.message }
        );
      } else {
        const newTask: TaskInput = {
          ...data,
          isFavorite: false,
          userId: user?.uid ?? '',
        };
        const result = await dispatch(addTaskAsync(newTask)).unwrap();
        toast(result.message);
      }

      if (user?.uid) await dispatch(fetchTasksAsync(user.uid));

      reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast('Operation failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open, 'create', null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Desktop Add Task Button */}
      <DialogTrigger asChild className="hidden md:inline-flex">
        <Button
          onClick={() => {
            dispatch(setSelectedTask(null));
            setIsOpen(true);
          }}
        >
          Add New Task
        </Button>
      </DialogTrigger>

      {/* Mobile FAB */}
      <DialogTrigger asChild className="md:hidden">
        <button
          aria-label="Add new task"
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => {
            dispatch(setSelectedTask(null));
            setIsOpen(true);
          }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={e => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update and save your changes' : 'Fill in the form to add a task'}
          </DialogDescription>
          <Separator className="mt-3" />
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <TaskTitle />
              </div>
              <TaskStatus />
              <TaskPriority />
              <TaskLabel />
              <div className="md:col-span-2">
                <div className="flex flex-col gap-2">
                  <label className="opacity-75 text-sm font-medium pl-1" htmlFor="task-description">
                    Description
                  </label>
                  <Textarea
                    id="task-description"
                    placeholder="Add more details..."
                    className="min-h-28 px-4 py-3"
                    {...methods.register('description')}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
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
