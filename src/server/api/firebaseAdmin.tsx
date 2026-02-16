import admin, { type ServiceAccount } from 'firebase-admin';
import { cert } from "firebase-admin/app";
import { type Firestore } from "firebase-admin/firestore";

const validateFirebaseAdminEnv = () => {
    const projectId = process.env.FIREBASE_A_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_A_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_A_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            "Missing Firebase Admin environment variables. Required: FIREBASE_A_PROJECT_ID, FIREBASE_A_CLIENT_EMAIL, FIREBASE_A_PRIVATE_KEY"
        );
    }

    return { projectId, clientEmail, privateKey };
};

const envVars = validateFirebaseAdminEnv();

export const adminServiceAccount: ServiceAccount = {
    projectId: envVars.projectId,
    clientEmail: envVars.clientEmail,
    privateKey: envVars.privateKey.replace(/\\n/g, "\n"),
};

const ADMIN_APP_NAME = "adminApp";

const getAdminApp = () => {
    try {
        return admin.app(ADMIN_APP_NAME);
    } catch {
        return admin.initializeApp(
            {
                credential: cert(adminServiceAccount),
                databaseURL: `https://${adminServiceAccount.projectId || ""}.firebaseio.com`,
            },
            ADMIN_APP_NAME
        );
    }
};

const adminApp = getAdminApp();

export const firestoreAdmin: Firestore = adminApp.firestore();