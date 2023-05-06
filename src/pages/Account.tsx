import React from "react";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

interface AuthContextType {
    user: User;
}

const Account = () => {
    const { user } = UserAuth() as AuthContextType;
    console.log(user);
    return (
        <div>
            <p>Account</p>
        </div>
    );
};

export default Account;
