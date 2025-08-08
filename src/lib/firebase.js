// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgNCB7aUgj_FDNqPJEb1AcwrAHcIRuBMs",
  authDomain: "eindhoven-vcg.firebaseapp.com",
  projectId: "eindhoven-vcg",
  storageBucket: "eindhoven-vcg.appspot.com",
  messagingSenderId: "182016420136",
  appId: "1:182016420136:web:890e167338c3608728c81d",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
