import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Catalog from "../components/Catalog";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import db from "../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Home = () => {
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
        <div className="App">
            <Navbar></Navbar>
            {user ? (
                <div>
                    <button onClick={logout}>Logout</button>
                    <Link to="/account">
                        <button>Account</button>
                    </Link>
                    {isAdmin ? (
                        <Link to="/admin">
                            <button>Admin</button>
                        </Link>
                    ) : null}
                </div>
            ) : (
                <div>
                    <Link to="/signin">
                        <button>Sign in</button>
                    </Link>
                    <Link to="/signup">
                        <button>Signup</button>
                    </Link>
                </div>
            )}
            <Catalog></Catalog>
        </div>
    );
};

export default Home;
