import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: "EcoQsXTlKzv0iyaWSEcKfrd74m31eSpaInpWXC03",
    authDomain: "desafio-ppt.firebaseapp",
    databaseURL: "https://desafio-ppt-default-rtdb.firebaseio.com"
});

const rtdb = firebase.database();

export {rtdb};