import { cart } from "./cart";
import { order } from "./order";
export type accountType = "admin" | "customer";

export interface admin {
    type: accountType;
    id: number;
    name: string;
    address: string;
    email: string;
    password: string;
    cart: cart;
    payment_info: string;
    orders: order[];
}

export interface customer {
    type: accountType;
    id: number;
    name: string;
    address: string;
    email: string;
    password: string;
    cart: cart;
    payment_info: string;
    orders: order[];
    customer_orders: order[];
    revenue: number;
}
