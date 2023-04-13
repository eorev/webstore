/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";
import db from "../firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";

interface CatalogProps {
    product: ProductData;
}

const View: React.FC<CatalogProps> = ({ product }) => {
    const [productUnits, setProductUnits] = useState(0);

    const handleAddToCart = () => {
        /*need to add functionality to modify json file data, so that the units in stock does not reset when the site is reloaded*/
        if (product.units_instock > 0) {
            product.units_instock--;
            setProductUnits(productUnits + 1);
        }
    };

    return (
        <div className="catalog-view">
            <h1 className="name">{product.name}</h1>
            <div className="image-container">
                <img
                    src={process.env.PUBLIC_URL + product.image}
                    alt={product.name}
                />
                <div className="text-overlay">{product.description}</div>
            </div>
            {product.units_instock <= 0 ? (
                <p>Out of Stock</p>
            ) : (
                <div className="catalog-view">
                    {" "}
                    <p>In Stock: {product.units_instock}</p>
                    <Button
                        className="catalog-addToCart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <p>${product.price}</p>
                </div>
            )}
        </div>
    );
};

export default function Catalog() {
    const [products, setProducts] = useState<ProductData[]>();
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState<ProductData>({
        name: "",
        description: "",
        id: 0,
        image: "",
        rating: 0,
        category: "",
        admin_id: 0,
        price: 0,
        units_instock: 0
    });

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    useEffect(
        () =>
            onSnapshot(collection(db, "products"), (snapshot) =>
                console.log(snapshot.docs.map((doc) => doc.data()))
            ),
        []
    );

    const handleNewProduct = async () => {
        const docRef = doc(db, "products", newProduct.name);
        const payload = {
            name: newProduct.name,
            description: newProduct.description,
            id: newProduct.id,
            image: newProduct.image,
            rating: newProduct.rating, //rating from 1 to 5
            category: newProduct.category,
            admin_id: newProduct.admin_id, //id belonging to the admin who created the product
            price: newProduct.price,
            units_instock: newProduct.units_instock
        };
        await setDoc(docRef, payload);
    };

    return (
        <div className="catalog-container" id="container">
            <div>
                <Button
                    onClick={toggleForm}
                    className="catalog-add-product-button"
                    id="AddProduct"
                >
                    Add Product
                </Button>
                <Button onClick={handleNewProduct}>new</Button>
            </div>
            {showForm && (
                <div className="catalog-add-product-container">
                    {
                        <form>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Product Description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="id"
                                placeholder="Product ID"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="image"
                                placeholder="Product Image URL"
                                value={newProduct.image}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="rating"
                                placeholder="Product Rating"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Product Category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="admin_id"
                                placeholder="Admin ID"
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Product Price"
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="units_instock"
                                placeholder="Units in Stock"
                                onChange={handleInputChange}
                            />
                            <Button
                                onClick={handleNewProduct}
                                type="submit"
                                className="catalog-button"
                                style={{
                                    backgroundColor: "black",
                                    position: "absolute",
                                    bottom: -12
                                }}
                            >
                                Add
                            </Button>
                        </form>
                    }
                </div>
            )}
        </div>
    );
}