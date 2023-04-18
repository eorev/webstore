import React from "react";
import "./Products.css";
import Catalog from "../components/Catalog";

const Products = () => {
    return (
        <div className="products">
            <h1>Products</h1>
            <Catalog></Catalog>
        </div>
    );
};

export default Products;
