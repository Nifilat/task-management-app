'use client';

import Image from 'next/image';
import { ModeToggle } from '../mode-toggle';
import TaskDialog from '../task-dialog/TaskDialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/types';
import { DEFAULT_USER } from '@/constants/user';


function AppNameLogo() {
  return (
    <header className="flex items-center gap-2">
      <Image 
        src="/logo.png" 
        width={40} 
        height={40} 
        alt="Task Manager Logo" 
        priority
      />
      <h1 className="font-semibold text-2xl max-md:hidden">
        Task <span className="font-normal text-primary">Manager</span>
      </h1>
    </header>
  );
}

interface UserDropdownProps {
  user: User;
  onLogout?: () => void;
}

function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    onLogout?.();
    // Add your actual logout logic here
    alert('Logged out');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          {user.profilePhoto ? (
            <AvatarImage src={user.profilePhoto} alt={user.displayName} />
          ) : (
            <AvatarFallback>
              {getInitials(user.displayName)}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600" 
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavbarProps {
  user?: User;
  onLogout?: () => void;
}

export default function Navbar({ user = DEFAULT_USER, onLogout }: NavbarProps) {
  return (
    <nav className="font-sans relative w-full h-[92px] overflow-hidden flex items-center justify-between px-6 border-b">
      <AppNameLogo />
      <div className="flex items-center gap-3">
        <TaskDialog />
        <ModeToggle />
        <UserDropdown user={user} onLogout={onLogout} />
      </div>
    </nav>
  );
}