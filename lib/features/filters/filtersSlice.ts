import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Priority, Status } from '@/data/types';

interface FiltersState {
  checkedPriorities: Priority[];
  checkedStatuses: Status[];
  query: string;
}

const initialState: FiltersState = {
  checkedPriorities: [],
  checkedStatuses: [],
  query: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCheckedPriorities: (state, action: PayloadAction<Priority[]>) => {
      state.checkedPriorities = action.payload;
    },
    setCheckedStatuses: (state, action: PayloadAction<Status[]>) => {
      state.checkedStatuses = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetFilters: state => {
      state.checkedPriorities = [];
      state.checkedStatuses = [];
      state.query = '';
    },
    resetPrioritiesAndStatuses: state => {
      state.checkedPriorities = [];
      state.checkedStatuses = [];
    },
  },
});

export const {
  setCheckedPriorities,
  setCheckedStatuses,
  setQuery,
  resetFilters,
  resetPrioritiesAndStatuses,
} = filtersSlice.actions;

export default filtersSlice.reducer;

// Selectors
export const selectCheckedPriorities = (state: { filters: FiltersState }) =>
  state.filters.checkedPriorities;
export const selectCheckedStatuses = (state: { filters: FiltersState }) =>
  state.filters.checkedStatuses;
export const selectQuery = (state: { filters: FiltersState }) => state.filters.query;
