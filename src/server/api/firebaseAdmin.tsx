import admin, { type ServiceAccount } from 'firebase-admin';
import { cert } from "firebase-admin/app";
import { type Firestore } from "firebase-admin/firestore";

export const adminServiceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_A_PROJECT_ID,
    clientEmail: process.env.FIREBASE_A_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_A_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const ADMIN_APP_NAME = "adminApp";
let adminApp;

if (admin.apps?.length == 0) {
    adminApp = admin.initializeApp(
        {
            credential: cert(adminServiceAccount),
            databaseURL: `https://${adminServiceAccount.projectId || ""}.firebaseio.com`,
        },
        ADMIN_APP_NAME
    );
} else {
    adminApp = admin.app(ADMIN_APP_NAME);
}

export const firestoreAdmin: Firestore = adminApp.firestore();