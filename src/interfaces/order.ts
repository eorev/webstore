import { product } from "./product";

export interface order {
    id: string;
    customer_id: string;
    date: string;
    mailing_address: string;
    payment_info: string;
    products: product[];
    cost: number;
}
