export interface UseSessionTimeoutProps {
  inactivityTimeout?: number;
  warningTime?: number;
}

export interface SessionWarningModalProps {
  isOpen: boolean;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  onExtendSession: () => void;
  onLogout: () => void;
}
