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

export default function TaskDialog({ hideMobileTrigger = false }: { hideMobileTrigger?: boolean }) {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      status: 'Backlog',
      priority: 'Low',
      label: 'Bug',
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
        // Use TaskInput type which excludes taskId, createdAt, and updatedAt
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open, 'create', null);
      }}
    >
      {/* Desktop Add Task Button */}
      <DialogTrigger asChild>
        <Button
          className="hidden md:inline-flex"
          onClick={() => {
            dispatch(setSelectedTask(null));
            setIsOpen(true);
          }}
        >
          Add New Task
        </Button>
      </DialogTrigger>

      {/* Mobile Plus Icon Button */}
      {!hideMobileTrigger && (
        <DialogTrigger asChild>
          <button
            aria-label="Add task"
            className="inline-flex md:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => {
              dispatch(setSelectedTask(null));
              setIsOpen(true);
            }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
      )}

      <DialogContent
        className="max-w-4xl"
        onOpenAutoFocus={e => {
          e.preventDefault();
          setTimeout(() => {
            const input = document.getElementById('task-title-input') as HTMLInputElement | null;
            input?.focus();
          }, 0);
        }}
        onCloseAutoFocus={e => {
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
