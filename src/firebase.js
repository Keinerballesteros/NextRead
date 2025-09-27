
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, FacebookAuthProvider, signOut, GithubAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyA20qOFuyhChuTklwBdkSnpF5yqclwsFzo",
  authDomain: "nextreadproject.firebaseapp.com",
  projectId: "nextreadproject",
  storageBucket: "nextreadproject.firebasestorage.app",
  messagingSenderId: "991913423699",
  appId: "1:991913423699:web:4cba2c58fcc3729d6c67a6"
};

//Initialize firebase
const app = initializeApp(firebaseConfig);


//Variable para obtener funcionalidad de Autenticación
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();


// Conexión a db
const db = getFirestore(app);

//Exportar variables para consumo del proyecto
export {auth, GoogleProvider, githubProvider, facebookProvider, db, signOut};