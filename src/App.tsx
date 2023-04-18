import React from "react";
import "./App.css";
import "./components/Catalog.css";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import { AuthContextProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Protected from "./components/Protected";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <AuthContextProvider>
            <div className="App">
                <Navbar
                    cartOnClick={() => {
                        console.log("Open Cart");
                    }}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/account"
                        element={
                            <Protected>
                                <Account />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <Protected>
                                <Admin />
                            </Protected>
                        }
                    />
                </Routes>
                <Footer></Footer>
            </div>{" "}
        </AuthContextProvider>
    );
}

export default App;
