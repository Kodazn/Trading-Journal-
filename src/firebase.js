import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL3TfYf5d-5BSi4xn0Ol54HzIk3sJ8wzY",
  authDomain: "trading-journal-b617e.firebaseapp.com",
  projectId: "trading-journal-b617e",
  storageBucket: "trading-journal-b617e.firebasestorage.app",
  messagingSenderId: "20036588928",
  appId: "1:20036588928:web:c6cedfcf6af4db700e1d65",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
