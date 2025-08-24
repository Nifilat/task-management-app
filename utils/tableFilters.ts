import { Task } from '@/data/types';
import { FilterFn } from '@tanstack/react-table';

export const globalTaskSearch: FilterFn<any> = (row, _columnId, filterValue) => {
  if (!filterValue) return true;

  const normalize = (val: string) =>
    String(val)
      .toLowerCase()
      .replace(/[-_\s]/g, '');

  const query = normalize(filterValue);

  const taskId = normalize(row.getValue('taskId'));
  const title = normalize(row.getValue('title'));

  return taskId.includes(query) || title.includes(query);
};

/**
 * Generic filter function for array-based filtering (like priority, status)
 */
const createArrayFilter =
  <T>(columnId?: string): FilterFn<T> =>
  (row, id, filterValue: string[]) => {
    const cellValue: string = row.getValue(columnId || id);
    return filterValue.includes(cellValue);
  };

/**
 * Generic filter function for text-based searching
 * - Case insensitive
 * - Ignores dashes, underscores, and spaces
 */
const createTextFilter =
  <T>(columnId?: string): FilterFn<T> =>
  (row, id, filterValue: string) => {
    const cellValue: string = row.getValue(columnId || id) || '';

    const normalize = (val: string) =>
      String(val)
        .toLowerCase()
        .replace(/[-_\s]/g, '');

    const query = normalize(filterValue);
    const value = normalize(cellValue);
    console.log('Filtering', { columnId: columnId || id, cellValue, filterValue });

    return value.includes(query);
  };

export const priorityFilter: FilterFn<Task> = createArrayFilter<Task>();
export const statusFilter: FilterFn<Task> = createArrayFilter<Task>();

export { createArrayFilter, createTextFilter };
