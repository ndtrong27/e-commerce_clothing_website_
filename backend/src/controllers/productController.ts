import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            res.status(404).json({ error: 'Product not found' });
            return; // Ensure function returns void
        }

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
