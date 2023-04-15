import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { User } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import { Link } from "react-router-dom";

type NavbarProps = {
    links: { name: string; url: string }[];
    cartOnClick: () => void;
};

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Navbar: React.FC<NavbarProps> = ({ links, cartOnClick }) => {
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
            <ul className="navbar__links">
                {links.map((link) => (
                    <li key={link.url} className="navbar__links-item">
                        <a href={link.url}>{link.name}</a>
                    </li>
                ))}
                {user ? (
                    <div>
                        <button onClick={logout}>Logout</button>
                        <Link to="/webstore/account">
                            <button>Account</button>
                        </Link>
                        {isAdmin ? (
                            <Link to="/webstore/admin">
                                <button>Admin</button>
                            </Link>
                        ) : null}
                    </div>
                ) : (
                    <div>
                        <Link to="/webstore/signin">
                            <button>Sign in</button>
                        </Link>
                        <Link to="/webstore/signup">
                            <button>Signup</button>
                        </Link>
                    </div>
                )}
                <button
                    className="navbar__cart-btn navbar__links-item"
                    onClick={cartOnClick}
                >
                    Cart
                </button>
            </ul>
        </nav>
    );
};

export default Navbar;
