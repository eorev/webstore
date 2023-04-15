import React from "react";
import Navbar from "../components/Navbar";
import Catalog from "../components/Catalog";

const Home = () => {
    return (
        <div>
            <Navbar
                links={[
                    { name: "About", url: "/about" },
                    { name: "Products", url: "#products" }
                ]}
                cartOnClick={() => {
                    console.log("Open Cart");
                }}
            />
            <Catalog></Catalog>
        </div>
    );
};

export default Home;
