import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Products from "../pages/Products";

describe("Checkout Process", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Products />
            </BrowserRouter>
        );
    });
    test("Renders the Catalog container", () => {
        const catalog = screen.getByTestId("catalog-container");
        expect(catalog).toBeInTheDocument();
    });
    test("Renders Products", () => {
        const products = screen.getByTestId("products");
        expect(products).toBeInTheDocument();
    });
    test("filter changes when user selects an option", () => {
        const selectElement = screen.getByTestId("filter-dropdown");

        fireEvent.change(selectElement, {
            target: { value: "priceLowToHigh" }
        });
        expect(selectElement).toHaveValue("priceLowToHigh");

        fireEvent.change(selectElement, {
            target: { value: "priceHighToLow" }
        });
        expect(selectElement).toHaveValue("priceHighToLow");
    });
});
