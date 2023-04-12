import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Catalog from "./components/Catalog";
import "./components/Catalog.css";

function App() {
    return (
        <div className="App">
            <Navbar></Navbar>
            <Catalog></Catalog>
        </div>
    );
}

export default App;
