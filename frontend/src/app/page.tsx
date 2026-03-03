"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { fetchProducts } from "@/services/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 4)); // Featured 4 products
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 px-6 rounded-3xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Summer Collection 2026
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover the latest trends in sustainable fashion. comfort meets style.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent z-0"></div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200 mb-4 relative">
                  {/* Fallback image if image_url is missing or broken */}
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
        )}
      </section>
    </div>
  );
}
