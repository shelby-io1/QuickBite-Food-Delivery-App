import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB1uBnVFh5HW3uour6LY5EHWM22X6LiTQg',
  authDomain: 'quickbite-food-delivery-2330b.firebaseapp.com',
  projectId: 'quickbite-food-delivery-2330b',
  storageBucket: 'quickbite-food-delivery-2330b.firebasestorage.app',
  messagingSenderId: '805208877371',
  appId: '1:805208877371:web:fd1b02959caa2f9797ef1e',
  measurementId: 'G-9936R20Y2L',
};

let auth;
let db;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization error:', error.message);
}

export { auth, db };
