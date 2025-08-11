'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAvatarUrl } from '@/utils/auth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import SessionWarningModal from '@/components/auth/SessionWarningModal';
import { AppNameLogo, DesktopActions, MobileMenu } from '@/components/navbar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showWarning, timeRemaining, formatTime, extendSession } = useSessionTimeout();

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const avatarUrl = user.profilePhoto || getAvatarUrl(user.firstName, user.lastName);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 🔹 Single source of truth for menu items
  const menuItems = [
    { icon: 'User', label: 'Profile', onClick: () => {} },
    { icon: 'Settings', label: 'Settings', onClick: () => {} },
    'separator',
    { icon: 'LogOut', label: 'Log out', onClick: handleLogout, destructive: true },
  ];

  return (
    <>
      <div className="relative w-full h-[92px] flex items-center justify-between px-6 border-b">
        <AppNameLogo />
        
        {/* Desktop menu */}
        <DesktopActions
          menuItems={menuItems}
          avatarUrl={avatarUrl}
          fullName={fullName}
          email={user.email}
        />

        {/* Mobile menu */}
        <MobileMenu
          menuItems={menuItems}
          avatarUrl={avatarUrl}
          fullName={fullName}
          email={user.email}
        />
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
