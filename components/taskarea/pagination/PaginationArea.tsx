import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationSelection from './PaginationSelection';
import { PaginationAreaProps } from '@/types';

const PaginationArea = ({ table }: PaginationAreaProps) => {
  const { pageIndex } = table.getState().pagination;
  const totalPages = table.getPageCount();

  return (
    <div className="w-full flex flex-wrap justify-between items-center gap-4 mt-2">
      {/* Selected rows info */}
      <span className="text-slate-600 text-sm flex-shrink-0 min-w-[180px]">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </span>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6 flex-grow justify-end">
        <PaginationSelection table={table} />

        {/* Page info */}
        <span className="text-sm font-medium min-w-[140px] text-center">
          Page {pageIndex + 1} of {totalPages}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-9 h-9 p-1"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationArea;
