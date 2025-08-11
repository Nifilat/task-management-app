import { create } from 'zustand';
import { Task } from '@/data/types';

interface useOpenDialogStoreInterface {
  isOpen: boolean;
  mode: 'create' | 'edit';
  taskToEdit?: Task | null;
  setIsOpen: (isOpen: boolean, mode?: 'create' | 'edit', task?: Task | null) => void;
}

export const useOpenDialogStore = create<useOpenDialogStoreInterface>(set => ({
  isOpen: false,
  mode: 'create',
  taskToEdit: null,
  setIsOpen: (isOpen, mode = 'create', task = null) => set({ isOpen, mode, taskToEdit: task }),
}));
