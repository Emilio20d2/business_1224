// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, Firestore }from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4z_VJJhUe7Mo6q2a3xcT5b_1s8Y8cj6M",
  authDomain: "business-a68b2.firebaseapp.com",
  projectId: "business-a68b2",
  storageBucket: "business-a68b2.appspot.com",
  messagingSenderId: "1088719835839",
  appId: "1:1088719835839:web:86a15ca7c1c08ad44331e5"
};

// Initialize Firebase
function initializeAppIfNeeded() {
  let app: FirebaseApp;
  let auth: Auth;
  let db: Firestore;

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      if (typeof window !== 'undefined') {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn('Firestore persistence failed: multiple tabs open.');
          } else if (err.code == 'unimplemented') {
            console.warn('Firestore persistence not available in this browser.');
          }
        });
      }
    } catch (error) {
      console.error("Firebase initialization error", error);
      // Ensure we still get the app if it fails mid-init
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

// Export the db and auth instances for use in your application
const { db, auth } = initializeAppIfNeeded();
export { db, auth };
