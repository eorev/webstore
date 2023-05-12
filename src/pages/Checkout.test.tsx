import React from "react";
import { BrowserRouter } from "react-router-dom";
import Checkout from "./Checkout";
import { render } from "@testing-library/react";

describe("Checkout Process", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );
    });
    test("renders", () => {
        //
    });
});
