import * as admin from "firebase-admin";
import * as serviceAccount from "./key.json";
const databaseURL = process.env.DATABASE_URL || "https://desafio-ppt-default-rtdb.firebaseio.com";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL
});

const firestore = admin.firestore();
const rtdb = admin.database();

export {firestore, rtdb};