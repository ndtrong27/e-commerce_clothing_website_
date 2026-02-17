"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function Navbar() {
    const cartItems = useCart((state) => state.items);
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900">StyleStore</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
