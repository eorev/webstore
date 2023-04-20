import React from "react";
import "./Features.css";

export default function Features() {
    return (
        <div className="features">
            <div className="features-top__container">
                <h1 className="features-top__title">Featured In</h1>
                <div className="features-top__logos">
                    <img src="https://img.logoipsum.com/288.svg" alt="logo1" />
                    <img src="https://img.logoipsum.com/286.svg" alt="logo2" />
                    <img src="https://img.logoipsum.com/285.svg" alt="logo3" />
                    <img src="https://img.logoipsum.com/219.svg" alt="logo4" />
                    <img src="https://img.logoipsum.com/216.svg" alt="logo5" />
                </div>
            </div>
            <div className="features-bottom__container">
                <div className="reviews-stars__container">
                    <div className="star-rating__container">
                        <h1>4.8</h1>
                        <div className="stars">
                            <img
                                src={
                                    process.env.PUBLIC_URL + "/images/star.svg"
                                }
                                alt="star1"
                            />
                            <img
                                src={
                                    process.env.PUBLIC_URL + "/images/star.svg"
                                }
                                alt="star2"
                            />
                            <img
                                src={
                                    process.env.PUBLIC_URL + "/images/star.svg"
                                }
                                alt="star3"
                            />
                            <img
                                src={
                                    process.env.PUBLIC_URL + "/images/star.svg"
                                }
                                alt="star4"
                            />
                            <img
                                src={
                                    process.env.PUBLIC_URL + "/images/star.svg"
                                }
                                alt="star5"
                            />
                        </div>
                    </div>
                    <h2>2,321 Google Reviews</h2>
                </div>
                <div className="features-bottom__reviews">
                    <h1>Trusted by numerous Modern furniture enthusiasts.</h1>
                    <h2>Jessica Simon</h2>
                    <p>
                        I absolutely love the modern furniture collection from
                        Nestled, and their website made the purchasing process a
                        breeze.
                    </p>
                </div>
            </div>
        </div>
    );
}
