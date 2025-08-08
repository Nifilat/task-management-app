import React from 'react';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { PlusCircleIcon } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { GenericDropdownProps } from './types';

const Dropdown: React.FC<GenericDropdownProps> = ({
  items,
  selectedItem,
  onSelectedItemChange,
  title,
  placeholder,
  groupHeading,
  badges,
}) => {
  const [open, setOpen] = React.useState(false);

  console.log(selectedItem);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 justify-start border-dashed px-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                <span>{title}</span>
              </div>

              <Separator orientation="vertical" className="h-6 border-1 border-gray-300" />

              <div className="flex items-center gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} variant={'secondary'}>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-0" side="bottom" align="center">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>

              <CommandGroup heading={groupHeading}>
                {items.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      className="flex justify-between"
                      onSelect={value => {
                        const foundItem = items.find(i => i.value === value) || null;
                        onSelectedItemChange(foundItem);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox />
                        <IconComponent className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <span>23</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Dropdown;
