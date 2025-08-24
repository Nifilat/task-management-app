'use client';

import React from 'react';
import { ModeToggle } from '../mode-toggle';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { getAvatarUrl } from '@/utils/auth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import SessionWarningModal from '@/components/auth/SessionWarningModal';
import { LogOut, Settings, User, Menu as MenuIcon } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

function AppNameLogo() {
  return (
    <div className="flex items-center gap-2" role="img" aria-label="Task Manager logo">
      <Image src="/logo.png" width={40} height={40} alt="Task Manager Logo" priority sizes="40px" />
      <h1 className="font-semibold text-2xl max-md:hidden">
        Task <span className="font-normal text-primary">Manager</span>
      </h1>
    </div>
  );
}

const TaskDialogDynamic = dynamic(() => import('../task-dialog/TaskDialog'), {
  ssr: false,
  loading: () => null,
});

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

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const avatarUrl = user.profilePhoto || getAvatarUrl(user.firstName, user.lastName);

  return (
    <>
      <nav className="relative w-full h-[92px] border-b flex justify-center" aria-label="Primary">
        {/* Container wrapper */}
        <div className="w-full max-w-screen-xl flex items-center justify-between px-6">
          <AppNameLogo />

          <div className="flex items-center gap-3">
            {/* Desktop TaskDialog */}
            <div className="hidden md:block">
              <TaskDialogDynamic />
            </div>

            <div className="hidden md:flex items-center gap-3">
              <ModeToggle />

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

          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground active:bg-muted active:text-muted-foreground transition"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="p-6 flex flex-col gap-6 bg-sidebar text-sidebar-foreground w-full max-w-sm sm:max-w-md"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile navigation menu</SheetTitle>
                <SheetDescription>Open application navigation and actions</SheetDescription>
              </SheetHeader>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                </Avatar>
                <div>
                  <p className="font-semibold">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="mt-4 flex flex-col gap-3">
                <button className="flex items-center gap-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground active:bg-muted active:text-muted-foreground">
                  <User className="h-5 w-5" />
                  Profile
                </button>
                <button className="flex items-center gap-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground active:bg-muted active:text-muted-foreground">
                  <Settings className="h-5 w-5" />
                  Settings
                </button>

                <hr className="border-t border-gray-300 my-2" />

                <button
                  className="flex items-center gap-3 p-3 rounded-md text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </nav>

              {/* Mode toggle at bottom */}
              <div className="mt-auto pt-6 border-t">
                <ModeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Mobile FAB - Only show on mobile, positioned outside nav */}
      <div className="md:hidden">
        <TaskDialogDynamic />
      </div>

      {/* Session Warning Modal */}
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
