import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="header__row">
                <div className="header__left">
                    <h1>Welcome to Nestled!</h1>
                </div>
                <div className="header__right">
                    <h2>Find your Piece.</h2>
                    <p>Browse a Curated Collection</p>
                    <Link to="/products" className="header__button">
                        <button>Products</button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
