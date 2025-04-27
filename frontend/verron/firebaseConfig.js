// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPzdgSReLrC5aefwTgNteCAwPiY1bfYJ8",
  authDomain: "snayly-71706.firebaseapp.com",
  projectId: "snayly-71706",
  storageBucket: "snayly-71706.firebasestorage.app",
  messagingSenderId: "464852191169",
  appId: "1:464852191169:web:fe3ab220ada3572bff9140"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };