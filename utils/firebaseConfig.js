// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "jash-startups.firebaseapp.com",
  projectId: "jash-startups",
  storageBucket: "jash-startups.appspot.com",
  messagingSenderId: "157170711011",
  appId: "1:157170711011:web:f48f2901a447cc1b4c08d6",
  measurementId: "G-R8GE2L84P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const storage = getStorage(app);
