import React from "react";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import "./Account.css";

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Account = () => {
    const { user } = UserAuth() as AuthContextType;
    return (
        <div className="account-info__container">
            <h1>Account</h1>
            <div className="account-options__container">
                <div className="account-options__item">
                    <form className="account-options__form">
                        <h2>Account Information</h2>
                        <div className="account-options__form-item">
                            <h1>Email: {user.email}</h1>
                            <h1>Username: {user.displayName}</h1>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
