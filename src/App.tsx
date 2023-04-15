import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Catalog from "./components/Catalog";
import "./components/Catalog.css";

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
            <Catalog></Catalog>
        </div>
    );
}

export default App;
