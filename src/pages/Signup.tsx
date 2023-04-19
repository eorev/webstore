import React, { useEffect, useRef } from "react";
import GoogleButton from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, updateProfile } from "firebase/auth";
import { signup } from "../firebase";
import "./Signup.css";
import db from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
    googleSignIn: () => void;
    user: User;
}

const Signup = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const displayNameRef = useRef<HTMLInputElement>(null);
    const { googleSignIn, user } = UserAuth() as AuthContextType;
    const navigate = useNavigate();

    async function handleSignup() {
        if (passwordRef.current && passwordRef.current.value.length < 6) {
            alert("Password must be at least 6 character!");
            return;
        }
        try {
            if (emailRef.current && passwordRef.current) {
                const { user } = await signup(
                    emailRef.current.value,
                    passwordRef.current.value
                );
                await updateProfile(user, {
                    displayName: displayNameRef.current?.value
                });
            }
        } catch {
            alert("Error with signup!");
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleNewUser = async () => {
        if (user) {
            const cartDocRef = doc(db, "carts", user.uid);
            const orderbinDocRef = doc(db, "orderbins", user.uid);
            try {
                const cartDocSnap = await getDoc(cartDocRef);
                const orderbinDocSnap = await getDoc(orderbinDocRef);
                if (cartDocSnap.exists()) {
                    console.log("cart for user already exists");
                } else {
                    await setDoc(cartDocRef, { products: [] });
                    console.log("added doc");
                }
                if (orderbinDocSnap.exists()) {
                    console.log("orderbin for user already exists");
                } else {
                    await setDoc(orderbinDocRef, { orders: [] });
                    console.log("added doc");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (user != null) {
            handleNewUser();
            navigate("/");
        }
    }, [user]);

    return (
        <div className="signup-container">
            <div className="signup-form__container">
                <h1>Join the Nestled Community!</h1>
                <form>
                    <input
                        className="signupEmail"
                        ref={emailRef}
                        placeholder="Email"
                    />
                    <input
                        className="signupPassword"
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        className="signupDisplayName"
                        ref={displayNameRef}
                        placeholder="Display Name"
                    />
                    <button className="signupButton" onClick={handleSignup}>
                        Sign Up
                    </button>
                </form>
                <h2>OR</h2>
                <GoogleButton
                    className="signinInGoogleButton"
                    onClick={() => {
                        handleGoogleSignIn();
                    }}
                />
            </div>
        </div>
    );
};

export default Signup;
