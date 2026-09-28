// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

function requireFirebaseEnv(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required Firebase environment variable: ${name}`);
  }
  return value;
}

// For Firebase JS SDK v7.20.0 and later, measurementId is optional.
const firebaseConfig = {
  apiKey: requireFirebaseEnv("VITE_FIREBASE_API_KEY"),
  authDomain: requireFirebaseEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: requireFirebaseEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: requireFirebaseEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireFirebaseEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireFirebaseEnv("VITE_FIREBASE_APP_ID"),
  measurementId: requireFirebaseEnv("VITE_FIREBASE_MEASUREMENT_ID")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Enable App Check debug token for local development when running on localhost
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Initialize Firebase AI Logic (Gemini Developer API)
export let ai = null;
export let geminiModel = null;

try {
  ai = getAI(app, { backend: new GoogleAIBackend() });
  geminiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
} catch (e) {
  console.log("Firebase AI Logic initialization notice:", e.message);
}

/**
 * Generate AI Mentor responses using Firebase AI Logic (Gemini API)
 */
export async function generateWithGemini(userPrompt, currentCode = "", language = "python", studentName = "Young Innovator") {
  if (geminiModel) {
    try {
      const systemInstruction = 
        `You are Koda, an enthusiastic, patient, and encouraging AI Coding Mentor at Codeyoung (a premier 1:1 STEM academy for kids).\n` +
        `Student Name: ${studentName}\n` +
        `Active Language: ${language}\n` +
        (currentCode ? `Current Code in Editor:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n` : '') +
        `User Prompt: ${userPrompt}\n\n` +
        `Give an inspiring, easy-to-understand explanation with clean code snippets and fun emojis. Keep it engaging for young innovators!`;

      const result = await geminiModel.generateContent(systemInstruction);
      if (result && result.response) {
        return result.response.text();
      }
    } catch (err) {
      console.warn("Firebase AI Logic Gemini request fell back:", err.message);
      throw err;
    }
  }
  throw new Error("Firebase AI Logic Gemini model not ready.");
}

// Initialize Analytics (guarded against environments without IndexedDB)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
};

export default app;
