import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const fetchProductById = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
