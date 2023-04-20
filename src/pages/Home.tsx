import React from "react";
import Header from "../components/Header";
import HotProducts from "../components/HotProducts";
import Features from "../components/Features";

const Home = () => {
    return (
        <div className="home">
            <Header></Header>
            <Features></Features>
            <HotProducts></HotProducts>
        </div>
    );
};

export default Home;
