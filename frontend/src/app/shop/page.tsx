"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { fetchProducts } from "@/services/api";

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group"
                    >
                        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200 mb-4">
                            <img
                                src={product.image_url || "https://placehold.co/400x600?text=No+Image"}
                                alt={product.name}
                                className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {product.name}
                        </h3>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
