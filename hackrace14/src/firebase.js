// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFmuDNYtPBYSh2vBRJ5SYUpg6npGqJoJU",
  authDomain: "charting-app-502aa.firebaseapp.com",
  projectId: "charting-app-502aa",
  storageBucket: "charting-app-502aa.appspot.com",
  messagingSenderId: "585784598298",
  appId: "1:585784598298:web:560df85c46bbe668cf16a3",
  measurementId: "G-MBXBL49EBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default getFirestore()