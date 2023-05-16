import React, { useEffect, useState } from "react";
import "./Checkout.css";
import cartProductData from "../interfaces/cartProduct";
import db from "../firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import { PaymentFormData } from "../components/PaymentForm";
import DialogModal from "../components/Dialog";

interface AuthContextType {
    user: User;
}

const NON_AUTH_USER_ID_KEY = "nonAuthUserId";
const USED_PROMO = "false";

let confirmationNumber =
    Math.floor(Math.random() * (99999999 - 13748917 + 1)) + 13748917;

const Checkout = () => {
    const { user } = UserAuth() as AuthContextType;
    const navigate = useNavigate();
    const [products, setProducts] = useState<cartProductData[]>([]);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [removedProducts, setRemovedProducts] = useState<cartProductData[]>(
        []
    );
    const [selectedShipping, setSelectedShipping] = useState<string>("");
    const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
    const [paymentInfo, setPaymentInfo] = useState({
        number: "",
        expiration: "",
        cvv: "",
        name: ""
    });
    const [tempShippingAddress, setTempShippingAddress] = useState({
        name: "",
        number: "",
        address: "",
        city: "",
        state: "",
        zip: 0
    });
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        number: "",
        address: "",
        city: "",
        state: "",
        zip: 0
    });
    const [hasShippingAddress, setHasShippingAddress] =
        useState<boolean>(false);
    const [hasPaymentInfo, setHasPaymentInfo] = useState<boolean>(false);
    const [showShippingForm, setShowShippingForm] = useState<boolean>(false);
    const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
    const [promoCode, setPromoCode] = useState<string>("");
    const [verifiedPromo, setVerifiedPromo] = useState<string>("");
    const [addedPromo, setAddedPromo] = useState<boolean>(false);

    const uid = localStorage.getItem(NON_AUTH_USER_ID_KEY);
    const promoCodes: { [key: string]: number } = {
        first50off: 50
    };

    const [dialogModalOpen, setDialogModalOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogCloseMessage, setDialogCloseMessage] = useState("");

    function dialog(title: string, message: string, closeMessage: string) {
        setDialogModalOpen(true);
        setDialogMessage(message);
        setDialogTitle(title);
        setDialogCloseMessage(closeMessage);
    }

    function closeModal() {
        setDialogModalOpen(false);
        setDialogMessage("");
        setDialogTitle("");
        setDialogCloseMessage("");
    }

    useEffect(() => {
        if (!user) {
            const unsub = onSnapshot(
                collection(db, "carts", "temp" + uid, "products"),
                (snapshot) => {
                    const cartProducts = snapshot.docs
                        .map((doc) => doc.data() as cartProductData)
                        .filter((product) => product.name != "null");
                    setProducts(cartProducts);
                    const totalCost = cartProducts.reduce(
                        (accumulator, product) =>
                            accumulator + product.price * product.quantity,
                        0
                    );
                    setSubTotal(totalCost);
                }
            );
            return () => unsub();
        }
        if (user) {
            const unsub = onSnapshot(
                collection(db, "carts", user.uid, "products"),
                (snapshot) => {
                    const cartProducts = snapshot.docs
                        .map((doc) => doc.data() as cartProductData)
                        .filter((product) => product.name != "null");
                    setProducts(cartProducts);
                    const totalCost = cartProducts.reduce(
                        (accumulator, product) =>
                            accumulator + product.price * product.quantity,
                        0
                    );
                    setSubTotal(totalCost);
                }
            );
            return () => unsub();
        }
    }, [user]);

    useEffect(() => {
        if (verifiedPromo in promoCodes && addedPromo && subTotal >= 150) {
            setTotal(subTotal + shippingCost - promoCodes[verifiedPromo]);
        } else {
            setTotal(subTotal + shippingCost);
        }
    }, [subTotal, shippingCost, promoCodes, promoCode]);

    const handleOrderPlacement = async () => {
        confirmationNumber =
            Math.floor(Math.random() * (99999999 - 13748917 + 1)) + 13748917;
        setOrderPlaced(true);
        if (!user) {
            const cartDocRef = doc(
                db,
                "carts",
                "temp" + localStorage.getItem(NON_AUTH_USER_ID_KEY)
            );
            const querySnapshot = await getDocs(
                query(
                    collection(cartDocRef, "products"),
                    where("id", "!=", null)
                )
            );
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            const docRef = doc(db, "orders", confirmationNumber.toString());
            const payload = {
                id: confirmationNumber,
                userid: "temp" + uid,
                date: new Date().toLocaleDateString("en-US"),
                mailing_address: JSON.stringify(shippingAddress),
                payment_info: JSON.stringify(paymentInfo),
                products: products,
                cost: total
            };
            await setDoc(docRef, payload);
        }
        if (user) {
            const cartDocRef = doc(db, "carts", user.uid);
            const querySnapshot = await getDocs(
                query(
                    collection(cartDocRef, "products"),
                    where("id", "!=", null)
                )
            );
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            const docRef = doc(db, "orders", confirmationNumber.toString());
            const payload = {
                id: confirmationNumber,
                userid: user.uid,
                date: new Date().toLocaleDateString("en-US"),
                mailing_address: JSON.stringify(shippingAddress),
                payment_info: JSON.stringify(paymentInfo),
                products: products,
                cost: total
            };
            await setDoc(docRef, payload);
        }
        if (addedPromo) {
            localStorage.setItem(USED_PROMO, "true");
        } else {
            localStorage.setItem(USED_PROMO, "false");
        }
    };

    const handleShippingInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setTempShippingAddress({ ...tempShippingAddress, [name]: value });
    };

    const handlePaymentSubmit = (formData: PaymentFormData) => {
        setPaymentInfo({
            number: formData.number,
            expiration: formData.expiration,
            cvv: formData.cvc,
            name: formData.name
        });
        setShowPaymentForm(false);
        setHasPaymentInfo(true);
    };

    const handlePromoInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setPromoCode(value);
    };

    const checkPromoCode = () => {
        if (localStorage.getItem(USED_PROMO) === "true") {
            dialog(
                "Checkout Error",
                "This promo code has already been used!",
                "close"
            );
        } else if (subTotal < 150) {
            dialog("Checkout Error", "Subtotal must be at least $150", "close");
        } else if (promoCode in promoCodes) {
            setAddedPromo(true);
            setVerifiedPromo(promoCode);
        }
    };

    const handleRemove = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp" + uid, "products"),
                product.name
            );
            setRemovedProducts([...removedProducts, product]);
            await deleteDoc(productRef);
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            setRemovedProducts([...removedProducts, product]);
            await deleteDoc(productRef);
        }
    };

    const handleAddToCart = async (product: cartProductData) => {
        if (!user) {
            const newProductRef = doc(
                collection(db, "carts", "temp" + uid, "products"),
                product.name
            );
            const productSnapshot = await getDoc(newProductRef);
            if (productSnapshot.exists()) {
                await updateDoc(newProductRef, {
                    quantity: increment(1),
                    units_instock: increment(-1)
                });
            } else {
                await setDoc(newProductRef, {
                    name: product.name,
                    description: product.description,
                    id: product.id,
                    image: product.image,
                    rating: product.rating, //rating from 1 to 5
                    category: product.category,
                    admin_id: product.admin_id, //id belonging to the admin who created the product
                    price: product.price,
                    units_instock: product.units_instock,
                    quantity: product.quantity
                });
            }
        }
        if (user) {
            const newProductRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            const productSnapshot = await getDoc(newProductRef);
            if (productSnapshot.exists()) {
                await updateDoc(newProductRef, {
                    quantity: increment(1),
                    units_instock: increment(-1)
                });
            } else {
                await setDoc(newProductRef, {
                    name: product.name,
                    description: product.description,
                    id: product.id,
                    image: product.image,
                    rating: product.rating, //rating from 1 to 5
                    category: product.category,
                    admin_id: product.admin_id, //id belonging to the admin who created the product
                    price: product.price,
                    units_instock: product.units_instock,
                    quantity: product.quantity
                });
            }
        }
        setRemovedProducts((prevProducts) =>
            prevProducts.filter((p) => p.name !== product.name)
        );
    };

    const increaseQuantity = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp" + uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(1),
                units_instock: increment(-1)
            });
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(1),
                units_instock: increment(-1)
            });
        }
    };

    const decreaseQuantity = async (product: cartProductData) => {
        if (!user) {
            const productRef = doc(
                collection(db, "carts", "temp" + uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(-1)
            });

            const updatedProduct = await getDoc(productRef);
            const updatedQuantity = updatedProduct.data()?.quantity;

            if (updatedQuantity === 0) {
                setRemovedProducts([...removedProducts, product]);
                await deleteDoc(productRef);
            }
        }
        if (user) {
            const productRef = doc(
                collection(db, "carts", user.uid, "products"),
                product.name
            );
            await updateDoc(productRef, {
                quantity: increment(-1),
                units_instock: increment(1)
            });

            const updatedProduct = await getDoc(productRef);
            const updatedQuantity = updatedProduct.data()?.quantity;

            if (updatedQuantity === 0) {
                setRemovedProducts([...removedProducts, product]);
                await deleteDoc(productRef);
            }
        }
    };

    function isUrl(str: string): boolean {
        const urlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?(\?[^\s]*)?$/;
        return urlPattern.test(str);
    }

    return (
        <div>
            {dialogModalOpen && (
                <DialogModal
                    message={dialogMessage}
                    title={dialogTitle}
                    closeMessage={dialogCloseMessage}
                    closeModal={closeModal}
                />
            )}
            {!orderPlaced && (
                <div className="checkout-container">
                    <h1 className="cart-title">Cart</h1>
                    <div
                        className="cart-display-container"
                        data-testid="cart-display-container"
                    >
                        <div
                            className="products-container"
                            data-testid="products-container"
                        >
                            {products.map((product: cartProductData) => (
                                <div
                                    key={product.name}
                                    className="cart-product-display"
                                >
                                    <div className="img-container">
                                        <img
                                            src={
                                                isUrl(product.image)
                                                    ? product.image
                                                    : process.env.PUBLIC_URL +
                                                      product.image
                                            }
                                            alt={product.name}
                                        />
                                    </div>

                                    <span className="name">{product.name}</span>
                                    <span className="instock">In Stock</span>
                                    <span className="price">
                                        ${product.price}
                                    </span>
                                    <span className="quantity">
                                        Quantity: {product.quantity}
                                        <button
                                            onClick={() =>
                                                increaseQuantity(product)
                                            }
                                            disabled={
                                                product.units_instock === 0
                                            }
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(product)
                                            }
                                        >
                                            -
                                        </button>
                                    </span>
                                    <div className="buttons">
                                        <button
                                            onClick={() => {
                                                handleRemove(product);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="checkout-summary-container">
                        <h2
                            className="order-summary"
                            data-testid="order-summary"
                        >
                            Order Summary
                            <span className="order-summary-underline"></span>
                        </h2>
                        <h3 className="subtotal-title">Subtotal:</h3>
                        <h3 className="subtotal" data-testid="subtotal">
                            ${subTotal}
                        </h3>
                        <div
                            className="shipping-options"
                            data-testid="shipping-option"
                        >
                            <span className="shipping-options-title">
                                Shipping Options
                            </span>
                            <br></br>
                            <label>
                                <input
                                    type="radio"
                                    onChange={() => {
                                        setSelectedShipping("standard");
                                        setShippingCost(5.99);
                                    }}
                                    checked={selectedShipping === "standard"}
                                    data-testid="standard-shipping"
                                />
                                Standard Shipping
                                <span style={{ marginLeft: "65px" }}>
                                    $5.99
                                </span>
                                <br></br>
                                <input
                                    type="radio"
                                    onChange={() => {
                                        setSelectedShipping("express");
                                        setShippingCost(10.99);
                                    }}
                                    checked={selectedShipping === "express"}
                                    data-testid="express-shipping"
                                />
                                Express Shipping
                                <span style={{ marginLeft: "67px" }}>
                                    $10.99
                                </span>
                            </label>
                        </div>
                        <h3 className="total-title">Total: </h3>
                        <h3 className="total" data-testid="total">
                            ${total.toFixed(2)}
                        </h3>
                        <br></br>
                        <br></br>
                        <div className="shipping-info">
                            <br></br>
                            <h4>Shipping Address</h4>
                            {hasShippingAddress ? (
                                <>
                                    <span>
                                        {shippingAddress?.name} |{" "}
                                        {shippingAddress?.address},{" "}
                                        {shippingAddress?.city},{" "}
                                        {shippingAddress?.state}{" "}
                                        {shippingAddress?.zip}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setShowShippingForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowShippingForm(true);
                                    }}
                                >
                                    Add Shipping
                                </button>
                            )}
                        </div>
                        <div className="payment-info">
                            <h4>Payment Method</h4>
                            {hasPaymentInfo ? (
                                <>
                                    <span>
                                        {paymentInfo.name},{paymentInfo.number},
                                        {paymentInfo.expiration}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (!showShippingForm) {
                                                setShowPaymentForm(
                                                    !showPaymentForm
                                                );
                                            }
                                        }}
                                    >
                                        Change
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!showShippingForm) {
                                            setShowPaymentForm(
                                                !showPaymentForm
                                            );
                                        }
                                    }}
                                >
                                    Add Payment
                                </button>
                            )}
                        </div>
                        <div>
                            <h4>Promo</h4>
                            <div>
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={handlePromoInputChange}
                                />
                                <button onClick={checkPromoCode}>Add</button>
                            </div>
                        </div>
                        <div className="placeorder">
                            <button
                                onClick={handleOrderPlacement}
                                disabled={
                                    selectedShipping === "" ||
                                    !hasPaymentInfo ||
                                    !hasShippingAddress ||
                                    products.length == 0
                                }
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                    <div
                        className="recently-deleted"
                        data-testid="recently-deleted"
                    >
                        <h4>Recently Deleted</h4>
                        {removedProducts.map((product: cartProductData) => (
                            <div key={product.name}>
                                <span>
                                    {product.name} | Quantity:{" "}
                                    {product.quantity} | Price:
                                    {product.price * product.quantity}
                                </span>
                                <button
                                    onClick={() => {
                                        product.quantity++;
                                        const updatedProducts = [
                                            ...removedProducts
                                        ];
                                        const index = updatedProducts.findIndex(
                                            (p) => p.name === product.name
                                        );
                                        updatedProducts[index] = product;
                                        setRemovedProducts(updatedProducts);
                                    }}
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => {
                                        product.quantity--;
                                        const updatedProducts = [
                                            ...removedProducts
                                        ];
                                        const index = updatedProducts.findIndex(
                                            (p) => p.name === product.name
                                        );
                                        updatedProducts[index] = product;
                                        setRemovedProducts(updatedProducts);
                                    }}
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        handleAddToCart(product);
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                    {showShippingForm && (
                        <div className="checkout-form-container">
                            <button onClick={() => setShowShippingForm(false)}>
                                X
                            </button>
                            {
                                <form data-testid="addShippingForm">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={shippingAddress.name}
                                        onChange={handleShippingInputChange}
                                        data-testid="shippingName"
                                    />
                                    <label>Number</label>
                                    <input
                                        type="text"
                                        name="number"
                                        placeholder={shippingAddress.number}
                                        onChange={handleShippingInputChange}
                                        data-testid="shippingNumber"
                                    />
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder={shippingAddress.address}
                                        onChange={handleShippingInputChange}
                                        data-testid="shippingAddress"
                                    />
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder={shippingAddress.city}
                                        onChange={handleShippingInputChange}
                                    />
                                    <label>State</label>
                                    <input
                                        type="string"
                                        name="state"
                                        placeholder={shippingAddress.state}
                                        onChange={handleShippingInputChange}
                                    />
                                    <label>Zip Code</label>
                                    <input
                                        type="number"
                                        name="zip"
                                        placeholder={
                                            shippingAddress.zip === 0
                                                ? ""
                                                : shippingAddress.zip.toString()
                                        }
                                        onChange={handleShippingInputChange}
                                    />
                                    <button
                                        type="submit"
                                        className="catalog-button"
                                        style={{
                                            backgroundColor:
                                                "rgba(0, 108, 209, 0.63)",
                                            position: "absolute",
                                            bottom: -1
                                        }}
                                        onClick={() => {
                                            setShippingAddress(
                                                tempShippingAddress
                                            );
                                            setHasShippingAddress(true);
                                            setShowShippingForm(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                </form>
                            }
                        </div>
                    )}
                    {showPaymentForm && (
                        <div
                            className="checkout-paymentform-container"
                            data-testid="payment-form-container"
                        >
                            <PaymentForm
                                onSubmit={handlePaymentSubmit}
                            ></PaymentForm>
                            <div className="close">
                                <button
                                    onClick={() => {
                                        setShowPaymentForm(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {orderPlaced && (
                <div className="underlay" data-testid="underlay">
                    <div className="order-confirmation">
                        <img
                            src={`${process.env.PUBLIC_URL}/images/greenCheck.png`}
                            alt="Green check"
                        />
                        <h1 className="title">Order Confirmation</h1>
                        <h2 className="title">#{confirmationNumber}</h2>
                        <div className="buttons">
                            <button
                                onClick={() => {
                                    navigate("/");
                                }}
                                data-testid="homeButton"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
