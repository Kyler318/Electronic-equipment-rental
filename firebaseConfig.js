import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 使用 import.meta.env 來讀取 .env 檔案中的變數
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 導出 Firestore 資料庫實例，讓其他 Vue 元件可以使用
export const db = getFirestore(app);