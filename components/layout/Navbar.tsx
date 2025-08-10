'use client';

import React from 'react';
import { ModeToggle } from '../mode-toggle';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getAvatarUrl } from '@/utils/auth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import SessionWarningModal from '@/components/auth/SessionWarningModal';
import { LogOut, Settings, User } from 'lucide-react';
import TaskDialog from '../task-dialog/TaskDialog';

function AppNameLogo() {
  return (
    <header className="flex items-center gap-2">
      <Image src="/logo.png" width={40} height={40} alt="Task Manager Logo" priority />
      <h1 className="font-semibold text-2xl max-md:hidden">
        Task <span className="font-normal text-primary">Manager</span>
      </h1>
    </header>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showWarning, timeRemaining, formatTime, extendSession } = useSessionTimeout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const avatarUrl = user.profilePhoto || getAvatarUrl(user.firstName, user.lastName);

  return (
    <>
      <div className="relative w-full h-[92px] overflow-hidden flex items-center justify-between px-6 border-b">
        <AppNameLogo />
        <div className="flex items-center gap-3 justify-center">
          <TaskDialog />
          <ModeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-ring transition-all">
                <AvatarImage
                  src={avatarUrl}
                  alt={fullName}
                  onError={() => {
                    console.error('Avatar image failed to load:', avatarUrl);
                  }}
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{fullName}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SessionWarningModal
        isOpen={showWarning}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        onExtendSession={extendSession}
        onLogout={handleLogout}
      />
    </>
  );
}
