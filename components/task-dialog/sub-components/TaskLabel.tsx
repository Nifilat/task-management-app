import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/data/types';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Controller, useFormContext } from 'react-hook-form';
import { labels } from '@/constants/shared';
import { TaskFormData } from '../TaskDialogSchema';

type LabelOption = {
  value: Task['label'];
};

const labelOptions: LabelOption[] = labels.map(label => ({ value: label }));

export default function TaskLabel() {
  const { control } = useFormContext<TaskFormData>();

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity text-sm font-medium">Task Label</Label>
      <Controller
        name="label"
        defaultValue="Bug"
        control={control}
        render={({ field }) => {
          return (
            <Select
              value={field.value}
              onValueChange={(value: TaskFormData['label']) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select a Label..." />
              </SelectTrigger>
              <SelectContent className="poppins">
                <SelectGroup>
                  {labelOptions.map((label, index) => (
                    <SelectItem key={index} value={label.value}>
                      <div className="flex items-center gap-2">
                        <span>{label.value}</span>
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
