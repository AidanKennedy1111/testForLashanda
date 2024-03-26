// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGRl7BtsVGPoTvhW0wSfMi6xaiid8wbBs",
  authDomain: "side-ed7d9.firebaseapp.com",
  projectId: "side-ed7d9",
  storageBucket: "side-ed7d9.appspot.com",
  messagingSenderId: "530660665092",
  appId: "1:530660665092:web:7173b4bb1ccf9e0fb81251",
  measurementId: "G-48HML3SFZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, db, auth, googleAuthProvider };