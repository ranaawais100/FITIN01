import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfNOi42A_vlmt1hG0siqpcySA4D1WbDX0",
  authDomain: "fitin-bc463.firebaseapp.com",
  projectId: "fitin-bc463",
  storageBucket: "fitin-bc463.firebasestorage.app",
  messagingSenderId: "508127970189",
  appId: "1:508127970189:web:8afd9e7505db9891e133c4",
  measurementId: "G-GVVRGNWK2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
