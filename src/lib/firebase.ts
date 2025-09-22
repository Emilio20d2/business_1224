// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4z_VJJhUe7Mo6q2a3xcT5b_1s8Y8cj6M",
  authDomain: "studio-4902578709-bd4a7.firebaseapp.com",
  projectId: "studio-4902578709-bd4a7",
  storageBucket: "studio-4902578709-bd4a7.appspot.com",
  messagingSenderId: "778074465222",
  appId: "1:778074465222:web:9c57927ff0648908a348c7"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore with persistence disabled
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
});


export { app, db };
