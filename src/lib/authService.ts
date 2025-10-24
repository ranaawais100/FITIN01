import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './firebaseService';

/**
 * Sign up a new user with email and password
 */
export async function signUpUser(email: string, password: string, name?: string, role: 'user' | 'admin' = 'user'): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name if provided
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
    }
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      email,
      name,
      role
    });
    
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Error signing up:', error);
    const errorCode = (error as { code?: string }).code;
    throw new Error(getAuthErrorMessage(errorCode || 'unknown'));
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Error signing in:', error);
    const errorCode = (error as { code?: string }).code;
    throw new Error(getAuthErrorMessage(errorCode || 'unknown'));
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}
