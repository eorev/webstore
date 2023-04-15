import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import ProductData from "../interfaces/product";
import db from "../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

const Admin = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showRemoveForm, setShowRemoveForm] = useState(false);
    const [removeProduct, setRemoveProduct] = useState<string>("");
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

    const toggleForm = (name: string) => {
        if (name === "add") {
            setShowAddForm(!showAddForm);
            setShowRemoveForm(false);
        }
        if (name === "remove") {
            setShowRemoveForm(!showRemoveForm);
            setShowAddForm(false);
        }
    };

    const handleAddInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleRemoveInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        const { value } = event.target;
        setRemoveProduct(value);
    };

    const handleNewProduct = async () => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", function (e) {
            e.preventDefault(); // prevent default form submission behavior
            // your form submission logic here
        });
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

    const handleRemoveProduct = async () => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", function (e) {
            e.preventDefault(); // prevent default form submission behavior
            // your form submission logic here
        });
        const docRef = doc(db, "products", removeProduct);
        await deleteDoc(docRef);
    };
    return (
        <div>
            <Link to="/webstore">
                <button>Home</button>
            </Link>
            <div>
                <Button
                    onClick={() => toggleForm("add")}
                    className="catalog-add-product-button"
                    id="AddProduct"
                >
                    Add Product
                </Button>
            </div>
            <div>
                <Button
                    onClick={() => toggleForm("remove")}
                    className="catalog-remove-product-button"
                    id="AddProduct"
                >
                    Remove Product
                </Button>
            </div>
            {showAddForm && (
                <div className="catalog-add-remove-product-container">
                    {
                        <form onSubmit={() => toggleForm("add")}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Product Description"
                                value={newProduct.description}
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="number"
                                name="id"
                                placeholder="Product ID"
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="text"
                                name="image"
                                placeholder="Product Image URL"
                                value={newProduct.image}
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="number"
                                name="rating"
                                placeholder="Product Rating"
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Product Category"
                                value={newProduct.category}
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="number"
                                name="admin_id"
                                placeholder="Admin ID"
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Product Price"
                                onChange={handleAddInputChange}
                            />
                            <input
                                type="number"
                                name="units_instock"
                                placeholder="Units in Stock"
                                onChange={handleAddInputChange}
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
            {showRemoveForm && (
                <div className="catalog-add-remove-product-container">
                    {
                        <form onSubmit={() => toggleForm("remove")}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={removeProduct}
                                onChange={handleRemoveInputChange}
                            />
                            <Button
                                onClick={handleRemoveProduct}
                                type="submit"
                                className="catalog-button"
                                style={{
                                    backgroundColor: "black",
                                    position: "absolute",
                                    bottom: -12
                                }}
                            >
                                Remove
                            </Button>
                        </form>
                    }
                </div>
            )}
        </div>
    );
};

export default Admin;
