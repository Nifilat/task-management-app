import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { LoginSchema, RegisterSchema } from './validation/authSchema';

// Utility: Convert image file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fallback Avatar URL (e.g., dicebear initials)
export const getAvatarUrl = (firstName: string, lastName: string) =>
  `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;

// Auth: Login
export const loginUser = async (values: LoginSchema) => {
  return await signInWithEmailAndPassword(auth, values.email, values.password);
};

// Auth: Register
export const registerUser = async (values: RegisterSchema, profileImageFile?: File) => {
  const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);

  const user = userCredential.user;
  let profilePhotoURL = '';

  try {
    if (profileImageFile) {
      // Convert image to base64 instead of uploading to Firebase Storage
      profilePhotoURL = await fileToBase64(profileImageFile);
    } else {
      profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
    }
  } catch (error) {
    console.error('Profile photo conversion failed, using fallback avatar:', error);
    profilePhotoURL = getAvatarUrl(values.firstName, values.lastName);
  }

  // Update Firebase Auth profile (optional)
  await updateProfile(user, {
    photoURL: profilePhotoURL,
  });

  // Save user data to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    profilePhoto: profilePhotoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userCredential;
};
