import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Catalog from "./components/Catalog";
import "./components/Catalog.css";
import { Route, Routes } from "react-router-dom";
import Sigin from "./pages/Signin";
import Home from "./pages/Home";
import { AuthContextProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";

function App() {
    return (
        <AuthContextProvider>
            <div className="App">
                <Routes>
                    <Route path="/homepage" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<Sigin />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </AuthContextProvider>
    );
}

export default App;
