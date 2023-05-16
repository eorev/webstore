import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Admin from "../pages/Admin";

describe("Checkout Process", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );
    });
    test("Admin can add products", () => {
        const addProductButton = screen.getByText("Add Product");
        fireEvent.click(addProductButton);

        const addProductForm = screen.getByTestId("addProductForm");
        expect(addProductForm).toBeInTheDocument();
    });
    test("Admin can remove products", () => {
        const removeProductButton = screen.getByText("Remove Product");
        fireEvent.click(removeProductButton);

        const removeProductForm = screen.getByTestId("removeProductForm");
        expect(removeProductForm).toBeInTheDocument();
    });
    test("Admin can view pending orders and select an order", () => {
        const pendingOrdersHeader = screen.getByText("Pending Orders");
        expect(pendingOrdersHeader).toBeInTheDocument();
        const selectElement = screen.getByText(/Select an Order/i);
        expect(selectElement).toBeInTheDocument();
    });
    test("Admin can view user orders", () => {
        const selectElement = screen.getByTestId("user-orders");

        fireEvent.change(selectElement, {
            target: { value: "Select a User" }
        });
        expect(selectElement.textContent).toBe("Select a User");
    });
    test("Unrestricted admins can add and remove admins", () => {
        const addAdminButton = screen.getByRole("button", {
            name: /Add/i
        });
        const removeAdminButton = screen.getByRole("button", {
            name: /Remove/i
        });
        fireEvent.click(addAdminButton);
        fireEvent.click(removeAdminButton);
    });
});
