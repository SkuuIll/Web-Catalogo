import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AlertTriangle, BarChart3, ImageOff, Package, Tag, Eye, Plus, DollarSign, Settings, Image as ImageIcon, Megaphone, MessageCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, viewsAgg, recentProducts, lowStock, noImageCount, inactiveCount, whatsappCount, topProducts] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.category.count({ where: { active: true } }),
    prisma.product.aggregate({ _sum: { viewCount: true } }),
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.product.findMany({ where: { active: true, stock: { lte: 3 } }, include: { category: true }, take: 6, orderBy: { stock: 'asc' } }),
    prisma.product.count({ where: { active: true, images: { none: {} } } }),
    prisma.product.count({ where: { active: false } }),
    prisma.whatsAppClick.count(),
    prisma.product.findMany({ where: { active: true }, include: { category: true }, orderBy: { viewCount: 'desc' }, take: 5 }),
  ]);

  const totalViews = viewsAgg._sum.viewCount || 0;

  const stats = [
    { label: 'Productos Activos', value: productCount, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10', href: '/admin/productos' },
    { label: 'Categorías', value: categoryCount, icon: Tag, color: 'text-purple-400', bg: 'bg-purple-400/10', href: '/admin/categorias' },
    { label: 'Vistas Totales', value: totalViews.toLocaleString('es-AR'), icon: Eye, color: 'text-green-400', bg: 'bg-green-400/10', href: '/admin/productos' },
    { label: 'Clicks WhatsApp', value: whatsappCount.toLocaleString('es-AR'), icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', href: '/admin/productos' },
    { label: 'Sin Imagen', value: noImageCount, icon: ImageOff, color: 'text-yellow-400', bg: 'bg-yellow-400/10', href: '/admin/productos' },
    { label: 'Inactivos', value: inactiveCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', href: '/admin/productos' },
  ];

  const quickActions = [
    { href: '/admin/productos/nuevo', label: 'Nuevo Producto', icon: Plus, desc: 'Agregar al catálogo' },
    { href: '/admin/precios', label: 'Actualizar Precios', icon: DollarSign, desc: 'Edición inline y masiva' },
    { href: '/admin/imagenes', label: 'Gestionar Imágenes', icon: ImageIcon, desc: 'Ver y eliminar fotos' },
    { href: '/admin/banners', label: 'Banners', icon: Megaphone, desc: 'Promociones y ofertas' },
    { href: '/admin/categorias', label: 'Categorías', icon: Tag, desc: 'Organizar productos' },
    { href: '/admin/configuracion', label: 'Configuración', icon: Settings, desc: 'Ajustes de la tienda' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-text-secondary">Bienvenido al panel de administración de SHOWROOM JR.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-card border border-border rounded-lg p-4 sm:p-6 flex items-center gap-4 hover:border-white/20 transition-colors group"
            >
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-text-secondary text-sm font-medium mb-0.5">{stat.label}</div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col gap-2 p-4 rounded-lg bg-secondary border border-border hover:border-accent/40 hover:bg-accent/5 transition-all"
                >
                  <Icon className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-white">{action.label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Últimos Productos</h2>
            <Link href="/admin/productos" className="text-xs text-accent hover:text-accent-hover">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/productos/${product.id}/editar`}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:opacity-80 transition-opacity"
              >
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-xs text-text-secondary">{product.category?.name}</p>
                </div>
                <span className="text-xs font-bold text-accent ml-2 whitespace-nowrap">
                  $ {Number(product.price).toLocaleString('es-AR')}
                </span>
              </Link>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-4">Sin productos aún.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">Alertas de stock bajo</h2>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 ? <p className="text-sm text-text-secondary">No hay productos con stock bajo.</p> : lowStock.map(product => (
              <Link key={product.id} href={`/admin/productos/${product.id}/editar`} className="flex justify-between border-b border-border/50 pb-2 last:border-0">
                <span className="text-sm text-white">{product.name}</span>
                <span className="text-sm font-bold text-yellow-400">{product.stock}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Más vistos</h2>
          </div>
          <div className="space-y-3">
            {topProducts.map(product => (
              <Link key={product.id} href={`/admin/productos/${product.id}/editar`} className="flex justify-between border-b border-border/50 pb-2 last:border-0">
                <span className="text-sm text-white">{product.name}</span>
                <span className="text-sm font-bold text-accent">{product.viewCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
