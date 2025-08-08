import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/config/firebase';
import { LoginSchema, RegisterSchema } from './validation/authSchema';
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

// Utility: Upload image to Firebase Storage
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `profile-images/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image');
  }
};

// Fallback Avatar URL (e.g., dicebear initials)
export const getAvatarUrl = (firstName: string, lastName: string) =>
  `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;

// Auth: Login
export const loginUser = async (values: LoginSchema) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Provide user-friendly error messages
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
    
    // Check Firestore rules first
    checkFirestoreRules();
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
    const user = userCredential.user;
    
    console.log('User created in Firebase Auth:', user.uid);
    
    // Test Firestore connection with the new user
    console.log('Testing Firestore connection...');
    const firestoreTest = await testFirestoreConnection(user.uid);
    
    if (!firestoreTest) {
      throw new Error('Firestore connection test failed. Please check your security rules.');
    }

    let profilePhotoURL = '';

    try {
      if (profileImageFile) {
        console.log('Uploading profile image...');
        // Upload image to Firebase Storage and get URL
        profilePhotoURL = await uploadProfileImage(profileImageFile, user.uid);
        console.log('Profile image uploaded:', profilePhotoURL);
      } else {
        // Use fallback avatar
        profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
        console.log('Using fallback avatar:', profilePhotoURL);
      }
    } catch (imageError) {
      console.error('Profile photo upload failed, using fallback avatar:', imageError);
      profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
    }

    // Save user data to Firestore FIRST
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
    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      console.error('Error code:', firestoreError.code);
      console.error('Error message:', firestoreError.message);
      throw new Error(`Failed to save user data: ${firestoreError.message}`);
    }

    // Update Firebase Auth profile AFTER Firestore save
    try {
      await updateProfile(user, {
        displayName: `${values.firstName} ${values.lastName}`,
        photoURL: profilePhotoURL,
      });
      console.log('Firebase Auth profile updated');
    } catch (profileError) {
      console.error('Failed to update Firebase Auth profile:', profileError);
      // Don't throw error here as Firestore data is already saved
    }
    

    return userCredential;
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide user-friendly error messages
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
        throw new Error('Permission denied. Please check your Firestore security rules. Make sure authenticated users can write to the users collection.');
      case 'unavailable':
        throw new Error('Firestore is currently unavailable. Please try again later.');
      default:
        throw new Error(error.message || 'Registration failed. Please try again');
    }
  }
};