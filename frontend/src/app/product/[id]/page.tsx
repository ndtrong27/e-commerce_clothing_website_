"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { fetchProductById } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button"; // Accessing standard UI component if exists, else standard html button

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const addItem = useCart((state) => state.addItem);

    useEffect(() => {
        if (!id) return;
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-200 rounded-xl overflow-hidden aspect-square">
                <img
                    src={product.image_url || "https://placehold.co/600x600?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl font-semibold text-gray-900 mb-6">
                    {formatCurrency(product.price)}
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {product.description || "No description available."}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => addItem(product)}
                        className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors"
                    >
                        Add to Cart
                    </button>

                    <div className="text-sm text-gray-500 mt-4">
                        <p>Category: {product.category}</p>
                        <p>Stock: {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
