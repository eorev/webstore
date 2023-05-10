import React, { useEffect, useState } from "react";
import "./HotProducts.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import db from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ProductData from "../interfaces/product";

function isUrl(str: string): boolean {
    const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?(\?[^\s]*)?$/;
    return urlPattern.test(str);
}

const HotProducts = () => {
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(
        () =>
            onSnapshot(collection(db, "products"), (snapshot) =>
                setProducts(
                    snapshot.docs
                        .map((doc) => doc.data() as ProductData)
                        .filter((product) => product.times_purchased >= 3)
                )
            ),
        []
    );

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: products.length < 3 ? products.length : 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="hotProducts-container">
            <div className="hotProducts">
                <h1>🔥 Hot Products 🔥</h1>
                <h2>Get them before they&apos;re gone!</h2>
                <Slider {...settings}>
                    {products.map((product) => (
                        <div
                            key={product.name}
                            className="hotProducts__product"
                        >
                            <img
                                src={
                                    isUrl(product.image)
                                        ? product.image
                                        : process.env.PUBLIC_URL + product.image
                                }
                                alt={product.name}
                            />
                            <div className="hotProducts__productInfo">
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <p>Stock: {product.units_instock}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default HotProducts;
