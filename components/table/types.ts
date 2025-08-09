import { Column, Row, Table } from '@tanstack/react-table';
import type { Task } from '@/data/types';
export interface SortableHeaderProps {
  column: Column<Task, unknown>;
  label: string;
}

export interface SelectHeaderProps {
  table: Table<Task>;
}

export interface SelectCellProps {
  row: Row<Task>;
}
