import React from "react";
import "./Navbar.css";

type NavbarProps = {
    links: { name: string; url: string }[];
    cartOnClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ links, cartOnClick }) => {
    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <h1>Nestled</h1>
            </div>
            <ul className="navbar__links">
                {links.map((link) => (
                    <li key={link.url} className="navbar__links-item">
                        <a href={link.url}>{link.name}</a>
                    </li>
                ))}
                <button
                    className="navbar__cart-btn navbar__links-item"
                    onClick={cartOnClick}
                >
                    Cart
                </button>
            </ul>
        </nav>
    );
};

export default Navbar;
