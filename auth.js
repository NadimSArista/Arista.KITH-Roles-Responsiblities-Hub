// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged
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

// 🌍 Language
auth.useDeviceLanguage();

// ✅ PERSISTENCE (IMPORTANT FIX)
await setPersistence(auth, browserLocalPersistence);

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
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
  }
}

// 🔥 HANDLE REDIRECT + SESSION (FINAL STABLE VERSION)
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);

    // ✅ Case 1: Redirect login
    if (result?.user) {
      const email = result.user.email;

      if (!isAllowed(email)) {
        await signOut(auth);
        return false;
      }

      localStorage.setItem("userLoggedIn", "true");
      return true;
    }

    // ✅ Case 2: Wait for auth state (CRITICAL FIX)
    return new Promise((resolve) => {
      let resolved = false;

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (resolved) return;

        resolved = true;
        unsubscribe();

        if (user) {
          localStorage.setItem("userLoggedIn", "true");
          resolve(true);
        } else {
          resolve(false);
        }
      });

      // ⛑️ SAFETY TIMEOUT (prevents infinite waiting)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          unsubscribe();
          resolve(false);
        }
      }, 3000);
    });

  } catch (error) {
    console.error("REDIRECT ERROR:", error);
    return false;
  }
}

// 🔓 LOGOUT
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("userLoggedIn");
    window.location.replace("index.html");
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
  }
}

// ✅ SIMPLE AUTH CHECK
export function isUserLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

// 🔄 CROSS TAB LOGOUT SYNC
window.addEventListener("storage", function (e) {
  if (e.key === "userLoggedIn" && e.newValue === null) {
    window.location.replace("index.html");
  }
});
