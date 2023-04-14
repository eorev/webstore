import React from "react";
import Navbar from "../components/Navbar";
import Catalog from "../components/Catalog";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Home = () => {
    const { user, logout } = UserAuth() as AuthContextType;
    return (
        <div className="App">
            <Navbar></Navbar>
            {user ? (
                <div>
                    <button onClick={logout}>Logout</button>
                    <Link to="/account">
                        <button>Account</button>
                    </Link>
                    <Link to="/admin">
                        <button>Admin</button>
                    </Link>
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
