import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationAreaProps } from '@/types';

const PaginationSelection = ({ table }: PaginationAreaProps) => {
  const { pageSize } = table.getState().pagination;

  return (
    <div className="flex items-center gap-2 min-w-[130px]">
      <span className="text-sm font-medium whitespace-nowrap">Rows Per Page</span>
      <Select value={pageSize.toString()} onValueChange={value => table.setPageSize(Number(value))}>
        <SelectTrigger className="w-[70px] sm:w-[90px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[2, 4, 6, 8, 10, 15, 20, 30].map(size => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaginationSelection;
