import { firebaseConfig } from "./firebase.config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import "firebase/auth";

const FIREBASE_APP_NAME  = "firebaseApp";

const firebaseApp = initializeApp(firebaseConfig, FIREBASE_APP_NAME);

export const auth =  getAuth(firebaseApp);
export const firestoreFoo = getFirestore(firebaseApp);
