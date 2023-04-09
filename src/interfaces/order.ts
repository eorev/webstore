import { product } from "./product";

export interface order {
    id: number;
    customer_id: number;
    date: string;
    mailing_address: string;
    payment_info: string;
    products: product[];
    cost: number;
}
