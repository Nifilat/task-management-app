export type Label = 'Bug' | 'Feature' | 'Documentation' | 'Testing' | 'Deployment' | 'Refactoring';
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';

export type Task = {
  taskId: string;
  title: string;
  label: Label;
  isFavorite: boolean;
  priority: Priority;
  status: Status;
  createdAt: Date;
};
