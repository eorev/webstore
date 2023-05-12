import React from "react";
import { BrowserRouter } from "react-router-dom";
import Checkout from "./Checkout";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Checkout Process", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );
    });
    test("Place Order button exists", () => {
        const placeOrderButton = screen.getByRole("button", {
            name: /Place Order/i
        });
        expect(placeOrderButton).toBeInTheDocument();
    });
    test("Payment form renders on Add Payment Click", () => {
        const addPaymentButton = screen.getByText("Add Payment");
        fireEvent.click(addPaymentButton);

        const paymentFormContainer = screen.getByTestId(
            "payment-form-container"
        );
        expect(paymentFormContainer).toBeInTheDocument();
    });
    test("Shipping form renders on Add Shipping Click", () => {
        const addShippingButton = screen.getByText("Add Shipping");
        fireEvent.click(addShippingButton);

        const shippingForm = screen.getByTestId("shipping-form");
        expect(shippingForm).toBeInTheDocument();
    });
    test("Successful Order Placement", () => {
        const placeOrderButton = screen.getByText("Place Order");

        placeOrderButton.removeAttribute("disabled");
        expect(placeOrderButton).toBeEnabled();

        fireEvent.click(placeOrderButton);

        setTimeout(() => {
            const orderConfirmationScreen = screen.getByTestId("underlay");
            expect(orderConfirmationScreen).toBeInTheDocument();
        }, 2000);
    });
    test("renders a cart display", () => {
        const cartDisplayContainer = screen.getByTestId(
            "cart-display-container"
        );
        const productsContainer = screen.getByTestId("products-container");
        expect(cartDisplayContainer).toBeInTheDocument();
        expect(productsContainer).toBeInTheDocument();
    });
    test("renders shipping options", () => {
        const standardShipping = screen.getByTestId("standard-shipping");
        expect(standardShipping).toBeInTheDocument();

        const expressShipping = screen.getByTestId("express-shipping");
        expect(expressShipping).toBeInTheDocument();

        const shippingLabel = screen.getByText("Shipping Options");
        expect(shippingLabel).toBeInTheDocument();
    });
});
