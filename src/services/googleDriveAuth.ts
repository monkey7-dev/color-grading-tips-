import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID ?? '',
  recaptchaSiteKey: import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY ?? '',
};

// Only these fields are required to initialize Firebase Auth.
const REQUIRED_CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

const missingConfig = REQUIRED_CONFIG_KEYS.filter(key => !firebaseConfig[key]);

export const isFirebaseConfigured = missingConfig.length === 0;

if (!isFirebaseConfigured) {
  // Don't throw at module load: that would crash the entire app and render a blank page.
  // Google Drive sync is simply disabled until the config is provided.
  console.warn(`Google Drive sync disabled. Missing Firebase config: ${missingConfig.join(', ')}`);
}

const NOT_CONFIGURED_MESSAGE =
  'Google Drive sync is not configured for this site. Set the VITE_FIREBASE_* environment variables and redeploy.';

// Initialize Firebase App singleton lazily and only when configured
let authInstance: Auth | null = null;
const getFirebaseAuth = (): Auth | null => {
  if (!isFirebaseConfigured) return null;
  if (!authInstance) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
  }
  return authInstance;
};

// Google Drive Scopes
export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token cache (never stored in localStorage for security)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged in from previous session, they will need a fresh interaction to obtain the token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error(NOT_CONFIGURED_MESSAGE);
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Auth credential.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  if (auth) await signOut(auth);
  cachedAccessToken = null;
};
