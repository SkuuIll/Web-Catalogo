import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, views] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.aggregate({ _sum: { viewCount: true } })
  ]);
  const stats = [
    { label: 'Total Productos', value: productCount, icon: '📦' },
    { label: 'Categorías', value: categoryCount, icon: '🏷️' },
    { label: 'Vistas Totales', value: views._sum.viewCount || 0, icon: '👀' },
  ];
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Bienvenido al panel de administración de SHOWROOM JR.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <div className="text-4xl bg-secondary w-16 h-16 rounded-full flex items-center justify-center">{stat.icon}</div>
            <div>
              <div className="text-text-secondary text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/productos/nuevo" className="bg-secondary hover:bg-accent/20 border border-border hover:border-accent text-center p-4 rounded-lg transition-colors"><span className="block text-2xl mb-2">➕</span><span className="font-medium text-sm">Nuevo Producto</span></a>
          <a href="/admin/precios" className="bg-secondary hover:bg-accent/20 border border-border hover:border-accent text-center p-4 rounded-lg transition-colors"><span className="block text-2xl mb-2">💲</span><span className="font-medium text-sm">Actualizar Precios</span></a>
          <a href="/admin/configuracion" className="bg-secondary hover:bg-accent/20 border border-border hover:border-accent text-center p-4 rounded-lg transition-colors"><span className="block text-2xl mb-2">⚙️</span><span className="font-medium text-sm">Configuración WA</span></a>
        </div>
      </div>
    </div>
  );
}
