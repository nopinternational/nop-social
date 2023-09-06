
import admin, { type ServiceAccount } from 'firebase-admin'
import { getApp, initializeApp, cert } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

export const adminServiceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_A_PROJECT_ID,
    clientEmail: process.env.FIREBASE_A_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_A_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const otherProps = {
    type: process.env.FIREBASE_A_TYPE,
    private_key_id: process.env.FIREBASE_A_PRIVATE_KEY_ID,
    client_id: process.env.FIREBASE_A_CLIENT_ID,
    auth_uri: process.env.FIREBASE_A_AUTH_URI,
    token_uri: process.env.FIREBASE_A_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_A_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_A_CLIENT_X509_CERT_URL,
    storage_bucket: process.env.FIREBASE_A_STORAGEBUCKET

}
const ADMIN_APP_NAME = "adminApp";
let adminApp;


// adminApp = firebase.initializeApp({
//     credential: firebase.credential.cert(adminServiceAccount),
// })
//console.log("firebaseAdmin: ", admin.apps.length)
if (admin.apps?.length == 0) {
    adminApp = admin.initializeApp(
        {
            credential: cert(adminServiceAccount),
            databaseURL: `https://${adminServiceAccount.projectId || ""}.firebaseio.com`,
        },
        ADMIN_APP_NAME
    );
    console.log("initialize adminApp: ", ADMIN_APP_NAME);
} else {
    console.log("get existing adminApp: ");
    adminApp = admin.app(ADMIN_APP_NAME);
}

// console.log("getFirestore from adminapp", adminApp)
export const firestoreAdmin: Firestore = adminApp.firestore()