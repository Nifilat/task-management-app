'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store/store';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './ui/sonner';
import { PersistGate } from 'redux-persist/integration/react';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default AppProviders;
