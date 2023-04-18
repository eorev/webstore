/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";
import db from "../firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

interface CatalogProps {
    product: ProductData;
}

const View: React.FC<CatalogProps> = ({ product }) => {
    const [productUnits, setProductUnits] = useState(0);
    const productRef = doc(db, "products", product.name);

    const handleAddToCart = async () => {
        /*need to add functionality to modify json file data, so that the units in stock does not reset when the site is reloaded*/
        await updateDoc(productRef, {
            units_instock: product.units_instock - 1,
            times_purchased: product.times_purchased + 1
        });
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
