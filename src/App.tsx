import React from "react";
import "./App.css";
import "./components/Catalog.css";
import { Route, Routes } from "react-router-dom";
import Sigin from "./pages/Signin";
import Home from "./pages/Home";
import { AuthContextProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Protected from "./components/Protected";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
    return (
        <AuthContextProvider>
            <div className="App">
                <Navbar
                    links={[
                        { name: "About", url: "#about" },
                        { name: "Products", url: "#products" }
                    ]}
                    cartOnClick={() => {
                        console.log("Open Cart");
                    }}
                />
                <Routes>
                    <Route path="/homepage" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/webstore" element={<Home />} />
                    <Route path="/signin" element={<Sigin />} />
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
            </div>{" "}
        </AuthContextProvider>
    );
}

export default App;
