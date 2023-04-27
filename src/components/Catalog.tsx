import React, { useEffect, useState } from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";
import db from "../firebase";
import {
    collection,
    doc,
    getDoc,
    increment,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { User } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";

interface CatalogProps {
    product: ProductData;
}

interface AuthContextType {
    user: User;
}

const View: React.FC<CatalogProps> = ({ product }) => {
    const productRef = doc(db, "products", product.name);
    const { user } = UserAuth() as AuthContextType;

    const handleAddToCart = async () => {
        await updateDoc(productRef, {
            units_instock: product.units_instock - 1,
            times_purchased: product.times_purchased + 1
        });
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
                    units_instock: product.units_instock - 1,
                    quantity: 1
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
                    units_instock: product.units_instock - 1,
                    quantity: 1
                });
            }
        }
    };

    return (
        <div className="catalog-view">
            <h1 className="name">{product.name}</h1>
            <div className="image-container">
                <img
                    src={process.env.PUBLIC_URL + product.image}
                    alt={product.name}
                />
                <div className="text-overlay">{product.description}</div>
            </div>
            {product.units_instock <= 0 ? (
                <p className="outofstock">Out of Stock</p>
            ) : (
                <div className="catalog-view">
                    {" "}
                    <p className="instock">In Stock: {product.units_instock}</p>
                    <Button
                        className="catalog-addToCart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <p className="price">${product.price}</p>
                </div>
            )}
        </div>
    );
};

export default function Catalog() {
    const [products, setProducts] = useState<ProductData[]>([]);
    console.log(products);
    useEffect(
        () =>
            onSnapshot(collection(db, "products"), (snapshot) =>
                setProducts(
                    snapshot.docs.map((doc) => doc.data() as ProductData)
                )
            ),
        []
    );

    return (
        <div className="catalog-container" id="container">
            {products.map((item: ProductData) => (
                <div key={item.name} className="catalog-item">
                    <View product={item} />
                </div>
            ))}
        </div>
    );
}
