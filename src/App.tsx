import React, { useEffect, useState } from "react";
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
import Checkout from "./pages/Checkout";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where
} from "firebase/firestore";
import db from "./firebase";
import Contact from "./components/Contact";
import { v4 as uuidv4 } from "uuid";
import Promotion from "./components/Promotion";
import useLocalStorage from "use-local-storage";

async function clearTempCart() {
    const cartDocRef = doc(db, "carts", "temp");
    const querySnapshot = await getDocs(
        query(collection(cartDocRef, "products"), where("id", "!=", null))
    );
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

const handleNewUser = async (uid: string) => {
    const cartDocRef = doc(db, "carts", "temp" + uid);
    const orderbinDocRef = doc(db, "orderbins", "temp" + uid);
    const subcartcollectionRef = collection(cartDocRef, "products");
    const suborderbincollectionRef = collection(orderbinDocRef, "orders");

    try {
        const cartDocSnap = await getDoc(cartDocRef);
        const orderbinDocSnap = await getDoc(orderbinDocRef);
        const subcartollectionSnap = await getDocs(subcartcollectionRef);
        const suborderbincollectionSnap = await getDocs(
            suborderbincollectionRef
        );

        if (cartDocSnap.exists()) {
            //console.log("cart for user already exists");
        } else {
            if (subcartollectionSnap.empty) {
                const nullDocRef = doc(
                    db,
                    "carts",
                    "temp" + uid,
                    "products",
                    "null"
                );
                await setDoc(nullDocRef, {
                    name: "null"
                });

                await setDoc(cartDocRef, { cost: 0 });
            }
        }
        if (orderbinDocSnap.exists()) {
            //console.log("orderbin for user already exists");
        } else {
            if (suborderbincollectionSnap.empty) {
                const nullDocRef = doc(
                    db,
                    "orderbins",
                    "temp" + uid,
                    "orders",
                    "null"
                );
                await setDoc(nullDocRef, {
                    name: "null"
                });

                await setDoc(orderbinDocRef, {
                    totalspent: 0,
                    lastAccessed: new Date().toLocaleDateString("en-US")
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const NON_AUTH_USER_ID_KEY = "nonAuthUserId";

function App() {
    const [showPromotion, setShowPromotion] = useState<boolean>(false);
    const [theme, setTheme] = useLocalStorage("theme", "light");

    useEffect(() => {
        clearTempCart();
        let nonAuthUserId = localStorage.getItem(NON_AUTH_USER_ID_KEY);
        if (!nonAuthUserId) {
            nonAuthUserId = uuidv4();
            localStorage.setItem(NON_AUTH_USER_ID_KEY, nonAuthUserId);
        }
        console.log(localStorage.getItem(NON_AUTH_USER_ID_KEY));
        handleNewUser(nonAuthUserId);

        const hasShownPromotion = localStorage.getItem("hasShownPromotion");
        if (!showPromotion && !hasShownPromotion) {
            setShowPromotion(true);
            localStorage.setItem("hasShownPromotion", "true");
        }
    }, []);

    return (
        <AuthContextProvider>
            <div className="App" data-theme={theme}>
                <Navbar
                    switchTheme={() => {
                        const newTheme = theme === "light" ? "dark" : "light";
                        setTheme(newTheme);
                    }}
                    theme={theme}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/checkout" element={<Checkout />} />
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
                {showPromotion ? (
                    <Promotion
                        open={showPromotion}
                        onClose={() => setShowPromotion(false)}
                    />
                ) : null}
            </div>{" "}
        </AuthContextProvider>
    );
}

export default App;
