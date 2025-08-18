import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../lib/features/tasks/tasksSlice';
import filtersReducer from '../lib/features/filters/filtersSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'auth/initialize/fulfilled',
          'auth/refreshUser/fulfilled',
        ],

        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],

        ignoredActionsPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
