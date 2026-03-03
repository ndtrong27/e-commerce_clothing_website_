
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get cart items for a user
export const getCart = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', userId);

        if (error) throw error;

        // Transform data to match frontend expectation if needed, 
        // but frontend expects CartItem which is Product + quantity.
        // Supabase returns { ...cartItem, product: { ...product } }
        // We might need to flatten it or let frontend handle it.
        // Let's flatten it to match CartItem interface: { ...product, quantity, id: product.id? No, cart_item.id }
        // The frontend useCart expects items to have product properties + quantity. 
        // Actually, the current frontend useCart uses `CartItem` which extends `Product` and adds `quantity`.
        // So we should return a list of products with quantity.
        // However, we also need the cart_item_id to remove/update it? 
        // The frontend `removeItem` uses `productId` in the current logic: `item.id === product.id`.
        // So if we return the Product object with an injected Quantity, it matches.

        const cartItems = data.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            // We might need to keep track of user_id or cart_item id if we want to support multiple entries?
            // But usually cart is unique by product_id per user.
        }));

        res.status(200).json(cartItems);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Check if item exists
        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existingItem) {
            // Update quantity
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id)
                .select()
                .single();

            if (error) throw error;
            res.status(200).json(data);
        } else {
            // Insert new item
            const { data, error } = await supabase
                .from('cart_items')
                .insert([{ user_id: userId, product_id: productId, quantity }])
                .select()
                .single();

            if (error) throw error;
            res.status(201).json(data);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body; // Using body for cleaner API, or we could use params

    try {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
    const { userId, productId } = req.params;

    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.status(200).json({ message: 'Item removed' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
