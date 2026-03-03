
import request from 'supertest';
import express from 'express';
import { getProducts, getProductById } from '../src/controllers/productController';
import * as supabaseConfig from '../src/config/supabase';
// Mock Supabase
const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({ select: mockSelect }));
const mockEq = jest.fn();
const mockSingle = jest.fn();

// TS validation workaround for mocking
jest.mock('../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
        }))
    }
}));


const app = express();
app.get('/products', getProducts);
app.get('/products/:id', getProductById);

describe('Product Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Since we are mocking the module, we need to get the mocked functions to assert on them
    // However, for integration/unit testing controllers, we mainly care about the response.
    // The mocking setup above is a bit complex due to the chainable API of Supabase.
    // Let's refine the mock values for specific tests.

    // Helper to access the mocked supabase instance
    const mockSupabase = supabaseConfig.supabase as any;

    describe('getProducts', () => {
        it('should return 200 and a list of products', async () => {
            const mockData = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];

            // Setup chain
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: mockData, error: null })
            });

            const res = await request(app).get('/products');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('should return 500 if there is a database error', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } })
            });

            const res = await request(app).get('/products');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'DB Error' });
        });
    });

    describe('getProductById', () => {
        it('should return 200 and the product if found', async () => {
            const mockProduct = { id: 'uuid-123', name: 'Product A' };

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
            });

            const res = await request(app).get('/products/uuid-123');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProduct);
        });

        it('should return 404 if product is not found', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: null })
            });

            const res = await request(app).get('/products/uuid-404');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Product not found' });
        });

        it('should return 500 on database error', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } })
            });

            const res = await request(app).get('/products/uuid-error');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'DB Error' });
        });
    });
});
