'use client';

import React from 'react';
import { ModeToggle } from '../mode-toggle';
import { Button } from '../ui/button';
import { AppNameLogo } from '../navbar/AppNameLogo';
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
          <Button>Add Task</Button>
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
