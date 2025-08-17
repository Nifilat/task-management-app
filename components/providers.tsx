'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
