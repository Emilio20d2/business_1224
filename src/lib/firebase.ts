
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4z_VJJhUe7Mo6q2a3xcT5b_1s8Y8cj6M",
  authDomain: "studio-4902578709-bd4a7.firebaseapp.com",
  projectId: "studio-4902578709-bd4a7",
  storageBucket: "studio-4902578709-bd4a7.appspot.com",
  messagingSenderId: "778074465222",
  appId: "1:778074465222:web:9c57927ff0648908a348c7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
