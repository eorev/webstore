import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import catalog from "./data/products.json";

function App() {
    return (
        <div className="App">
            <Navbar
                links={[
                    { name: "About", url: "#about" },
                    { name: "Products", url: "#products" }
                ]}
                cartOnClick={() => {
                    console.log("Open Cart");
                }}
            />
            <span>{catalog.PRODUCTS[0].name}</span>
        </div>
    );
}

export default App;
