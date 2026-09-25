import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const fallbackConfig = {
  apiKey: 'AIzaSyBk6tiwsuiAmWaMuf63J5L2D6Ey9eiXErE',
  authDomain: 'chatpilot-7a0d3.firebaseapp.com',
  projectId: 'chatpilot-7a0d3',
  storageBucket: 'chatpilot-7a0d3.firebasestorage.app',
  messagingSenderId: '881291888444',
  appId: '1:881291888444:web:60ed5d479060877b594039',
}

const environmentConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasCompleteEnvironmentConfig = Object.values(environmentConfig).every(Boolean)
const firebaseConfig = hasCompleteEnvironmentConfig ? environmentConfig : fallbackConfig

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()