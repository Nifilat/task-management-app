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
          <div className="flex items-center gap-2">
            {selectedItems.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <Separator orientation="vertical" className="h-6 border-1 border-gray-300" />
        <Badge variant="secondary">{selectedCount} Selected</Badge>
      </>
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 justify-start border-dashed px-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CirclePlus />
                <span>{title}</span>
              </div>
              {renderBadges()}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 poppins w-52" side="bottom" align="center">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    className="flex justify-between"
                    onSelect={() => updateSelection(item.label)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={selectedItems.includes(item.label as T)} />
                      <item.icon />
                      <span>{item.label}</span>
                    </div>
                    <pre>{item.count}</pre>
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
