import { Task } from './types';

export const tasks: Task[] = [
  {
    taskId: 'Task-001',
    title: 'Fix login bug',
    label: 'Bug',
    isFavorite: true,
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date('2025-01-21T10:00:00Z'),
  },
  {
    taskId: 'Task-002',
    title: 'Add dark mode feature',
    label: 'Feature',
    isFavorite: false,
    priority: 'Medium',
    status: 'Todo',
    createdAt: new Date('2025-01-02T12:00:00Z'),
  },
  {
    taskId: 'Task-003',
    title: 'Update API documentation',
    label: 'Documentation',
    isFavorite: false,
    priority: 'Low',
    status: 'Backlog',
    createdAt: new Date('2025-01-03T09:30:00Z'),
  },
];

