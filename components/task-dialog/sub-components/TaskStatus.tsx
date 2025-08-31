import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Controller, useFormContext } from 'react-hook-form';
import { statuses } from '@/constants/shared';
import { TaskFormData } from '../TaskDialogSchema';

export default function TaskStatus() {
  const { control } = useFormContext<TaskFormData>();

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity text-sm font-medium pl-1">Task Status</Label>
      <Controller
        name="status"
        defaultValue="Backlog"
        control={control}
        render={({ field }) => {
          return (
            <Select
              value={field.value}
              onValueChange={(value: TaskFormData['status']) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select a status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statuses.map((status, index) => (
                    <SelectItem key={index} value={status.value}>
                      <div className="flex items-center gap-2">
                        <status.icon size={15} />
                        <span>{status.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
}
