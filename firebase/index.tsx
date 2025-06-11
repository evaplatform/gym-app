// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBkzexvz8_s-lz2T8Cuh3C78pMbwDsCebA",
  authDomain: "gym-app-ffd08.firebaseapp.com",
  projectId: "gym-app-ffd08",
  storageBucket: "gym-app-ffd08.firebasestorage.app",
  messagingSenderId: "1091705449452",
  appId: "1:1091705449452:web:8368d6d40117b27bebeec9",
  measurementId: "G-FDEK2RRFT3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
