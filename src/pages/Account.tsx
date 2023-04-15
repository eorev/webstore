import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface AuthContextType {
    logout: () => void;
}

const Account = () => {
    const { logout } = UserAuth() as AuthContextType;
    return (
        <div>
            <p>Account</p>
            <Link to="/webstore">
                <button>Home</button>
            </Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Account;
