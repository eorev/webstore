import React, { useEffect } from "react";
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
import Products from "./pages/Products";
import AboutUs from "./pages/AboutUs";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import db from "./firebase";
import Contact from "./components/Contact";

async function clearTempCart() {
    const cartDocRef = doc(db, "carts", "temp");
    const querySnapshot = await getDocs(
        query(collection(cartDocRef, "products"), where("id", "!=", null))
    );
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

function App() {
    useEffect(() => {
        clearTempCart();
    }, []);

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
                    <Route path="/products" element={<Products />} />
                    <Route path="/aboutus" element={<AboutUs />} />
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
                <Contact></Contact>
                <Footer></Footer>
            </div>{" "}
        </AuthContextProvider>
    );
}

export default App;
