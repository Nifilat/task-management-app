// components/auth/SessionWarningModal.tsx
'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionWarningModalProps {
  isOpen: boolean;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  onExtendSession: () => void;
  onLogout: () => void;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  timeRemaining,
  formatTime,
  onExtendSession,
  onLogout,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>Your session has been inactive for a while.</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Time remaining: {formatTime(timeRemaining)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You will be automatically logged out when the timer reaches zero.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel
            onClick={onLogout}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Logout Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={onExtendSession} className="bg-blue-600 hover:bg-blue-700">
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionWarningModal;
