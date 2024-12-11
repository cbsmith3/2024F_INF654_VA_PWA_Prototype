import { auth, db } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
// Select elements
  const signInForm = document.getElementById("login-form");
  const signUpForm = document.getElementById("sign-up-form");
  const showSignUp = document.getElementById("show-signup");
  const showSignIn = document.getElementById("show-login");
  const signInBtn = document.getElementById("login-btn");
  const SignUpBtn = document.getElementById("sign-up-btn");
  console.log(signInBtn);

  // Show Sign In form and hide Sign Up form
  showSignIn.addEventListener("click", () => {
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });

  // Show Sign Up form and hide Sign In form
  showSignUp.addEventListener("click", () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
  });

  // Sign up new users
  SignUpBtn.addEventListener("click", async () => {
    const firstname = document.getElementById("sign-up-firstname").value;
    const lastname = document.getElementById("sign-up-lastname").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;
    try {
      const authCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(authCredential.user, {
        displayName: firstname,
      });
      const docRef = doc(db, "users", authCredential.user.uid);
      const userProperties = await setDoc(docRef, {
        email: email,
        firstname: firstname,
        lastname: lastname,
      });

      console.log(userProperties);
      M.toast({ html: "Sign up successful!" });
      window.location.href = "/";
      signUpForm.style.display = "none";
      signInForm.style.display = "block";
    } catch (e) {
      M.toast({ html: e.message });
    }
  });

  // Sign in existing users
  signInBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      M.toast({ html: "Login successful!" });
      window.location.href = "/"; // Redirect to home page after successful sign-in
    } catch (e) {
      console.error("Login error: ", e);
      M.toast({ html: e.message });
    }
  });
});