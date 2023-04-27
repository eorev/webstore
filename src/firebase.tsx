import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    User,
    signOut,
    signInWithEmailAndPassword
} from "firebase/auth";
import { useEffect, useState } from "react";

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
export const auth = getAuth(app);
export function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
    return signOut(auth);
}

export function useAuth() {
    const [currentUser, setCurrentUser] = useState<User>();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) =>
            setCurrentUser(user as User)
        );
        return unsub;
    }, []);

    return currentUser;
}

export default getFirestore();
