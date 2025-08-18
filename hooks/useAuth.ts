import { useCallback, useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { initializeAuth, refreshUserData, logoutUser, clearError } from '@/store/authSlice';
import type { AuthUser } from '@/types/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAuthError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const { user, loading, error, initialized } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    try {
      await dispatch(refreshUserData()).unwrap();
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    logout,
    refreshUser,
    clearAuthError,
  };
};
