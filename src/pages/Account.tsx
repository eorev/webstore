import React from "react";
import { UserAuth } from "../context/AuthContext";

interface AuthContextType {
    logout: () => void;
}

const Account = () => {
    const { logout } = UserAuth() as AuthContextType;
    return (
        <div>
            <p>Account</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Account;
