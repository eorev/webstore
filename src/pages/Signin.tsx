import React, { useEffect, useRef, useState } from "react";
import GoogleButton from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { login } from "../firebase";

interface AuthContextType {
    googleSignIn: () => void;
    user: User;
}

const Signin = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const { googleSignIn, user } = UserAuth() as AuthContextType;
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };
    async function handleEmailLogin() {
        setLoading(true);
        try {
            if (emailRef.current && passwordRef.current) {
                await login(emailRef.current.value, passwordRef.current.value);
            }
        } catch {
            alert("Error with login!");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (user != null) {
            navigate("/homepage");
        }
    }, [user]);

    return (
        <div>
            (
            <div className="login-container">
                <form>
                    <input ref={emailRef} placeholder="Email" />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                </form>
                <button disabled={loading} onClick={handleEmailLogin}>
                    Log In
                </button>
            </div>
            )<h1 className="text-center text-3xl font-bold py-8">Sign in</h1>
            <div className="max-w-[240px] m-auto py-4">
                <GoogleButton onClick={handleGoogleSignIn} />
            </div>
        </div>
    );
};

export default Signin;
