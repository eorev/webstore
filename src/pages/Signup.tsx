import React, { useEffect, useRef } from "react";
import GoogleButton from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { User, updateProfile } from "firebase/auth";
import { signup } from "../firebase";
import "./Signup.css";

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

    useEffect(() => {
        if (user != null) {
            navigate("/homepage");
        }
    }, [user]);

    return (
        <div>
            (
            <div className="signup-container">
                <div>
                    <Link to="/">
                        <button className="signupHome">Home</button>
                    </Link>
                </div>
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
                </form>
                <button className="signupButton" onClick={handleSignup}>
                    Sign Up
                </button>
            </div>
            <GoogleButton
                className="googleButton"
                onClick={handleGoogleSignIn}
            />
            )
        </div>
    );
};

export default Signup;
