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

// ✅ FIX: Wrap persistence (NO top-level await)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence error:", error);
});

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
    console.log("LOGIN TRIGGERED"); // 🔍 debug
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
  }
}

// 🔥 HANDLE REDIRECT
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      const email = result.user.email;

      if (!isAllowed(email)) {
        await signOut(auth);
        return false;
      }

      localStorage.setItem("userLoggedIn", "true");
      return true;
    }

    // ✅ Wait for auth state properly
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();

        if (user) {
          localStorage.setItem("userLoggedIn", "true");
          resolve(true);
        } else {
          resolve(false);
        }
      });
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

// ✅ CHECK
export function isUserLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

// 🔄 CROSS TAB SYNC
window.addEventListener("storage", function (e) {
  if (e.key === "userLoggedIn" && e.newValue === null) {
    window.location.replace("index.html");
  }
});
