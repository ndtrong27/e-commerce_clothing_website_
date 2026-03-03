import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createOrder = async (req: Request, res: Response) => {
    const { user_id, total_amount, shipping_address, items } = req.body;

    try {
        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                { user_id, total_amount, shipping_address, status: 'pending' }
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
