'use client';

import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Checkbox } from '../ui/checkbox';
import { FilterDropdownProps } from './types';

function FilterDropdown<T extends string>({
  title,
  placeholder,
  items,
  selectedItems,
  onSelectionChange,
  maxDisplayBadges = 2,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const updateSelection = (itemLabel: string) => {
    const item = itemLabel as T;
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];

    onSelectionChange(newSelection);
  };

  const renderBadges = () => {
    const selectedCount = selectedItems.length;

    if (selectedCount === 0) return null;

    if (selectedCount <= maxDisplayBadges) {
      return (
        <>
          <Separator orientation="vertical" className="h-6 border-1 border-gray-300" />
          <div className="flex items-center gap-1 sm:gap-2">
            {selectedItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1 sm:px-2">
                <span className="truncate max-w-[60px] sm:max-w-none">{item}</span>
              </Badge>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <Separator orientation="vertical" className="h-6 border-1 border-gray-300" />
        <Badge variant="secondary" className="text-xs px-1 sm:px-2">
          {selectedCount} Selected
        </Badge>
      </>
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 justify-start border-dashed px-2 sm:px-5 min-w-0"
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <CirclePlus className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{title}</span>
              </div>
              <div className="min-w-0 overflow-hidden">{renderBadges()}</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-64 sm:w-72"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions={true}
          collisionPadding={8}
        >
          <Command>
            <CommandInput placeholder={placeholder} className="text-sm" />
            <CommandList className="max-h-64">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    className="flex justify-between items-center py-2"
                    onSelect={() => updateSelection(item.label)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={selectedItems.includes(item.label as T)}
                        className="flex-shrink-0"
                      />
                      <div className="flex-shrink-0">
                        <item.icon />
                      </div>
                      <span className="truncate flex-1 text-sm">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded ml-2 flex-shrink-0">
                      {item.count}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default FilterDropdown;
