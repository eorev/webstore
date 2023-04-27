export interface cartProduct {
    name: string;
    description: string;
    id: number;
    image: string;
    rating: number; //rating from 1 to 5
    category: string;
    admin_id: string; //id belonging to the admin who created the product
    price: number;
    units_instock: number;
    times_purchased: number;
    quantity: number;
}

export default cartProduct;
