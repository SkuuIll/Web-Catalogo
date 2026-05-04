import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-text-secondary">Administra tu catálogo de productos.</p>
        </div>
        <Link href="/admin/productos/nuevo" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded transition-colors">
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio (ARS)</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-text-secondary">{product.category?.name || '-'}</td>
                    <td className="p-4 text-text-secondary">$ {Number(product.price).toLocaleString('es-AR')}</td>
                    <td className="p-4 text-text-secondary">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/productos/${product.id}/editar`} className="text-accent hover:text-accent-hover font-medium text-sm">
                        Editar
                      </Link>
                    </td>
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
