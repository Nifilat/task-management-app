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
import { labelConfig } from '@/constants/shared';
import { TaskFormData } from '../TaskDialogSchema';

const labelOptions = Object.values(labelConfig);

export default function TaskLabel() {
  const { control } = useFormContext<TaskFormData>();

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity text-sm font-medium pl-1">Task Label</Label>
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
              <SelectContent>
                <SelectGroup>
                  {labelOptions.map(labelOption => {
                    const Icon = labelOption.icon;
                    return (
                      <SelectItem key={labelOption.value} value={labelOption.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: labelOption.color }}
                          />
                          <Icon size={16} style={{ color: labelOption.color }} />
                          <span>{labelOption.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
}
