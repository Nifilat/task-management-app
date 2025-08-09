'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { AuthUser, AuthContextType } from '@/types/auth';
import { getAvatarUrl } from '@/utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('Auth state changed - user found:', firebaseUser.uid);

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const firstName = userData.firstName ?? firebaseUser.displayName?.split(' ')[0] ?? '';
          const lastName = userData.lastName ?? firebaseUser.displayName?.split(' ').slice(1).join(' ') ?? '';
          const email = firebaseUser.email ?? userData.email ?? '';
          const profilePhoto =
            userData.profilePhoto ??
            firebaseUser.photoURL ??
            getAvatarUrl(firstName, lastName);

          const finalUser: AuthUser = {
            uid: firebaseUser.uid,
            firstName,
            lastName,
            email,
            profilePhoto,
            createdAt: userData.createdAt ?? null,
            updatedAt: userData.updatedAt ?? null,
          };

          console.log('Loaded user data:', finalUser);
          setUser(finalUser);
        } catch (error: any) {
          console.error('Error fetching user data:', error.message);
          setUser(null);
        }
      } else {
        console.log('No user found on auth state change');
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;