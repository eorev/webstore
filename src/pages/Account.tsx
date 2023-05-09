import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import {
    EmailAuthProvider,
    User,
    reauthenticateWithCredential
} from "firebase/auth";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

import "./Account.css";

interface AuthContextType {
    user: User;
}

interface ChangeDisplayNameFormProps {
    onSubmit: (newDisplayName: string) => void;
}

interface ChangeEmailFormProps {
    onSubmit: (newEmail: string, password: string) => void;
}

interface ChangePasswordFormProps {
    onSubmit: (currentPassword: string, newPassword: string) => void;
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
                New Display Name:
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

function ChangeEmailForm({ onSubmit }: ChangeEmailFormProps) {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(newEmail, password);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                New Email: <br />
                <input
                    type="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                />
            </label>
            <label>
                Current password:
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </label>
            <button type="submit">Update</button>
        </form>
    );
}

function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setPasswordsMatch(false);
            return;
        }
        onSubmit(currentPassword, newPassword);
    };

    const handleCurrentPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewPassword(e.target.value);
        if (passwordsMatch === false && e.target.value === confirmNewPassword) {
            setPasswordsMatch(true);
        }
    };

    const handleConfirmNewPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmNewPassword(e.target.value);
        if (passwordsMatch === false && e.target.value === newPassword) {
            setPasswordsMatch(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Current password:
                <input
                    type="password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                />
            </label>
            <label>
                New password:
                <input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                />
            </label>
            <label>
                Confirm new password:
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                />
                {!passwordsMatch && (
                    <div style={{ textAlign: "center" }}>
                        <div>
                            <br />
                            <span style={{ color: "red" }}>
                                Passwords do not match.
                            </span>
                        </div>
                    </div>
                )}
            </label>
            <button type="submit" disabled={!passwordsMatch}>
                Update
            </button>
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

    const handleEmailUpdate = async (newEmail: string, password: string) => {
        try {
            const email = user.email;
            if (!email) {
                console.error("User email not found");
            } else {
                const credential = EmailAuthProvider.credential(
                    email,
                    password
                );
                try {
                    await reauthenticateWithCredential(user, credential);
                } catch (error) {
                    console.log(
                        "^Error for Incorrect Password: Cant reauthenticate user with this password"
                    );
                    alert("Incorret input for Current Password");
                    <span>Error</span>;
                    return;
                }
                try {
                    await updateEmail(user, newEmail);
                } catch (error) {
                    console.log("Error updating email");
                }
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating email:", error);
        }
    };

    const handlePasswordUpdate = async (
        currentPassword: string,
        newPassword: string
    ) => {
        try {
            const email = user.email;
            if (!email) {
                console.error("User email not found");
                return;
            }
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            try {
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                console.log(
                    "^Error for Incorrect Password: Cant reauthenticate user with this password"
                );
                alert("Incorret input for Current Password");
                return;
            }
            try {
                await updatePassword(user, newPassword);
            } catch (error) {
                console.log("Error updating password");
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const isGoogleUser = user?.providerData[0]?.providerId === "google.com";

    return (
        <div>
            <h1>Account</h1>
            <div className="container">
                {!isGoogleUser && (
                    <>
                        <ChangeDisplayNameForm
                            onSubmit={(newDisplayName) => {
                                updateDisplayName(user, newDisplayName);
                            }}
                        />
                        <ChangeEmailForm onSubmit={handleEmailUpdate} />
                        <ChangePasswordForm onSubmit={handlePasswordUpdate} />
                    </>
                )}
                {isGoogleUser && (
                    <p>
                        You are signed in with Google and therefore unable to
                        edit your email, password and display name directly.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Account;
