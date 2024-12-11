import {openDB} from "https:unpkg.com/idb?module";
import { 
    addUserToFirebase,
    deleteUserFromFirebase } from "./firebaseDB.js";


document.addEventListener("DOMContentLoaded", function() {
    // Sidenav initialization
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, { edge: "right" });

    syncUsers();
    // Check storage usage
    checkStorageUsage();
});


/*
document.addEventListener("DOMContentLoaded", function() {
    // Login pop up initialization
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
});
*/

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("/serviceworker.js")
    .then((req) => console.log("Service Worker Registered!", req))
    .catch((err) => console.log("Service Worker registration failed", err));
}


// Create indexDB database
async function createDB() {
    const db = await openDB("users", 1, {
        upgrade(db) {
            const store = db.createObjectStore("users", {
                keyPath: "username"
            });
            store.createIndex("status", "status");
            store.createIndex("synced", "synced");
        },
    });
    return db;
}

// Add User
async function addUser(user) {
    const db = await createDB();
    let userId;

    if(navigator.onLine) {
        const saveUser = await addUserToFirebase(user);
        userId = saveUser.id;
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");
        await store.put({...user, id: userId, synced: true });
        await tx.done;
    } else {
        userId = `temp-${Date.now()}`;

        const userToStore = {...user, id: userId, synced: false};

        if(!userToStore.id) {
            console.error("Failed to generate a valid ID for the user.");
            return; // Exit if ID is invalid
        }
        // Start transaction
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        // Add user to store
        await store.add(userToStore);

        // Complete transaction
        await tx.done;
    }

    // Update storage usage
    checkStorageUsage();

    // Return user with ID
    return { ...user, id: userId };
}


// Sync users from indexDB to firebase
async function syncUsers() {
    const db = await createDB();
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");

    // fetch all unsynced users
    const users = await store.getAll();
    await tx.done;

    for (const user of users) {
        if(!user.synced && navigator.onLine)  {
            try{
                const userToSync = {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    password: user.password,
                };

                // send the user to firebase
                const savedUser = await addUserToFirebase(userToSync);

                // replace temporary ID with firebase ID
                const txUpdate = db.transaction("users", "readwrite");
                const storeUpdate = txUpdate.objectStore("users");

                await storeUpdate.delete(user.id)
                await storeUpdate.put({...user, id: savedUser.id, synced: true});
                await txUpdate.done;
            } catch(error) {
                console.error("Error syncing user: ", error);
            }
        }
    }
}



// Delete User
async function deleteUser(username) {
if(!username) {
    console.error("Invalid username passed to deleteUser");
    return;
}

    const db = await createDB();
    if(navigator.onLine) {
        await deleteUserFromFirebase(username);
    }

    // Start transaction
    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");

    try {
        // Delete user by username
        await store.delete(username);
    } catch(error) {
        console.error("Error deleting the task from indexedDB: ", error);
    }
    

    // Complete transaction
    await tx.done;

    // Update storage usage
    checkStorageUsage();
}


// checkStorageUsage function
async function checkStorageUsage() {
    if(navigator.storage && navigator.storage.estimate) {
        const {usage, quota} = await navigator.storage.estimate();

        const usageInMB = (usage / (1024 * 1024)).toFixed(2);
        const quotaInMB = (quota / (1024 * 1024)).toFixed(2);

        console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);

        // Update the UI
        const storageInfo = document.querySelector("#storage-info");
        if(storageInfo) {
            storageInfo.textContent = `Storage used: ${usageInMB} MB of ${quotaInMB} MB`;
        }

        if(usage / quota > 0.8) {
            const storageWarning = document.querySelector("#storage-warning");
            if(storageWarning) {
                storageWarning.textContent = "Warning:  You are running low on data";
                storageWarning.style.display = "block";
            } else {
                const storageWarning = document.querySelector("#storage-warning");
                if(storageWarning) {
                    storageWarning.textContent = "";
                    storageWarning.style.display = "none";
                }
            }
        }
    }
}

/*
// Add Signup Button Listener
const addSignupButton = document.querySelector("#form-signup");

addSignupButton.addEventListener('submit', async () => {
    const firstnameInput = document.querySelector("#firstname");
    const lastnameInput = document.querySelector("#lastname");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    const user = {
        firstname: firstnameInput.value,
        lastname: lastnameInput.value,
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
        status: "pending",
    };

    await addUser(user);

    firstnameInput.value = "";
    lastnameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";

    const modals = document.querySelector("#modal-Signup");
    const instance = M.Modal.getInstance(modals);
    instance.close();
    
});
*/