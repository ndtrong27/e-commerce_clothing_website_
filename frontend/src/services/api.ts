import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import { Product } from '../types';

interface ApiProduct extends Omit<Product, 'price'> {
    price: string;
}

export const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data.map((product: ApiProduct) => ({
        ...product,
        price: parseFloat(product.price)
    }));
};

export const fetchProductById = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    const data = response.data as ApiProduct;
    return {
        ...data,
        price: parseFloat(data.price)
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
