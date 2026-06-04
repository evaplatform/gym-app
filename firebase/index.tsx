// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1MX4UbL09aX9tLFSrxOw2g6vVyOZArcI",
  authDomain: "august-gym-app.firebaseapp.com",
  projectId: "august-gym-app",
  storageBucket: "august-gym-app.firebasestorage.app",
  messagingSenderId: "799815926380",
  appId: "1:799815926380:web:015b12a1765e73c71f8e49",
  measurementId: "G-LHBB352VHN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

/*
🔹 Quando esse warning aparece?

Se você usar getAuth(app) direto no React Native, o Firebase Auth não sabe onde persistir e cai no modo “memory persistence”.

A correção é justamente usar initializeAuth + getReactNativePersistence.
*/  