import React from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";

interface CatalogProps {
    product: ProductData;
}

const Catalog: React.FC<CatalogProps> = ({ product }) => {
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
            <p>In Stock: {product.units_instock}</p>
            <Button className="catalog-addToCart">Add to Cart</Button>
            <p>${product.price}</p>
        </div>
    );
};

export default Catalog;
