import { product } from "./product";

export interface cart {
    id: number; //identifier if needed for arbitrary purpose
    products: product[];
    total_cost: number;
}
