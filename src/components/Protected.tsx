import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

type AuthContextProviderProps = {
    children: React.ReactNode;
};

interface AuthContextType {
    user: User;
}

const Protected = ({ children }: AuthContextProviderProps) => {
    const { user } = UserAuth() as AuthContextType;
    if (!user) {
        return <Navigate to="/" />;
    }
    return <div>{children}</div>;
};

export default Protected;
