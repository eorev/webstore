import React, { useState } from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";
import inventory from "../data/products.json";

interface CatalogProps {
    product: ProductData;
}

const View: React.FC<CatalogProps> = ({ product }) => {
    const [productUnits, setProductUnits] = useState(0);

    const handleAddToCart = () => {
        /*need to add functionality to modify json file data, so that the units in stock does not reset when the site is reloaded*/
        if (product.units_instock > 0) {
            product.units_instock--;
            setProductUnits(productUnits + 1);
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
                <p>Out of Stock</p>
            ) : (
                <div className="catalog-view">
                    {" "}
                    <p>In Stock: {product.units_instock}</p>
                    <Button
                        className="catalog-addToCart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <p>${product.price}</p>
                </div>
            )}
        </div>
    );
};

export default function Catalog() {
    return (
        <div className="catalog-container">
            {inventory.PRODUCTS.map((item: ProductData) => (
                <div key={item.name} className="catalog-item">
                    <View product={item} />
                </div>
            ))}
        </div>
    );
}
