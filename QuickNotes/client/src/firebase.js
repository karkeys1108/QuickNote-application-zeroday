import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "Your-API-Key",
  authDomain: "Your-Auth-Domain",
  projectId: "Your-Project-ID",
  storageBucket: "Your-Storage-Bucket",
  messagingSenderId: "Your-Messaging-Sender-ID",
  appId: "Your-App-ID",
  measurementId: "Your-Measurement-ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
