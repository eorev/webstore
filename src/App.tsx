import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import inventory from "./data/products.json";
import Catalog from "./components/Catalog";
import "./components/Catalog.css";
import product from "./interfaces/product";

function App() {
    return (
        <div className="App">
            <Navbar></Navbar>
            <div className="catalog-container">
                {inventory.PRODUCTS.map((item: product) => (
                    <div key={item.name} className="catalog-item">
                        <Catalog product={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
