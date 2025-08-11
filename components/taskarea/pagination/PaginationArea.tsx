import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationSelection from './PaginationSelection';
import { PaginationAreaProps } from '@/types';

const PaginationArea = ({ table }: PaginationAreaProps) => {
  const { pageIndex } = table.getState().pagination;

  const totalPages = table.getPageCount();

  return (
    <div className="relative w-full overflow-hidden flex justify-between items-center mt-2">
      <span className="text-slate-600 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </span>
      <div className="flex items-center gap-14">
        <PaginationSelection table={table} />
        <div className="flex gap-6 items-center">
          <span className="text-sm font-medium">
            Page {pageIndex + 1} of {totalPages}
          </span>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="size-9 w-12"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-9 w-12"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-9 w-12"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-9 w-12"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationArea;
