import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { User } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import { Link } from "react-router-dom";

export type NavbarProps = {
    switchTheme: () => void;
    theme: string;
};

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Navbar: React.FC<NavbarProps> = ({ switchTheme, theme }) => {
    const { user, logout } = UserAuth() as AuthContextType;
    const [adminIDs, setAdminIDs] = useState<string[]>([]);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "ids", "adminIDs"), (doc) => {
            if (doc.exists()) {
                const adminData = doc.data();
                const fullArray = adminData.full as string[];
                setAdminIDs(fullArray);
            }
        });

        return () => unsub();
    }, []);
    const isAdmin: boolean = adminIDs.includes(user?.uid);
    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <h1>Nestled</h1>
            </div>
            <div className="navbar__right">
                {user ? (
                    <div className="navbar__greeting">
                        <div>Welcome, {user.displayName}!</div>
                    </div>
                ) : (
                    <div></div>
                )}
                <ul className="navbar__links">
                    <div className="theme-toggle">
                        <span className="theme">
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </span>
                        {theme === "dark" && (
                            <i
                                onClick={switchTheme}
                                className="fas fa-toggle-off"
                            ></i>
                        )}
                        {theme === "light" && (
                            <i
                                onClick={switchTheme}
                                className="fas fa-toggle-on"
                            ></i>
                        )}
                    </div>
                    <Link to="/" className="navbar__links-item">
                        <button>Home</button>
                    </Link>
                    <Link to="/products" className="navbar__links-item">
                        <button>Products</button>
                    </Link>
                    {user ? (
                        <div>
                            <Link to="/account" className="navbar__links-item">
                                <button>Account</button>
                            </Link>
                            {isAdmin ? (
                                <Link
                                    to="/admin"
                                    className="navbar__links-item"
                                >
                                    <button>Admin</button>
                                </Link>
                            ) : null}
                            <button
                                className="navbar__links-item"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/signin" className="navbar__links-item">
                                <button>Sign in</button>
                            </Link>
                            <Link to="/signup" className="navbar__links-item">
                                <button>Sign Up</button>
                            </Link>
                        </div>
                    )}
                    <Link to="/aboutus" className="navbar__links-item">
                        <button>About Us</button>
                    </Link>
                    <Link to="/checkout">
                        <button className="navbar__cart-btn navbar__links-item">
                            Cart
                        </button>
                    </Link>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
