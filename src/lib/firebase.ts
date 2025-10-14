// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA4z_VJJhUe7Mo6q2a3xcT5b_1s8Y8cj6M",
  authDomain: "business-a68b2.firebaseapp.com",
  projectId: "business-a68b2",
  storageBucket: "business-a68b2.appspot.com",
  messagingSenderId: "1088719835839",
  appId: "1:1088719835839:web:86a15ca7c1c08ad44331e5"
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
