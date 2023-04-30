import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    increment,
    onSnapshot,
    updateDoc
} from "firebase/firestore";
import cartProductData from "../interfaces/cartProduct";
import db from "../firebase";

interface AuthContextType {
    user: User;
}

const Account = () => {
    const { user } = UserAuth() as AuthContextType;
    const [removeProduct, setRemoveProduct] = useState<string>("");
    const [products, setProducts] = useState<cartProductData[]>([]);
    console.log(products);
    useEffect(
        () =>
            onSnapshot(
                collection(db, "carts", user.uid, "products"),
                (snapshot) =>
                    setProducts(
                        snapshot.docs.map(
                            (doc) => doc.data() as cartProductData
                        )
                    )
            ),
        []
    );
    const handleRemove = async () => {
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
        <div>
            <p>Account</p>
            <div>
                {products.map((item: cartProductData) =>
                    item.name !== "null" ? (
                        <div key={item.name}>
                            <span>
                                {item.name} | Quantity: {item.quantity}
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
                                    setRemoveProduct(item.name), handleRemove();
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
    );
};

export default Account;
