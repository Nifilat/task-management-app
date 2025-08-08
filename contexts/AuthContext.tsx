'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { AuthUser, AuthContextType } from '@/types/auth';
import { getAvatarUrl } from '@/utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Ensure we have all required fields
            const firstName = userData.firstName || '';
            const lastName = userData.lastName || '';
            const profilePhoto = userData.profilePhoto || getAvatarUrl(firstName, lastName);

            setUser({
              uid: firebaseUser.uid,
              firstName,
              lastName,
              email: firebaseUser.email || userData.email || '',
              profilePhoto,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            });
          } else {
            // Fallback if Firestore document doesn't exist
            const firstName = firebaseUser.displayName?.split(' ')[0] || '';
            const lastName = firebaseUser.displayName?.split(' ')[1] || '';

            setUser({
              uid: firebaseUser.uid,
              firstName,
              lastName,
              email: firebaseUser.email || '',
              profilePhoto: firebaseUser.photoURL || getAvatarUrl(firstName, lastName),
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
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
