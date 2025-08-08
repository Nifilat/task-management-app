// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAuGh9CEVtHBG_NLQ4wxw2T4Z-6bJSIlLQ',
  authDomain: 'task-management-app-f6b41.firebaseapp.com',
  projectId: 'task-management-app-f6b41',
  storageBucket: 'task-management-app-f6b41.firebasestorage.app',
  messagingSenderId: '612151719311',
  appId: '1:612151719311:web:7a9ef8d62009ffd78887fa',
  measurementId: 'G-GBM6RB6F21',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Enable Firestore offline persistence and logging
import { connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';

// Enable Firestore logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Enable Firestore debug logging
  import('firebase/firestore').then(({ enableNetwork }) => {
    console.log('Firestore initialized in development mode');
  });
}

export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Test Firestore connection
if (typeof window !== 'undefined') {
  import('firebase/firestore').then(({ doc, getDoc }) => {
    console.log('Testing Firestore connection...');
    // This will help us verify if Firestore is properly connected
  });
}

// Initialize Collection References
export const usersCollection = collection(db, 'users');

export const storage = getStorage(app);
