import { create } from 'zustand';

interface useOpenDialogStoreInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useOpenDialogStore = create<useOpenDialogStoreInterface>(set => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
