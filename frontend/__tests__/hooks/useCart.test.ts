
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../src/hooks/useCart';

// Mock persist middleware to avoid localStorage issues in test
jest.mock('zustand/middleware', () => ({
    persist: (config: any) => (set: any, get: any, api: any) => config(set, get, api),
}));

describe('useCart Hook', () => {
    const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        stock: 10,
        image_url: 'http://example.com/image.jpg',
    };

    beforeEach(() => {
        const { result } = renderHook(() => useCart());
        act(() => {
            result.current.clearCart();
        });
    });

    it('should start with an empty cart', () => {
        const { result } = renderHook(() => useCart());
        expect(result.current.items).toEqual([]);
        expect(result.current.total).toBe(0);
    });

    it('should add an item to the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockProduct);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]).toEqual({ ...mockProduct, quantity: 1 });
        expect(result.current.total).toBe(100);
    });

    it('should increase quantity if item already exists', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockProduct);
            result.current.addItem(mockProduct);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(2);
        expect(result.current.total).toBe(200);
    });

    it('should remove an item from the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockProduct);
            result.current.removeItem(mockProduct.id);
        });

        expect(result.current.items).toEqual([]);
        expect(result.current.total).toBe(0);
    });

    it('should clear the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockProduct);
            result.current.clearCart();
        });

        expect(result.current.items).toEqual([]);
        expect(result.current.total).toBe(0);
    });
});
