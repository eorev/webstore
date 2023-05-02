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
    setDoc,
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
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [removedProducts, setRemovedProducts] = useState<cartProductData[]>(
        []
    );
    const [selectedShipping, setSelectedShipping] = useState<string>("");
    const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
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
                        0
                    );
                    setSubTotal(totalCost);
                    console.log(totalCost);
                }
            );
            return () => unsub();
        }
    }, [user]);

    console.log(products);

    const handleOrderPlacement = () => {
        console.log("order placed");
        setOrderPlaced(true);
    };

    const handleRemove = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp", "products"),
                product.name
            );
            setRemovedProducts([...removedProducts, product]);
            await deleteDoc(productRef);
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            setRemovedProducts([...removedProducts, product]);
            await deleteDoc(productRef);
        }
    };

    const handleAddToCart = async (product: cartProductData) => {
        if (!user) {
            console.log("adding to temp cart for non user");
            const newProductRef = doc(
                collection(db, "carts", "temp", "products"),
                product.name
            );
            const productSnapshot = await getDoc(newProductRef);
            if (productSnapshot.exists()) {
                await updateDoc(newProductRef, {
                    quantity: increment(1),
                    units_instock: increment(-1)
                });
                console.log("increased quantity");
            } else {
                await setDoc(newProductRef, {
                    name: product.name,
                    description: product.description,
                    id: product.id,
                    image: product.image,
                    rating: product.rating, //rating from 1 to 5
                    category: product.category,
                    admin_id: product.admin_id, //id belonging to the admin who created the product
                    price: product.price,
                    units_instock: product.units_instock,
                    quantity: product.quantity
                });
            }
        }
        if (user) {
            const newProductRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            const productSnapshot = await getDoc(newProductRef);
            if (productSnapshot.exists()) {
                await updateDoc(newProductRef, {
                    quantity: increment(1),
                    units_instock: increment(-1)
                });
                console.log("increased quantity");
            } else {
                await setDoc(newProductRef, {
                    name: product.name,
                    description: product.description,
                    id: product.id,
                    image: product.image,
                    rating: product.rating, //rating from 1 to 5
                    category: product.category,
                    admin_id: product.admin_id, //id belonging to the admin who created the product
                    price: product.price,
                    units_instock: product.units_instock,
                    quantity: product.quantity
                });
            }
        }
        setRemovedProducts((prevProducts) =>
            prevProducts.filter((p) => p.name !== product.name)
        );
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
                setRemovedProducts([...removedProducts, product]);
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
                setRemovedProducts([...removedProducts, product]);
                await deleteDoc(productRef);
            }
        }
    };
    return (
        <div className="checkout-container">
            <h1 className="cart-title">Cart</h1>
            <div className="cart-display-container">
                <div>
                    {products.map((product: cartProductData) => (
                        <div
                            key={product.name}
                            className="cart-product-display"
                        >
                            <div className="img-container">
                                <img
                                    src={process.env.PUBLIC_URL + product.image}
                                    alt={product.name}
                                />
                            </div>

                            <span className="name">{product.name}</span>
                            <span className="instock">In Stock</span>
                            <span className="price">${product.price}</span>
                            <span className="quantity">
                                Quantity: {product.quantity}
                            </span>
                            <div className="buttons">
                                <button
                                    onClick={() => increaseQuantity(product)}
                                    disabled={product.units_instock === 0}
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => decreaseQuantity(product)}
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        handleRemove(product);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
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
                <button
                    className="placeorder"
                    onClick={handleOrderPlacement}
                    disabled={selectedShipping === ""}
                >
                    Place Order
                </button>
            </div>
            <div className="recently-deleted">
                <h4>Recently Deleted</h4>
                {removedProducts.map((product: cartProductData) => (
                    <div key={product.name}>
                        <span>
                            {product.name} | Quantity: {product.quantity} |
                            Price:
                            {product.price * product.quantity}
                        </span>
                        <button
                            onClick={() => {
                                product.quantity++;
                                const updatedProducts = [...removedProducts];
                                const index = updatedProducts.findIndex(
                                    (p) => p.name === product.name
                                );
                                updatedProducts[index] = product;
                                setRemovedProducts(updatedProducts);
                            }}
                        >
                            +
                        </button>
                        <button
                            onClick={() => {
                                product.quantity--;
                                const updatedProducts = [...removedProducts];
                                const index = updatedProducts.findIndex(
                                    (p) => p.name === product.name
                                );
                                updatedProducts[index] = product;
                                setRemovedProducts(updatedProducts);
                            }}
                        >
                            -
                        </button>
                        <button
                            onClick={() => {
                                handleAddToCart(product);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            {orderPlaced ? <div className="order-confirmation"></div> : null}
        </div>
    );
};

export default Checkout;
