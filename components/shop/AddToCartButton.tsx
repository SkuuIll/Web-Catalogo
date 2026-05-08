'use client';
import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const { success } = useToast();

  const handleAdd = () => {
    addItem(product);
    success('Producto agregado a tu lista');
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-accent text-black font-black py-4 px-6 rounded-xl hover:bg-accent-hover transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
    >
      <ShoppingBag className="w-5 h-5" />
      Agregar a tu lista
    </button>
  );
}
