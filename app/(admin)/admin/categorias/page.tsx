import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categorías</h1>
          <p className="text-text-secondary">Administra las categorías de tus productos.</p>
        </div>
        <Link href="/admin/categorias/nueva" className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded transition-colors">
          Nueva Categoría
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Orden</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-medium">{category.name}</td>
                    <td className="p-4 text-text-secondary">{category.slug}</td>
                    <td className="p-4 text-text-secondary">{category.sortOrder}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${category.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {category.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-text-secondary font-medium text-sm">
                        Editar
                      </span>
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
