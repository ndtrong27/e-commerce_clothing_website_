
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart';

// Helper to get or create a guest User ID
const getUserId = () => {
    if (typeof window === 'undefined') return 'guest';
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('user_id', userId);
    }
    return userId;
};

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    syncCart: () => Promise<void>;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,

            syncCart: async () => {
                const userId = getUserId();
                try {
                    const response = await axios.get(`${API_URL}/${userId}`);
                    // Ensure we handle response correctly. 
                    // Backend returns list of items.
                    const items: CartItem[] = response.data;
                    set({
                        items,
                        total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
                    });
                } catch (error) {
                    console.error('Failed to sync cart:', error);
                }
            },

            addItem: async (product) => {
                const userId = getUserId();
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                let updatedItems;
                if (existingItem) {
                    updatedItems = currentItems.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    updatedItems = [...currentItems, { ...product, quantity: 1 }];
                }

                set({
                    items: updatedItems,
                    total: updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                });

                try {
                    await axios.post(API_URL, { userId, productId: product.id, quantity: 1 });
                } catch (error) {
                    console.error('Failed to add item to cart:', error);
                }
            },

            updateQuantity: async (productId, quantity) => {
                const userId = getUserId();
                const currentItems = get().items;

                if (quantity < 1) return;

                const updatedItems = currentItems.map((item) =>
                    item.id === productId ? { ...item, quantity } : item
                );

                set({
                    items: updatedItems,
                    total: updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                });

                try {
                    await axios.put(API_URL, { userId, productId, quantity });
                } catch (error) {
                    console.error('Failed to update quantity:', error);
                }
            },

            removeItem: async (productId) => {
                const userId = getUserId();
                const currentItems = get().items;
                const updatedItems = currentItems.filter((item) => item.id !== productId);

                set({
                    items: updatedItems,
                    total: updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                });

                try {
                    await axios.delete(`${API_URL}/${userId}/${productId}`);
                } catch (error) {
                    console.error('Failed to remove item:', error);
                }
            },

            clearCart: async () => {
                const userId = getUserId();
                set({ items: [], total: 0 });
                try {
                    await axios.delete(`${API_URL}/${userId}`);
                } catch (error) {
                    console.error('Failed to clear cart:', error);
                }
            },
        }),
        {
            name: 'cart-storage',
            onRehydrateStorage: () => (state) => {
                state?.syncCart();
            }
        }
    )
);
