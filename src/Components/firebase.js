import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCQNQHufMopIV45g-GtCHkfr_R6LD-n8Vs",
  authDomain: "chat-app-sameer.firebaseapp.com",
  projectId: "chat-app-sameer",
  storageBucket: "chat-app-sameer.appspot.com",
  messagingSenderId: "324731329492",
  appId: "1:324731329492:web:d6084cc748c81c169bd441"
};


export const app = initializeApp(firebaseConfig);