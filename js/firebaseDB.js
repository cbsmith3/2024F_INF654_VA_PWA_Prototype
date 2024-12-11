
// Import the functions you need from the SDKs you need
import { currentUser } from "./auth.js";
import { db } from "./firebaseConfig.js";
import { 
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

// Add a User
export async function addUserToFirebase(user) {
    try {
        const docRef = await addDoc(collection(db, "users"), user);
        return {id: docRef.id, ...user};
    } catch(error) {
        console.error("Error adding user: ", error);
    }
}


// Get a User
export async function getUser() {
  const users = [];
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      users.push({id: doc.id, ...doc.data()});
    });
  } catch(error) {
    console.error("Error retrieving user: ", error);
  }
  return users;
}

// Delete User
export async function deleteUserFromFirebase(id) {
  try{
    await deleteDoc(doc(db, "users", id));
  } catch(error) {
    console.error("Error deleting user: ", error);
  }
}

// Update User
export async function updateUser(id, updatedData) {
  try{
    const taskRef = doc(db, "users", id);
    await updateDoc(taskRef, updatedData);
  } catch(error) {
    console.error("Error updating user: ", error);
  }
}