import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPricesPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Precios</h1>
          <p className="text-text-secondary">Administra los precios de tu catálogo.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio (ARS)</th>
                <th className="p-4 font-medium">Precio Anterior</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    No hay productos registradas.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-text-secondary">{product.category?.name || '-'}</td>
                    <td className="p-4 text-text-secondary cursor-pointer hover:bg-secondary rounded p-1">$ {Number(product.price).toLocaleString('es-AR')}</td>
                    <td className="p-4 text-text-secondary cursor-pointer hover:bg-secondary rounded p-1">{product.compareAtPrice ? `$ ${Number(product.compareAtPrice).toLocaleString('es-AR')}` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
