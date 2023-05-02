import React, { useEffect, useState } from "react";
import "./Checkout.css";
import cartProductData from "../interfaces/cartProduct";
import db from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

interface AuthContextType {
    user: User;
}

const Checkout = () => {
    const { user } = UserAuth() as AuthContextType;
    const [products, setProducts] = useState<cartProductData[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<string>("");
    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(
                collection(db, "carts", user.uid, "products"),
                (snapshot) =>
                    setProducts(
                        snapshot.docs.map(
                            (doc) => doc.data() as cartProductData
                        )
                    )
            );
            return () => unsub();
        }
    }, [user]);
    console.log(products);
    return (
        <div>
            <div className="cart-display-container">
                <h1>Cart</h1>
                <div>Products</div>
            </div>

            <div className="checkout-summary-container">
                <h2 className="order-summary">
                    Order Summary
                    <span className="order-summary-underline"></span>
                </h2>
                <h3 className="subtotal-title">Subtotal:</h3>
                <h3 className="subtotal">$temp</h3>
                <div className="shipping-options">
                    <span className="shipping-options-title">
                        Shipping Options
                    </span>
                    <br></br>
                    <label>
                        <input
                            type="radio"
                            onChange={() => {
                                setSelectedShipping("standard");
                            }}
                            checked={selectedShipping === "standard"}
                        />
                        Standard Shipping
                        <span style={{ marginLeft: "65px" }}>$5.99</span>
                        <br></br>
                        <input
                            type="radio"
                            onChange={() => {
                                setSelectedShipping("express");
                            }}
                            checked={selectedShipping === "express"}
                        />
                        Express Shipping
                        <span style={{ marginLeft: "67px" }}>$10.99</span>
                    </label>
                </div>
                <h3 className="total-title">Total: </h3>
                <h3 className="total">$temp</h3>
                <button className="placeorder">Place Order</button>
            </div>
            <div>Recently Deleted</div>
        </div>
    );
};

export default Checkout;
