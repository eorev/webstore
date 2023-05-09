import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import { updateProfile } from "firebase/auth";

import "./Account.css";

interface AuthContextType {
    user: User;
}

interface ChangeDisplayNameFormProps {
    onSubmit: (newDisplayName: string) => void;
}

function ChangeDisplayNameForm({ onSubmit }: ChangeDisplayNameFormProps) {
    const [newDisplayName, setNewDisplayName] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(newDisplayName);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDisplayName(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                New display name:
                <input
                    type="text"
                    value={newDisplayName}
                    onChange={handleInputChange}
                />
            </label>
            <button type="submit">Update</button>
        </form>
    );
}

async function updateDisplayName(user: User, newDisplayName: string) {
    try {
        await updateProfile(user, {
            displayName: newDisplayName
        });
        window.location.reload();
    } catch (error) {
        console.error("Error updating display name:", error);
    }
}

const Account = () => {
    const { user } = UserAuth() as AuthContextType;

    return (
        <div>
            <h1>Account</h1>
            <div className="container">
                <ChangeDisplayNameForm
                    onSubmit={(newDisplayName) => {
                        updateDisplayName(user, newDisplayName);
                    }}
                />
            </div>
        </div>
    );
};

export default Account;
