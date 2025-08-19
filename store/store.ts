import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../lib/features/tasks/tasksSlice';
import filtersReducer from '../lib/features/filters/filtersSlice';
import authReducer from './authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const tasksPersistConfig = {
  key: 'tasks',
  storage,
  whitelist: ['tasks'],
};

const rootReducer = {
  tasks: persistReducer(tasksPersistConfig, tasksReducer),
  filters: filtersReducer,
  auth: authReducer,
};

export const store = configureStore({
  reducer: {
    ...rootReducer,
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

export const persistor = persistStore(store);
