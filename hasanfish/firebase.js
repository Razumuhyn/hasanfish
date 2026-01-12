import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY_FIREBASE,
   authDomain: "hasanfish-2a9cd.firebaseapp.com",
  projectId: "hasanfish-2a9cd",
  storageBucket: "hasanfish-2a9cd.firebasestorage.app",
  messagingSenderId: "22651924456",
  appId: "1:22651924456:web:837149d43c5c93a3d4fe5d"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
