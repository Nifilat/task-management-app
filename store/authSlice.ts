import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/types/auth';
import { getAvatarUrl } from '@/utils/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  initialized: false,
};

const serializeTimestamp = (timestamp: any): string | null => {
  if (!timestamp) return null;
  if (timestamp?.toDate) return timestamp.toDate().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return null;
};

const deserializeTimestamp = (timestamp: string | null): Date | null => {
  if (!timestamp) return null;
  return new Date(timestamp);
};

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { dispatch }) => {
  const [{ getAuth, onAuthStateChanged }, { getDoc, doc }, { app, db }] = await Promise.all([
    import('firebase/auth'),
    import('firebase/firestore'),
    import('@/config/firebase'),
  ]);

  const auth = getAuth(app);

  return new Promise<AuthUser | null>(resolve => {
    let hasResolved = false;

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (hasResolved) return;
      hasResolved = true;

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const firstName = userData.firstName ?? firebaseUser.displayName?.split(' ')[0] ?? '';
          const lastName =
            userData.lastName ?? firebaseUser.displayName?.split(' ').slice(1).join(' ') ?? '';
          const email = firebaseUser.email ?? userData.email ?? '';
          const profilePhoto =
            userData.profilePhoto ?? firebaseUser.photoURL ?? getAvatarUrl(firstName, lastName);

          const finalUser: AuthUser = {
            uid: firebaseUser.uid,
            firstName,
            lastName,
            email,
            profilePhoto,
            createdAt: deserializeTimestamp(serializeTimestamp(userData.createdAt)),
            updatedAt: deserializeTimestamp(serializeTimestamp(userData.updatedAt)),
          };

          resolve(finalUser);
        } catch (error: any) {
          console.error('Error fetching user data:', error.message);
          dispatch(setError(error.message));
          resolve(null);
        }
      } else {
        resolve(null);
      }

      unsubscribe();
    });
  });
});

export const refreshUserData = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {
      const [{ getAuth }, { getDoc, doc }, { app, db }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        import('@/config/firebase'),
      ]);

      const auth = getAuth(app);
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const firstName = userData.firstName ?? firebaseUser.displayName?.split(' ')[0] ?? '';
      const lastName =
        userData.lastName ?? firebaseUser.displayName?.split(' ').slice(1).join(' ') ?? '';
      const email = firebaseUser.email ?? userData.email ?? '';
      const profilePhoto =
        userData.profilePhoto ?? firebaseUser.photoURL ?? getAvatarUrl(firstName, lastName);

      return {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email,
        profilePhoto,
        createdAt: deserializeTimestamp(serializeTimestamp(userData.createdAt)),
        updatedAt: deserializeTimestamp(serializeTimestamp(userData.updatedAt)),
      } as AuthUser;
    } catch (error: any) {
      console.error('Error refreshing user:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { getAuth, signOut } = await import('firebase/auth');
    const { app } = await import('@/config/firebase');
    const auth = getAuth(app);

    await signOut(auth);
    return null;
  } catch (error: any) {
    console.error('Error signing out:', error);
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize auth';
        state.initialized = true;
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setLoading, setError, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
