import React from "react";
import "./Products.css";
import Catalog from "../components/Catalog";

const Products: React.FC = () => {
    return (
        <div className="products">
            <h1>Products</h1>
            <div data-testid="catalog-container">
                <div data-testid="products">
                    <Catalog></Catalog>
                </div>
            </div>
        </div>
    );
};

export default Products;
