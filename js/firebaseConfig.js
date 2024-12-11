import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBatfN_Ef6y10gbUg_bQfcvVSNtJM3usyM",
    authDomain: "inf654-project.firebaseapp.com",
    projectId: "inf654-project",
    storageBucket: "inf654-project.firebasestorage.app",
    messagingSenderId: "793872034340",
    appId: "1:793872034340:web:78cd241baca1fd98c086b1"
    };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };