import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ProductData from "../interfaces/product";
import OrderData from "../interfaces/order";
import db from "../firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    user: User;
}

const Admin = () => {
    const { user } = UserAuth() as AuthContextType;
    const [showAddForm, setShowAddForm] = useState(false);
    const [showRemoveForm, setShowRemoveForm] = useState(false);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [removeProduct, setRemoveProduct] = useState<string>("");
    const [stockInputValues, setStockInputValues] = useState<
        Record<string, number>
    >({});
    const [newProduct, setNewProduct] = useState<ProductData>({
        name: "",
        description: "",
        id: 0,
        image: "",
        rating: 0,
        category: "",
        admin_id: user?.uid,
        price: 0,
        units_instock: 0,
        times_purchased: 0
    });
    const [binIds, setBinIds] = useState<string[]>([]);
    const [selectedOrderBin, setSelectedOrderBin] = useState<string>("");
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [binOrderIds, setBinOrderIds] = useState<string[]>([]);
    const [orderIds, setOrderIds] = useState<string[]>([]);
    const [addAdminID, setAddAdminID] = useState<string>("");
    const [removeAdminID, setRemoveAdminID] = useState<string>("");
    const [unrestrictedAdmins, setUnrestrictedAdmins] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleOrderbinChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedOrderBin(event.target.value);
        if (event.target.value != "" && event.target.value != "Select a User") {
            const ordersRef = collection(
                db,
                "orderbins",
                event.target.value,
                "orders"
            );
            getDocs(ordersRef)
                .then((querySnapshot) => {
                    const docIds = querySnapshot.docs.map((doc) => doc.id);
                    setBinOrderIds(docIds);
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
    };
    const handleOrderChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        console.log(event.target.value);
        if (
            event.target.value == "Select an Order" ||
            event.target.value == ""
        ) {
            setSelectedOrder(null);
        } else {
            const orderDoc = doc(collection(db, "orders"), event.target.value);
            setSelectedOrder((await getDoc(orderDoc)).data() as OrderData);
        }
    };

    //console.log(products);
    useEffect(() => {
        const unsubProducts = onSnapshot(
            collection(db, "products"),
            (snapshot) =>
                setProducts(
                    snapshot.docs.map((doc) => doc.data() as ProductData)
                )
        );
        const unsubOrderbins = onSnapshot(
            collection(db, "orderbins"),
            (snapshot) => {
                const newShowUserOrders: Record<string, boolean> = {};
                snapshot.docs.forEach((doc) => {
                    newShowUserOrders[doc.id] = false;
                });
                setBinIds(snapshot.docs.map((doc) => doc.id));
            }
        );
        const unsubOrderIds = onSnapshot(
            collection(db, "orders"),
            (snapshot) => {
                const newShowOrder: Record<string, boolean> = {};
                snapshot.docs.forEach((doc) => {
                    newShowOrder[doc.id] = false;
                });
                setOrderIds(snapshot.docs.map((doc) => doc.id));
            }
        );
        const unsubAdminIDs = onSnapshot(doc(db, "ids", "adminIDs"), (doc) => {
            if (doc.exists()) {
                const adminData = doc.data();
                const adminIDs = adminData.full as string[];
                if (!adminIDs.includes(user.uid)) {
                    navigate("/");
                }
            }
        });
        const unrestrictedAdmins = onSnapshot(
            doc(db, "ids", "unrestrictedAdmins"),
            (doc) => {
                if (doc.exists()) {
                    const adminData = doc.data();
                    const fullArray = adminData.full as string[];
                    setUnrestrictedAdmins(fullArray);
                }
            }
        );

        return () => {
            unrestrictedAdmins();
            unsubProducts();
            unsubOrderbins();
            unsubAdminIDs();
            unsubOrderIds();
        };
    }, [user?.uid]);

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

    const handleStockInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        productId: string
    ) => {
        event.preventDefault();
        const { value } = event.target;
        setStockInputValues({
            ...stockInputValues,
            [productId]: parseInt(value)
        });
    };

    const handleNewProduct = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const docRef = doc(db, "products", newProduct.name);
        const payload = {
            name: newProduct.name,
            description: newProduct.description,
            id: newProduct.id,
            image: newProduct.image,
            rating: newProduct.rating,
            category: newProduct.category,
            admin_id: newProduct.admin_id,
            price: newProduct.price,
            times_purchased: 0,
            units_instock: newProduct.units_instock
        };
        await setDoc(docRef, payload);
    };

    const handleRemoveProduct = async () => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", function (e) {
            e.preventDefault();
        });
        const docRef = doc(db, "products", removeProduct);
        await deleteDoc(docRef);
    };

    const handleAdminChange = async (
        event: React.FormEvent<HTMLFormElement>,
        action: string
    ) => {
        event.preventDefault();
        if (action == "add") {
            try {
                const docRef = doc(db, "ids", "adminIDs");
                const docSnap = await getDoc(docRef);
                const { full } = docSnap.data() as { full: string[] };
                await updateDoc(docRef, {
                    full: [...full, addAdminID]
                });
                setAddAdminID("");
            } catch (error) {
                console.error("Error adding adminID:", error);
            }
        } else if (action === "remove") {
            try {
                const docRef = doc(db, "ids", "adminIDs");
                const docSnap = await getDoc(docRef);
                const { full } = docSnap.data() as { full: string[] };
                const filteredFull = full.filter((id) => id !== removeAdminID);
                await updateDoc(docRef, {
                    full: filteredFull
                });
                setRemoveAdminID("");
            } catch (error) {
                console.error("Error removing adminID:", error);
            }
        } else console.log("invalid action");
    };

    return (
        <div className="products-container">
            <div className="products_view">
                <h1>Products</h1>
                <ul>
                    {products.map((product: ProductData) => (
                        <li key={product.id}>
                            <div className="product-container">
                                <span className="product-name">
                                    {product.name}
                                    <br></br>
                                    Units: {product.units_instock}
                                </span>
                                <input
                                    className="product-input"
                                    type="number"
                                    placeholder="units"
                                    value={stockInputValues[product.name] || ""}
                                    onChange={(event) =>
                                        handleStockInputChange(
                                            event,
                                            product.name
                                        )
                                    }
                                />
                                <button
                                    className="product-button"
                                    onClick={async () => {
                                        const productRef = doc(
                                            db,
                                            "products",
                                            product.name
                                        );
                                        await updateDoc(productRef, {
                                            units_instock:
                                                stockInputValues[product.name]
                                        });
                                    }}
                                    data-testid="update-units"
                                >
                                    Update Units
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="add-remove-button-container">
                <Button onClick={() => toggleForm("add")} id="AddProduct">
                    Add Product
                </Button>
                <Button onClick={() => toggleForm("remove")} id="AddProduct">
                    Remove Product
                </Button>
            </div>
            <div>
                <p>Orders</p>
                <select
                    onChange={handleOrderbinChange}
                    data-testid="user-orders"
                >
                    <option value="">Select a User</option>
                    {binIds.map((orderbin) => (
                        <option key={orderbin} value={orderbin}>
                            {orderbin}
                        </option>
                    ))}
                </select>
                {selectedOrderBin != "" && selectedOrderBin != "Select a User" && (
                    <ul>
                        {binOrderIds.map((orderId) => {
                            if (orderId !== "null") {
                                return (
                                    <li key={orderId}>
                                        {orderId}{" "}
                                        <button
                                            onClick={() => {
                                                const orderDocRef = doc(
                                                    collection(
                                                        db,
                                                        "orderbins",
                                                        selectedOrderBin,
                                                        "orders"
                                                    ),
                                                    orderId
                                                );
                                                deleteDoc(orderDocRef);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                )}
            </div>
            <div className="column-container">
                {unrestrictedAdmins.includes(user?.uid) && (
                    <div>
                        Add Admin
                        <form
                            onSubmit={(event) => {
                                handleAdminChange(event, "add");
                            }}
                        >
                            <input
                                type="text"
                                value={addAdminID}
                                onChange={(event) =>
                                    setAddAdminID(event.target.value)
                                }
                            />
                            <button type="submit">Add</button>
                        </form>
                        Remove Admin
                        <form
                            onSubmit={(event) => {
                                handleAdminChange(event, "remove");
                            }}
                        >
                            <input
                                type="text"
                                value={removeAdminID}
                                onChange={(event) =>
                                    setRemoveAdminID(event.target.value)
                                }
                            />
                            <button type="submit">Remove</button>
                        </form>
                    </div>
                )}
                <div>_________________________</div>
                <div>
                    <p>Pending Orders</p>
                    <select onChange={handleOrderChange}>
                        <option value="">Select an Order</option>
                        {orderIds
                            .filter((orderbin) => orderbin !== "null")
                            .map((orderbin) => (
                                <option key={orderbin} value={orderbin}>
                                    {orderbin}
                                </option>
                            ))}
                    </select>
                    <br></br>
                    {selectedOrder != null ? (
                        <div>
                            <span>
                                User Name:{" "}
                                {JSON.parse(selectedOrder.mailing_address).name}
                                <br />
                            </span>
                            <span>
                                User ID: {selectedOrder.userid}
                                <br />
                            </span>
                            <span>
                                Order ID: {selectedOrder.id} <br />
                            </span>
                            <span>
                                Mailing Address:
                                {
                                    JSON.parse(selectedOrder.mailing_address)
                                        .address
                                }
                                <br />
                            </span>
                            <span>
                                Card Number:{" "}
                                {"**** **** **** " +
                                    JSON.parse(
                                        selectedOrder.payment_info
                                    ).number.substr(-4)}
                            </span>
                            <br></br>
                            <button
                                onClick={() => {
                                    const userDocRef = doc(
                                        collection(db, "orderbins"),
                                        selectedOrder.userid.toString()
                                    );
                                    const ordersCollectionRef = collection(
                                        userDocRef,
                                        "orders"
                                    );
                                    const newOrderDocRef = doc(
                                        ordersCollectionRef,
                                        selectedOrder.id.toString()
                                    );
                                    setDoc(newOrderDocRef, selectedOrder);
                                    const orderDocRef = doc(
                                        collection(db, "orders"),
                                        selectedOrder.id.toString()
                                    );
                                    deleteDoc(orderDocRef);
                                    setSelectedOrder(null);
                                }}
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    const orderDoc = doc(
                                        collection(db, "orders"),
                                        selectedOrder.id.toString()
                                    );
                                    deleteDoc(orderDoc);
                                    setSelectedOrder(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
            {showAddForm && (
                <div className="catalog-add-remove-product-container">
                    <Button
                        className="close-add-product-form"
                        onClick={() => toggleForm("add")}
                    >
                        X
                    </Button>
                    {
                        <form
                            onSubmit={handleNewProduct}
                            data-testid="addProductForm"
                        >
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
                    <Button
                        className="close-remove-product-form"
                        onClick={() => toggleForm("remove")}
                    >
                        X
                    </Button>
                    {
                        <form
                            onSubmit={() => toggleForm("remove")}
                            data-testid="removeProductForm"
                        >
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
