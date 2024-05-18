import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFj6AexHMNLzDmpYgzMEzTG7ln5YqhYT8",
  authDomain: "info-applogin.firebaseapp.com",
  projectId: "info-applogin",
  storageBucket: "info-applogin.appspot.com",
  messagingSenderId: "440127816036",
  appId: "1:440127816036:web:9a2f18937b6d0e8e5c3a71"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // para disponibilizar a autenticação
export const db = getFirestore(app); // para disponibilizar o banco de dados
