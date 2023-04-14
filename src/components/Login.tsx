import React, { useRef, useState } from "react";
import { signup, login, logout, useAuth } from "../firebase";
import "./Login.css";
import { User, updateProfile } from "firebase/auth";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const displayNameRef = useRef<HTMLInputElement>(null);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentUser = useAuth();

    async function handleSignup() {
        if (passwordRef.current && passwordRef.current.value.length < 6) {
            alert("Password must be at least 6 character!");
            return;
        }
        setLoading(true);
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
        setLoading(false);
        toggleForm("signup");
    }

    async function handleLogout() {
        setLoading(true);
        try {
            await logout();
        } catch {
            alert("Error with logout!");
        }
        setLoading(false);
    }

    async function handleLogin() {
        setLoading(true);
        try {
            if (emailRef.current && passwordRef.current) {
                await login(emailRef.current.value, passwordRef.current.value);
            }
        } catch {
            alert("Error with login!");
        }
        setLoading(false);
        toggleForm("login");
    }

    const toggleForm = (name: string) => {
        if (name === "signup") {
            setShowSignupForm(!showSignupForm);
            setShowLoginForm(false);
        }
        if (name === "login") {
            setShowLoginForm(!showLoginForm);
            setShowSignupForm(false);
        }
    };

    return (
        <div>
            <div>Hello {currentUser?.displayName}! </div>
            <button
                onClick={() => toggleForm("signup")}
                disabled={loading || currentUser != null}
            >
                Sign Up
            </button>
            <button
                onClick={() => toggleForm("login")}
                disabled={loading || currentUser != null}
            >
                Sign In
            </button>
            <button disabled={loading || !currentUser} onClick={handleLogout}>
                Log Out
            </button>
            {showSignupForm && (
                <div className="login-container">
                    <form onSubmit={() => toggleForm("signup")}>
                        <input ref={emailRef} placeholder="Email" />
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                        />
                        <input
                            ref={displayNameRef}
                            placeholder="Display Name"
                        />
                    </form>
                    <button onClick={handleSignup}>Sign Up</button>
                </div>
            )}
            {showLoginForm && (
                <div className="login-container">
                    <form onSubmit={() => toggleForm("login")}>
                        <input ref={emailRef} placeholder="Email" />
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                        />
                    </form>
                    <button disabled={loading} onClick={handleLogin}>
                        Log In
                    </button>
                </div>
            )}
        </div>
    );
}
