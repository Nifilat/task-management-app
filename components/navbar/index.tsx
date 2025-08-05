'use client';

import { ModeToggle } from '../mode-toggle';
import { Button } from '../ui/button';
import { AppNameLogo } from './AppNameLogo';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const dummyUser = {
  displayName: 'Martin Will-Walker',
  email: 'drake9@example.net',
  profilePhoto: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/35.jpg',
};

export default function Navbar() {
  return (
    <div className="font-sans relative w-full h-[92px] overflow-hidden flex items-center justify-between px-6 border-b">
      <AppNameLogo />
      <div className="flex items-center gap-3 justify-center">
        <Button>Add Task</Button>
        <ModeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              {dummyUser.profilePhoto ? (
                <AvatarImage src={dummyUser.profilePhoto} alt={dummyUser.displayName} />
              ) : (
                <AvatarFallback>
                  {dummyUser.displayName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{dummyUser.displayName}</span>
                <span className="text-xs text-muted-foreground">{dummyUser.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600" onClick={() => alert('Logged out')}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
