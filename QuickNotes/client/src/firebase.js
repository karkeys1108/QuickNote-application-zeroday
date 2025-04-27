import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDg27UDevX36Ep-B7OYmJP793UjK_a5MEk",
  authDomain: "quicknotes-c121b.firebaseapp.com",
  projectId: "quicknotes-c121b",
  storageBucket: "quicknotes-c121b.appspot.com",
  messagingSenderId: "510280563490",
  appId: "1:510280563490:web:ffc7ffba2a6dba9da8837b",
  measurementId: "G-GZQVS4G8PH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
