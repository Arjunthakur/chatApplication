import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDc3XiY-qT8EtWYK69PKF8x3SRqXQ25mBI",
    authDomain: "chat-application-2f1e4.firebaseapp.com",
    projectId: "chat-application-2f1e4",
    storageBucket: "chat-application-2f1e4.appspot.com",
    messagingSenderId: "373342486855",
    appId: "1:373342486855:web:d08148478c3c11fcc98c62"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };