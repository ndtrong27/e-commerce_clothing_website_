export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: string;
    image_url: string;
    created_at: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product?: Product;
}
