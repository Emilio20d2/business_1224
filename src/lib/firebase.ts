
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration is now loaded directly from Next.js environment variables.
// Next.js automatically handles loading from .env.local (for specific projects)
// or .env (for the base project), making the configuration dynamic and secure.
export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


// Initialize Firebase
function initializeAppIfNeeded(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    } else {
        return getApp();
    }
}

export const app = initializeAppIfNeeded();
