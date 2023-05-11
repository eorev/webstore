import React from "react";
import {
    GoogleAuthProvider,
    User,
    onAuthStateChanged,
    signInWithPopup
} from "firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";
import { auth, logout } from "../firebase";

type AuthContextProviderProps = {
    children: React.ReactNode;
};

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User>();
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        //signInWithRedirect(auth, provider);
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser as User);
            //console.log(currentUser);
        });
        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};
