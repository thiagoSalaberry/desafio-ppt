"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
var databaseURL = process.env.DATABASE_URL || "https://desafio-ppt-default-rtdb.firebaseio.com";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
