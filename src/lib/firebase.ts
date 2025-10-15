
// This file is being deprecated in favor of the more robust `src/firebase/index.ts`
// and its related modules. Please use the `useFirebase`, `useAuth`, `useFirestore` hooks
// from `@/firebase` instead of importing from here.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-8660039264-bcf77",
  appId: "1:458115625281:web:dd0ee2d312559ef93e71c0",
  apiKey: "AIzaSyBdyy82iA0-M1arGRk9IUSKtNt097oiA4s",
  authDomain: "studio-8660039264-bcf77.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "458115625281"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
