import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ProductData from "../interfaces/product";
import db from "../firebase";

interface AuthContextType {
    logout: () => void;
    user: User;
}

const Account = () => {
    const { logout, user } = UserAuth() as AuthContextType;
    const [removeProduct, setRemoveProduct] = useState<string>("");
    const [products, setProducts] = useState<ProductData[]>([]);
    console.log(products);
    useEffect(
        () =>
            onSnapshot(
                collection(db, "carts", user.uid, "products"),
                (snapshot) =>
                    setProducts(
                        snapshot.docs.map((doc) => doc.data() as ProductData)
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
    return (
        <div>
            <p>Account</p>
            <Link to="/">
                <button>Home</button>
            </Link>
            <button onClick={logout}>Logout</button>
            <div>
                {products.map((item: ProductData) =>
                    item.name !== "null" ? (
                        <div key={item.name}>
                            <span>{item.name}</span>
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
