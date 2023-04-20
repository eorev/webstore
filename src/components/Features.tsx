import React from "react";
import "./Features.css";

export default function Features() {
    return (
        <div className="features">
            <div className="features-top__container">
                <h1 className="features-top__title">Featured In</h1>
                <div className="features-top__logos">
                    <img src="https://img.logoipsum.com/288.svg" alt="logo1" />
                    <img src="https://img.logoipsum.com/288.svg" alt="logo2" />
                    <img src="https://img.logoipsum.com/288.svg" alt="logo3" />
                    <img src="https://img.logoipsum.com/288.svg" alt="logo4" />
                    <img src="https://img.logoipsum.com/288.svg" alt="logo5" />
                </div>
            </div>
            <div className="features-bottom__container">
                <div className="features-bottom__reviews">
                    <h1>4.8</h1>
                    <ul className="stars">
                        <li className="star">
                            <i className="fas fa-star"></i>
                        </li>
                        <li className="star">
                            <i className="fas fa-star"></i>
                        </li>
                        <li className="star">
                            <i className="fas fa-star"></i>
                        </li>
                        <li className="star">
                            <i className="fas fa-star"></i>
                        </li>
                        <li className="star">
                            <i className="fas fa-star"></i>
                        </li>
                    </ul>
                    <h2>2,321 Google Reviews</h2>
                </div>
            </div>
        </div>
    );
}
