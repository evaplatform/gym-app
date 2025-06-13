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
  apiKey: "AIzaSyDs6o63aVp4F0xov_o9dk3vYX2SuTaR9AA",
  authDomain: "gym-app-70ec1.firebaseapp.com",
  projectId: "gym-app-70ec1",
  storageBucket: "gym-app-70ec1.firebasestorage.app",
  messagingSenderId: "531015334456",
  appId: "1:531015334456:web:07668312671ec940f644cd",
  measurementId: "G-F4C1GKX4C5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
