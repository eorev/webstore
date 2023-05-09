import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="header__row">
                <div className="header__left">
                    <h1>Welcome to Nestled!</h1>
                    <p>
                        Welcome to Nestled, your destination for modern
                        furniture curated with a discerning eye.
                    </p>
                    <Link to="/products" className="header__button">
                        <button>Browse Our Catalog</button>
                    </Link>
                </div>
                <div className="header__right">
                    <img
                        src={process.env.PUBLIC_URL + "/images/header.svg"}
                        alt="headerSVG"
                        className="header__image"
                    />
                </div>
            </div>
        </header>
    );
}
