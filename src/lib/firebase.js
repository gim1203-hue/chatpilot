import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBk6tiwsuiAmWaMuf63J5L2D6Ey9eiXErE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'chatpilot-7a0d3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'chatpilot-7a0d3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'chatpilot-7a0d3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '881291888444',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:881291888444:web:60ed5d479060877b594039',
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()