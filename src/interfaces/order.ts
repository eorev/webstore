import { product } from "./product";

export interface order {
    id: string;
    userid: string;
    date: string;
    mailing_address: string;
    payment_info: string;
    products: product[];
    cost: number;
}

export default order;
