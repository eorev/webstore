import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Checkout from "../pages/Checkout";

describe("Signin", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );
    });
    test("Successfully adds shipping information", () => {
        const addShippingButton = screen.getByRole("button", {
            name: /Add Shipping/i
        });
        fireEvent.click(addShippingButton);

        const addShippingForm = screen.getByTestId("addShippingForm");
        expect(addShippingForm).toBeInTheDocument();
        const name = screen.getByTestId("shippingName");
        const number = screen.getByTestId("shippingNumber");
        const address = screen.getByTestId("shippingAddress");
        expect(name).toBeInTheDocument();
        expect(number).toBeInTheDocument();
        expect(address).toBeInTheDocument();
        fireEvent.change(name, { target: { value: "test test" } });
        fireEvent.change(number, { target: { value: "333-333-3333" } });
        fireEvent.change(address, { target: { value: "1234 Test Ln." } });
        fireEvent.submit(addShippingForm);
    });
    test("Successfully adds payment information", () => {
        const addPaymentButton = screen.getByRole("button", {
            name: /Add Payment/i
        });
        fireEvent.click(addPaymentButton);

        const addShippingForm = screen.getByTestId("payment-form-container");
        expect(addShippingForm).toBeInTheDocument();
        const number = screen.getByPlaceholderText("Card Number");
        const name = screen.getByPlaceholderText("Cardholder Name");
        const expiration = screen.getByPlaceholderText("MM/YY");
        const cvv = screen.getByPlaceholderText("CVV");
        fireEvent.change(number, { target: { value: "4321345869465464" } });
        fireEvent.change(name, { target: { value: "Test Test" } });
        fireEvent.change(expiration, { target: { value: "12/23" } });
        fireEvent.change(cvv, { target: { value: "223" } });
        const submitButton = screen.getByRole("button", {
            name: /Submit/i
        });
        fireEvent.click(submitButton);
    });
    test("Successfull order placement", () => {
        const standardShipping = screen.getByRole("radio", {
            name: /Standard Shipping/i
        });
        fireEvent.click(standardShipping);
        const placeOrderButton = screen.getByRole("button", {
            name: /Place Order/i
        });
        fireEvent.click(placeOrderButton);
    });
    test("renders a cart display", () => {
        const cartDisplayContainer = screen.getByTestId(
            "cart-display-container"
        );
        const productsContainer = screen.getByTestId("products-container");
        expect(cartDisplayContainer).toBeInTheDocument();
        expect(productsContainer).toBeInTheDocument();
    });
    test("renders recently deleted display", () => {
        const recentlyDeletedContainer = screen.getByTestId("recently-deleted");
        expect(recentlyDeletedContainer).toBeInTheDocument();
    });
    test("renders order summary", () => {
        const orderSummaryContainer = screen.getByTestId("order-summary");
        expect(orderSummaryContainer).toBeInTheDocument();
        const subtotal = screen.getByTestId("subtotal");
        const total = screen.getByTestId("total");
        expect(subtotal).toBeInTheDocument();
        expect(total).toBeInTheDocument();
        expect(subtotal.textContent).toBe("$0");
        expect(total.textContent).toBe("$0.00");
    });
});
