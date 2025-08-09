import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { LoginSchema, RegisterSchema } from './validation/authSchema';
import { testFirestoreConnection, checkFirestoreRules } from './firestore-debug';

// Utility: Convert image file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getAvatarUrl = (firstName: string, lastName: string) =>
  `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;

// Auth: Login
export const loginUser = async (values: LoginSchema) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);

    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email address');
      case 'auth/wrong-password':
        throw new Error('Incorrect password');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later');
      default:
        throw new Error('Login failed. Please check your credentials');
    }
  }
};

// Auth: Register
export const registerUser = async (values: RegisterSchema, profileImageFile?: File) => {
  try {
    console.log('Starting user registration...', { email: values.email });

    checkFirestoreRules();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;

    console.log('User created in Firebase Auth:', user.uid);

    console.log('Testing Firestore connection...');
    const firestoreTest = await testFirestoreConnection(user.uid);

    if (!firestoreTest) {
      throw new Error('Firestore connection test failed. Please check your security rules.');
    }

    let profilePhotoURL = '';

    try {
      if (profileImageFile) {
        console.log('Converting profile image to base64...');

        profilePhotoURL = await fileToBase64(profileImageFile);
        console.log('Profile image converted to base64');
      } else {
        profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
        console.log('Using fallback avatar:', profilePhotoURL);
      }
    } catch (imageError) {
      console.error('Profile photo processing failed, using fallback avatar:', imageError);
      profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
    }

    const userData = {
      uid: user.uid,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      profilePhoto: profilePhotoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('Saving user data to Firestore:', userData);

    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User data saved to Firestore successfully');
    } catch (firestoreError: unknown) {
      console.error('Firestore save error:', firestoreError);

      if (firestoreError && typeof firestoreError === 'object' && 'code' in firestoreError) {
        const firebaseError = firestoreError as { code: string; message: string };
        console.error('Error code:', firebaseError.code);
        console.error('Error message:', firebaseError.message);
        throw new Error(`Failed to save user data: ${firebaseError.message}`);
      } else {
        throw new Error('Failed to save user data: Unknown error occurred');
      }
    }

    try {
      const isBase64 = profilePhotoURL.startsWith('data:image/');
      const authPhotoURL = isBase64
        ? getAvatarUrl(values.firstName, values.lastName)
        : profilePhotoURL;

      await updateProfile(user, {
        displayName: `${values.firstName} ${values.lastName}`,
        photoURL: authPhotoURL,
      });
      console.log('Firebase Auth profile updated');
    } catch (profileError) {
      console.error('Failed to update Firebase Auth profile:', profileError);
    }

    return userCredential;
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled');
      case 'auth/weak-password':
        throw new Error('Password is too weak. Please choose a stronger password');
      case 'permission-denied':
        throw new Error(
          'Permission denied. Please check your Firestore security rules. Make sure authenticated users can write to the users collection.'
        );
      case 'unavailable':
        throw new Error('Firestore is currently unavailable. Please try again later.');
      default:
        throw new Error(error.message || 'Registration failed. Please try again');
    }
  }
};
