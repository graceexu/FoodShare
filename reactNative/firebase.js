import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebase from "firebase/compat/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBr23ox8A13SQmMBsee1zp8iHhODCCqogU",
  authDomain: "foodshare-ae6f0.firebaseapp.com",
  projectId: "foodshare-ae6f0",
  storageBucket: "foodshare-ae6f0.appspot.com",
  messagingSenderId: "730989956155",
  appId: "1:730989956155:web:41e03a4cdac6746107a01e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, firebase };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase