import { Timestamp } from 'firebase/firestore';

export type Label = 'Bug' | 'Feature' | 'Documentation' | 'Testing' | 'Deployment' | 'Refactoring';
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';

export type TaskService = {
  taskId: string;
  title: string;
  label: Label;
  isFavorite: boolean;
  priority: Priority;
  status: Status;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
};

export type Task = {
  taskId: string;
  title: string;
  label: Label;
  isFavorite: boolean;
  priority: Priority;
  status: Status;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
};

export type TaskDocument = Omit<TaskService, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type TaskInput = Omit<Task, 'taskId' | 'createdAt' | 'updatedAt'>;
export type TaskUpdate = Partial<Task>;
