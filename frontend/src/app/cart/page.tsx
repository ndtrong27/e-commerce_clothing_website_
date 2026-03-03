"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeItem, total, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setIsCheckingOut(true);

        try {
            // Mock User ID for guest checkout or grab from auth context if implemented
            const userId = "00000000-0000-0000-0000-000000000000"; // Replace with actual logic or handle guest logic on backend

            // Mock Order Payload
            const orderPayload = {
                user_id: null, // Allow null for guest if DB supports it, or use a temp ID
                total_amount: total,
                shipping_address: { city: "New York", street: "123 Fashion Ave" }, // Mock data
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await createOrder(orderPayload);
            clearCart();
            alert("Order placed successfully!");
            router.push("/");
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/shop" className="text-indigo-600 hover:text-indigo-800 underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 border-b border-gray-200 pb-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image_url || "https://placehold.co/200x200?text=No+Image"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600">{formatCurrency(item.price)}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-gray-500">Qty: {item.quantity}</span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4 border-b border-gray-200 pb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-8">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isCheckingOut ? "Processing..." : "Checkout"}
                    </button>
                </div>
            </div>
        </div>
    );
}
