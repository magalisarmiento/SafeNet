import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpLrmTnkF7EzeQ7ZOcmH9uNaNX2NW31qc",
  authDomain: "safenet-grooming-tesis.firebaseapp.com",
  projectId: "safenet-grooming-tesis",
  storageBucket: "safenet-grooming-tesis.firebasestorage.app",
  messagingSenderId: "727137497541",
  appId: "1:727137497541:web:596947dbce37f883c09bac",
  measurementId: "G-PY25W6SCDM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);