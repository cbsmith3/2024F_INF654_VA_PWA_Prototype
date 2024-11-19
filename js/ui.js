import { openDB } from "https:unpkg.com/idb?module";


document.addEventListener("DOMContentLoaded", function() {
    // Sidenav initialization
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, { edge: "right" });

    checkStorageUsage();
});

document.addEventListener("DOMContentLoaded", function() {
    // Login pop up initialization
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
});


if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("/serviceworker.js")
    .then((req) => console.log("Service Worker Registered!", req))
    .catch((err) => console.log("Service Worker registration failed", err));
}


// Create indexDB database
async function createDB() {
    const db = await openDB("userDatabase", 1, {
        upgrade(db) {
            const store = db.createObjectStore("userDatabase", {
                keyPath: "username"
            });
            store.createIndex("status", "status");
        },
    });
    return db;
}

// Add User
async function addUser(user) {
    const db = await createDB();

    // Start transaction
    const tx = db.trancaction("userDatabase", "readwrite");
    const store = tx.objectStore("userDatabase");

    // Add user to store
    await store.add(user);

    // Complete transaction
    await tx.done;

    // Update storage usage
    checkStorageUsage();
}

// Delete User
async function deleteUser(username) {
    const db = await createDB();

    // Start transaction
    const tx = db.transaction("userDatabase", "readwrite");
    const store = tx.objectStore("userDatabase");

    // Delete user by username
    await store.delete(username);

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

// Add Signup Button Listener
const addSignupButton = document.getElementById('form-signup');

addSignupButton.addEventListener('submit', async () => {
    const firstnameInput = document.querySelector("#firstname");
    const lastnameInput = document.querySelector("#lastname");
    const emailInput = document.querySelector("#email");
    const usernameInput = document.querySelector("#username");
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
    usernameInput.value ="";
    passwordInput.value = "";

    const modals = document.querySelector(".modal-Signup");
    const instance = M.Modal.getInstance(modals);
    instance.close();
    
});