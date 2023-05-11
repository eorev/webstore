import React, { useState } from "react";
import "./Products.css";
import Catalog from "../components/Catalog";

const Products: React.FC = () => {
    const [filterValue, setFilterValue] = useState<string>(""); // State to store the selected filter value

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterValue(event.target.value);
        // Apply the filter logic here based on the selected value
        // You can update the Catalog component with the filtered data
    };

    return (
        <div className="products">
            <div>
                <div className="navbar__links-item">
                    <select
                        className="navbar__filter-dropdown"
                        value={filterValue}
                        onChange={handleFilterChange}
                        data-testid="filter-dropdown"
                    >
                        <option value="">Sort By</option>
                        <option value="priceLowToHigh">
                            Price Low to High
                        </option>
                        <option value="priceHightoLow">
                            Price High to Low
                        </option>
                        <option value="MostRated">Most Rated</option>
                        <option value="Newest">Newest</option>
                        {/* Add more filter options here */}
                    </select>
                </div>
            </div>
            <h1>Products</h1>
            <div data-testid="catalog-container">
                <div data-testid="products">
                    <Catalog></Catalog>
                </div>
            </div>
        </div>
    );
};

export default Products;
