
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMDn0sq9nH9TnwSKztGO0f91Ym6zzZD3w",
  authDomain: "stocksync-a0ce8.firebaseapp.com",
  databaseURL: "https://stocksync-a0ce8-default-rtdb.firebaseio.com",
  projectId: "stocksync-a0ce8",
  storageBucket: "stocksync-a0ce8.appspot.com",
  messagingSenderId: "369287758483",
  appId: "1:369287758483:web:f3376d2ecb3fb427518366"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
