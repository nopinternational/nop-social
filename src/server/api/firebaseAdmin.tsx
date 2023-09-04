/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import admin from 'firebase-admin'
import { getApp, initializeApp, cert } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase/firestore";

export const adminServiceAccount: ServiceAccount = {
    type: process.env.FIREBASE_A_TYPE,
    project_id: process.env.FIREBASE_A_PROJECT_ID,
    private_key_id: process.env.FIREBASE_A_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_A_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_A_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_A_CLIENT_ID,
    auth_uri: process.env.FIREBASE_A_AUTH_URI,
    token_uri: process.env.FIREBASE_A_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_A_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_A_CLIENT_X509_CERT_URL,
    storage_bucket: process.env.FIREBASE_A_STORAGEBUCKET
};

const ADMIN_APP_NAME = "adminApp";
let adminApp;


// adminApp = firebase.initializeApp({
//     credential: firebase.credential.cert(adminServiceAccount),
// })
console.log("firebaseAdmin: ", admin.apps.length)
if (admin.apps?.length == 0) {
    adminApp = admin.initializeApp(
        {
            credential: cert(adminServiceAccount),
            databaseURL: `https://${adminServiceAccount.project_id}.firebaseio.com`,
        },
        ADMIN_APP_NAME
    );
    console.log("initialize adminApp: ", ADMIN_APP_NAME);
} else {
    console.log("get existing adminApp: ");
    adminApp = admin.app(ADMIN_APP_NAME);
}

console.log("getFirestore from adminapp", adminApp)
export const firestoreAdmin: Firestore = adminApp.firestore()