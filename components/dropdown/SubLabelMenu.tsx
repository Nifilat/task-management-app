// SubLabelMenu.tsx
import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag } from 'lucide-react';
import { labelConfig } from '@/constants/shared';
import { SubLabelMenuProps } from './types';

export function SubLabelMenu({ value, onValueChange, onClickedLabelItem }: SubLabelMenuProps) {
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    onClickedLabelItem(newValue);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Tag className="mr-2 h-4 w-4" />
        <span>Label</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
            {Object.values(labelConfig).map(labelOption => {
              const Icon = labelOption.icon;
              return (
                <DropdownMenuRadioItem key={labelOption.value} value={labelOption.value}>
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: labelOption.color }}
                    />
                    <Icon size={16} style={{ color: labelOption.color }} />
                    <span>{labelOption.label}</span>
                  </div>
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
