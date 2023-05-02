import React, { useEffect, useState } from "react";
import "./Checkout.css";
import cartProductData from "../interfaces/cartProduct";
import db from "../firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    increment,
    onSnapshot,
    updateDoc
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

interface AuthContextType {
    user: User;
}

const Checkout = () => {
    const { user } = UserAuth() as AuthContextType;
    const [products, setProducts] = useState<cartProductData[]>([]);
    const [removeProduct, setRemoveProduct] = useState<string>("");
    const [shippingCost, setShippingCost] = useState<number>(0.0);
    const [subTotal, setSubTotal] = useState<number>(0.0);

    const [selectedShipping, setSelectedShipping] = useState<string>("");
    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(
                collection(db, "carts", user.uid, "products"),
                (snapshot) => {
                    const cartProducts = snapshot.docs
                        .map((doc) => doc.data() as cartProductData)
                        .filter((product) => product.name != "null");
                    setProducts(cartProducts);
                    const totalCost = cartProducts.reduce(
                        (accumulator, product) =>
                            accumulator + product.price * product.quantity,
                        0.0
                    );
                    setSubTotal(totalCost);
                    console.log(totalCost);
                }
            );
            return () => unsub();
        }
    }, [user]);

    console.log(products);
    const handleRemove = async (item: string) => {
        setRemoveProduct(item);
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp", "products"),
                removeProduct
            );
            await deleteDoc(productRef);
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                removeProduct
            );
            await deleteDoc(productRef);
        }
    };

    const increaseQuantity = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp", "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(1),
                units_instock: increment(-1)
            });
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(1),
                units_instock: increment(-1)
            });
        }
    };

    const decreaseQuantity = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp", "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(-1)
            });

            const updatedProduct = await getDoc(productRef);
            const updatedQuantity = updatedProduct.data()?.quantity;

            if (updatedQuantity === 0) {
                await deleteDoc(productRef);
            }
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(-1),
                units_instock: increment(1)
            });

            const updatedProduct = await getDoc(productRef);
            const updatedQuantity = updatedProduct.data()?.quantity;

            if (updatedQuantity === 0) {
                await deleteDoc(productRef);
            }
        }
    };
    return (
        <div className="checkout-container">
            <div className="cart-display-container">
                <h1>Cart</h1>
                <div>
                    {products.map((item: cartProductData) =>
                        item.name !== "null" ? (
                            <div key={item.name}>
                                <span>
                                    {item.name} | Quantity: {item.quantity} |
                                    Price: {item.price * item.quantity}
                                </span>
                                <button
                                    onClick={() => increaseQuantity(item)}
                                    disabled={item.units_instock === 0}
                                >
                                    +
                                </button>
                                <button onClick={() => decreaseQuantity(item)}>
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        handleRemove(item.name);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div key={item.id}></div>
                        )
                    )}
                </div>
            </div>

            <div className="checkout-summary-container">
                <h2 className="order-summary">
                    Order Summary
                    <span className="order-summary-underline"></span>
                </h2>
                <h3 className="subtotal-title">Subtotal:</h3>
                <h3 className="subtotal">${subTotal}</h3>
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
                                setShippingCost(5.99);
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
                                setShippingCost(10.99);
                            }}
                            checked={selectedShipping === "express"}
                        />
                        Express Shipping
                        <span style={{ marginLeft: "67px" }}>$10.99</span>
                    </label>
                </div>
                <h3 className="total-title">Total: </h3>
                <h3 className="total">
                    ${(subTotal + shippingCost).toFixed(2)}
                </h3>
                <button className="placeorder">Place Order</button>
            </div>
            <div className="recently-deleted">Recently Deleted</div>
        </div>
    );
};

export default Checkout;
