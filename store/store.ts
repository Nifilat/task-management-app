import { configureStore } from "@reduxjs/toolkit"
import tasksReducer from '../lib/features/tasks/tasksSlice'
import filtersReducer from "../lib/features/filters/filtersSlice"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["tasks.tasks", "tasks.selectedTask.createdAt"],
        ignoredActionsPaths: ["payload.createdAt", "payload.updatedAt", "meta.arg.createdAt"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
