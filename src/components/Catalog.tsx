import React, { useEffect, useState } from "react";
import ProductData from "../interfaces/product";
import { Button } from "react-bootstrap";
import "./Catalog.css";
import db from "../firebase";
import {
    collection,
    doc,
    getDoc,
    increment,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { User } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

interface CatalogProps {
    product: ProductData;
}

interface AuthContextType {
    user: User;
}

interface FilterCategories {
    [category: string]: boolean;
}

const initialFilters: FilterCategories = {
    outdoor: false,
    bedroom: false,
    table: false,
    mirror: false,
    sofa: false,
    decor: false,
    storage: false,
    chair: false,
    lighting: false
};

const NON_AUTH_USER_ID_KEY = "nonAuthUserId";

const View: React.FC<CatalogProps> = ({ product }) => {
    const productRef = doc(db, "products", product.name);
    const { user } = UserAuth() as AuthContextType;

    const handleAddToCart = async () => {
        await updateDoc(productRef, {
            units_instock: product.units_instock - 1,
            times_purchased: product.times_purchased + 1
        });
        const userId = localStorage.getItem(NON_AUTH_USER_ID_KEY);
        if (!userId) {
            let nonAuthUserId = localStorage.getItem(NON_AUTH_USER_ID_KEY);
            if (!nonAuthUserId) {
                nonAuthUserId = uuidv4();
                localStorage.setItem(NON_AUTH_USER_ID_KEY, nonAuthUserId);
            }
            console.log(localStorage.getItem(NON_AUTH_USER_ID_KEY));
        }
        if (!user) {
            const newProductRef = doc(
                collection(db, "carts", "temp" + userId, "products"),
                product.name
            );
            const productSnapshot = await getDoc(newProductRef);
            if (productSnapshot.exists()) {
                await updateDoc(newProductRef, {
                    quantity: increment(1),
                    units_instock: increment(-1)
                });
                console.log("increased quantity");
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
                    units_instock: product.units_instock - 1,
                    quantity: 1
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
                console.log("increased quantity");
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
                    units_instock: product.units_instock - 1,
                    quantity: 1
                });
            }
        }
    };

    function isUrl(str: string): boolean {
        const urlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?(\?[^\s]*)?$/;
        return urlPattern.test(str);
    }

    const image = isUrl(product.image)
        ? product.image
        : process.env.PUBLIC_URL + product.image;

    return (
        <div className="catalog-view">
            <h1 className="name">{product.name}</h1>
            <div className="image-container">
                <img src={image} alt={product.name} />
                <div className="text-overlay">{product.description}</div>
            </div>
            {product.units_instock <= 0 ? (
                <p className="outofstock">Out of Stock</p>
            ) : (
                <div className="catalog-view">
                    {" "}
                    <p className="instock">In Stock: {product.units_instock}</p>
                    <Button
                        className="catalog-addToCart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <p className="price">${product.price}</p>
                </div>
            )}
        </div>
    );
};

export default function Catalog() {
    const [originalProducts, setOriginalProducts] = useState<ProductData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [filters, setFilters] = useState<FilterCategories>(initialFilters);
    const [filterValue, setFilterValue] = useState<string>(""); // State to store the selected filter value

    function handleCategoryClick(category: string) {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: !prevFilters[category]
        }));
    }

    const handleSortFilterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterValue(event.target.value);

        if (event.target.value === "") {
            setProducts(originalProducts);
        } else {
            const sortedProducts = [...products];
            if (event.target.value === "priceLowToHigh") {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (event.target.value === "priceHighToLow") {
                sortedProducts.sort((a, b) => b.price - a.price);
            }
            setProducts(sortedProducts);
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "products"),
            (snapshot) => {
                const productsData = snapshot.docs.map(
                    (doc) => doc.data() as ProductData
                );
                setOriginalProducts(productsData);
                let filteredProducts = productsData;
                if (Object.values(filters).every((value) => !value)) {
                    filteredProducts = productsData;
                } else {
                    filteredProducts = productsData.filter(
                        (product) => filters[product.category.toLowerCase()]
                    );
                }

                if (filterValue === "priceLowToHigh") {
                    filteredProducts.sort((a, b) => a.price - b.price);
                } else if (filterValue === "priceHighToLow") {
                    filteredProducts.sort((a, b) => b.price - a.price);
                }

                setProducts(filteredProducts);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [filters, filterValue]);

    return (
        <div>
            <div className="filter-container">
                <select
                    className="navbar__filter-dropdown"
                    value={filterValue}
                    onChange={handleSortFilterChange}
                    data-testid="filter-dropdown"
                >
                    <option value="">Sort By</option>
                    <option value="priceLowToHigh">Price Low to High</option>
                    <option value="priceHighToLow">Price High to Low</option>
                </select>
                <div>
                    <div style={{ marginBottom: "4px" }}>
                        <span
                            className="category-title"
                            style={{ textDecoration: "underline" }}
                        >
                            <br />
                            Category
                        </span>
                    </div>
                    {Object.keys(filters).map((category) => (
                        <div key={category}>
                            <label htmlFor={category}>{category}</label>
                            <input
                                type="checkbox"
                                id={category}
                                checked={filters[category]}
                                onChange={() => handleCategoryClick(category)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="catalog-container" id="container">
                {products.map((item: ProductData) => (
                    <div key={item.name} className="catalog-item">
                        <View product={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
