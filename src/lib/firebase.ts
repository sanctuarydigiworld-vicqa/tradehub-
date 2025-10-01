// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-8660039264-bcf77",
  "appId": "1:458115625281:web:dd0ee2d312559ef93e71c0",
  "apiKey": "AIzaSyBdyy82iA0-M1arGRk9IUSKtNt097oiA4s",
  "authDomain": "studio-8660039264-bcf77.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "458115625281"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
