// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔐 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAuK6khpaCk30axVzPp6jqdWfECFgAGLXY",
  authDomain: "arista-roles-hub.firebaseapp.com",
  projectId: "arista-roles-hub",
  storageBucket: "arista-roles-hub.firebasestorage.app",
  messagingSenderId: "771103191015",
  appId: "1:771103191015:web:a6a163ad206253891c5742"
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ KEEP SESSION
setPersistence(auth, browserLocalPersistence);

// ✅ DOMAIN CHECK
function isAllowed(email) {
  return (
    email.endsWith("@aristasystems.in") ||
    email.endsWith("@kithnyc.com")
  );
}

// 🔐 LOGIN
export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!isAllowed(email)) {
      alert("Access Denied");
      await signOut(auth);
      return false;
    }

    // ✅ Store session locally (fast + stable)
    localStorage.setItem("userLoggedIn", "true");

    return true;

  } catch (error) {
    console.error(error);
    alert("Login failed");
    return false;
  }
}

// 🔓 LOGOUT (FIXED - NO CROSS TAB NAV ISSUE)
export async function logout() {
  try {
    await signOut(auth);

    // ✅ Clear session
    localStorage.removeItem("userLoggedIn");

    // ✅ Redirect ONLY this tab safely
    window.location.replace("index.html");

  } catch (error) {
    console.error(error);
  }
}

// ✅ SIMPLE AUTH CHECK
export function isUserLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

// ✅ OPTIONAL: Cross-tab logout sync ONLY (SAFE)
window.addEventListener("storage", function (e) {
  if (e.key === "userLoggedIn" && e.newValue === null) {
    // logout triggered in another tab
    window.location.replace("index.html");
  }
});
