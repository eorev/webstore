import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Signin from "../pages/Signin";
import Account from "../pages/Account";

HTMLFormElement.prototype.submit = jest.fn();

describe("Signin", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
    });

    test("renders signin form", () => {
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const signinButton = screen.getByText("Log In");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(signinButton).toBeInTheDocument();
    });

    test("User can sign in with email and password", async () => {
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const loginForm = screen.getByTestId("login-form");

        fireEvent.change(emailInput, { target: { value: "test@nestled.io" } });
        fireEvent.change(passwordInput, { target: { value: "nestled" } });
        fireEvent.submit(loginForm);

        await waitFor(() => expect(screen.queryByText("Log In")));

        expect(window.location.pathname).toBe("/");
    });
    test("calls handleGoogleSignIn when GoogleButton is clicked", () => {
        const handleGoogleSignIn = jest.fn();
        const googleButton = screen.getByTestId("signinGoogleButton");

        fireEvent.submit(googleButton);
        expect(handleGoogleSignIn).toBeCalled;
    });
    test("Account page renders for user", async () => {
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const loginForm = screen.getByTestId("login-form");

        fireEvent.change(emailInput, { target: { value: "test@nestled.io" } });
        fireEvent.change(passwordInput, { target: { value: "nestled" } });
        fireEvent.submit(loginForm);

        await waitFor(() => expect(screen.queryByText("Log In")));

        expect(window.location.pathname).toBe("/");
        render(
            <BrowserRouter>
                <Account />
            </BrowserRouter>
        );
        const newDisplayNameField = screen.getByText("New Display Name:");
        expect(newDisplayNameField).toBeInTheDocument();
    });
});
