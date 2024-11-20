
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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

// Add a User
export async function addUserToFirbase(user) {
    try {
        const docRef = await addDoc(collection(db, "users"), user);
        return {id: docRef.id, ...user};
    } catch(error) {
        console.error("Error adding user: ", error);
    }
}