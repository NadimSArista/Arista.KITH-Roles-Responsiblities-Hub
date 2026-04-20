// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
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

// 🔐 LOGIN (REDIRECT VERSION)
export async function login() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    alert(error.message);
  }
}

// ✅ HANDLE REDIRECT RESULT (VERY IMPORTANT)
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);

    if (result && result.user) {
      const email = result.user.email;

      if (!isAllowed(email)) {
        alert("Access Denied");
        await signOut(auth);
        return false;
      }

      localStorage.setItem("userLoggedIn", "true");

      // redirect to main page
      window.location.replace("home.html"); // or departments.html if that's your entry

      return true;
    }
  } catch (error) {
    console.error("REDIRECT ERROR:", error);
    alert(error.message);
  }
}

// 🔓 LOGOUT
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("userLoggedIn");
    window.location.replace("index.html");
  } catch (error) {
    console.error(error);
  }
}

// ✅ SIMPLE AUTH CHECK
export function isUserLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

// ✅ CROSS TAB LOGOUT SYNC
window.addEventListener("storage", function (e) {
  if (e.key === "userLoggedIn" && e.newValue === null) {
    window.location.replace("index.html");
  }
});
