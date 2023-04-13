import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCCrryWY-1RRfotDfp6ixewoFz830tfcGk",
    authDomain: "team5-webstore.firebaseapp.com",
    projectId: "team5-webstore",
    storageBucket: "team5-webstore.appspot.com",
    messagingSenderId: "929602342195",
    appId: "1:929602342195:web:2193d726d1fc4ea1bf0246",
    measurementId: "G-KRX0K5N8ES"
};

const app = initializeApp(firebaseConfig);
export default getFirestore();
