import React, { useEffect, useState } from "react";
import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentForm.css";
import Payment from "payment";

export type PaymentFormData = {
    number: string;
    expiration: string;
    cvc: string;
    name: string;
};

interface CardState {
    number: string;
    expiration: string;
    cvc: string;
    name: string;
    focus?: Focused;
}

interface PaymentFormProps {
    onSubmit: (formData: PaymentFormData) => void;
}

function clearNumber(value = "") {
    return value.replace(/\D+/g, "");
}

function formatCreditCardNumber(value: string) {
    if (!value) {
        return value;
    } else return value.replace(/\D/g, "").slice(0, 16);
}

function formatCVC(
    value: string,
    prevValue: string,
    allValues: { number?: string } = {}
): string {
    const clearValue = clearNumber(value);
    let maxLength = 4;

    if (allValues.number) {
        const issuer = Payment.fns.cardType(allValues.number);
        maxLength = issuer === "amex" ? 4 : 3;
    }

    return clearValue.slice(0, maxLength);
}

function formatExpirationDate(value: string): string {
    const clearValue = clearNumber(value);

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
}

function isValid(state: CardState): boolean {
    const expiration = state.expiration.trim();

    const isValidFormat = /^\d{2}\/\d{2}$/.test(expiration);
    if (!isValidFormat) {
        return false;
    }

    const [month, year] = expiration.split("/");

    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return false;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 0 || yearNum > 99) {
        return false;
    }

    return true;
}

const PaymentForm = ({ onSubmit }: PaymentFormProps) => {
    const [state, setState] = useState({
        number: "",
        expiration: "",
        cvc: "",
        name: "",
        focus: undefined as Focused | undefined
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "number") {
            event.target.value = formatCreditCardNumber(event.target.value);
        } else if (event.target.name === "expiration") {
            event.target.value = formatExpirationDate(event.target.value);
        } else if (event.target.name === "cvc") {
            event.target.value = formatCVC(event.target.value, "", state);
        }
        const { name, value } = event.target;

        setState((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        let focus: Focused | undefined;

        if (event.target.name === "cvc" || event.target.name === "expiry") {
            focus = event.target.name as Focused;
        } else {
            focus = undefined;
        }

        setState((prev) => ({
            ...prev,
            focus
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = {
            number: state.number,
            expiration: state.expiration,
            cvc: state.cvc,
            name: state.name
        };
        onSubmit(formData);
    };

    useEffect(() => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", (event) => {
            const button = form.querySelector("button");
            if (button?.disabled) {
                alert("The button is disabled!");
                event.preventDefault();
            }
        });
    }, []);

    return (
        <div className="payment-form-container">
            <div className="card">
                <Cards
                    number={state.number}
                    expiry={state.expiration}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="number"
                    placeholder="Card Number"
                    value={state.number}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onWheel={(event) => event.preventDefault()}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Cardholder Name"
                    value={state.name}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <input
                    type="text"
                    name="expiration"
                    placeholder="MM/YY"
                    value={state.expiration}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <input
                    type="number"
                    name="cvc"
                    placeholder="CVV"
                    value={state.cvc}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <div className="submit">
                    <button type="submit" disabled={!isValid(state)}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
