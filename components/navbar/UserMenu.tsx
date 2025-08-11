import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}

interface UserMenuProps {
  avatarUrl: string;
  fullName: string;
  email: string;
  menuItems: (MenuItem | 'separator')[];
}

export default function UserMenu({ avatarUrl, fullName, email, menuItems }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-ring transition-all">
          <AvatarImage src={avatarUrl} alt={fullName} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{fullName}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) =>
          item === 'separator' ? (
            <DropdownMenuSeparator key={index} />
          ) : (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className={item.destructive ? 'text-red-500' : ''}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}


              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
