import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseSessionTimeoutProps {
  inactivityTimeout?: number;
  warningTime?: number;
}

export const useSessionTimeout = ({
  inactivityTimeout = 30,
  warningTime = 10,
}: UseSessionTimeoutProps = {}) => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_TIME = inactivityTimeout * 60 * 1000;
  const WARNING_TIME = warningTime * 60 * 1000;

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  const resetTimers = () => {
    // Clear all existing timers
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);

    setShowWarning(false);
    setTimeRemaining(0);

    if (!user) return;

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(warningTime * 60); // seconds

      countdownTimer.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIME - WARNING_TIME);

    inactivityTimer.current = setTimeout(() => {
      handleTimeout();
    }, INACTIVITY_TIME);
  };

  const handleTimeout = async () => {
    setShowWarning(false);
    setTimeRemaining(0);

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);

    await logout();
  };

  const extendSession = () => {
    resetTimers();
  };

  const dismissWarning = () => {
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimers();
  };

  useEffect(() => {
    if (user) {
      events.forEach(event => {
        window.addEventListener(event, resetTimers, true);
      });

      resetTimers();
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimers, true);
      });

      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [user]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeRemaining,
    formatTime,
    extendSession,
    dismissWarning,
  };
};
