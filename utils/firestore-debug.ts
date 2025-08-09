import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Test Firestore connection and permissions
export const testFirestoreConnection = async (userId: string) => {
  console.log('=== FIRESTORE DEBUG TEST ===');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic Firestore connection...');

    // Test 2: Try to write a test document
    console.log('2. Testing write permissions...');
    const testData = {
      test: true,
      timestamp: serverTimestamp(),
      userId: userId,
    };

    await setDoc(doc(db, 'users', userId), testData);
    console.log('✅ Write test successful');

    // Test 3: Try to read the document back
    console.log('3. Testing read permissions...');
    const docSnap = await getDoc(doc(db, 'users', userId));

    if (docSnap.exists()) {
      console.log('✅ Read test successful');
      console.log('Document data:', docSnap.data());
    } else {
      console.log('❌ Document does not exist after write');
    }

    return true;
  } catch (error: any) {
    console.error('❌ Firestore test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED - Check your Firestore security rules!');
      console.error(
        'Your rules should allow authenticated users to read/write to users collection'
      );
      console.error(
        'Example rule: allow read, write: if request.auth != null && request.auth.uid == resource.id;'
      );
    }

    return false;
  }
};

// Check current Firestore security rules (this will help identify the issue)
export const checkFirestoreRules = () => {
  console.log('=== FIRESTORE SECURITY RULES CHECK ===');
  console.log('Please verify your Firestore rules in Firebase Console:');
  console.log('1. Go to Firebase Console > Firestore Database > Rules');
  console.log('2. Your rules should look something like this:');
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
  `);
  console.log('3. Make sure to publish the rules after making changes');
};
