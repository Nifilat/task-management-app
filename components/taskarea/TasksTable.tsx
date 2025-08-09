import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Table } from '@tanstack/react-table';
import { Table as ShadcnTable, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Task } from '@/data/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: Table<Task>;
}

export function TasksTable<TData extends Task, TValue>({
  columns,
  table,
}: DataTableProps<TData, TValue>) {

  return (
    <div className="rounded-md border mt-2">
      <ShadcnTable>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}

                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ): (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results available.
      </TableCell>
    </TableRow>
  )}
</TableBody>
      </ShadcnTable>
    </div>
  );
}
