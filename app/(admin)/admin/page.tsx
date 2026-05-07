import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AlertTriangle, ImageOff, Package, Tag, Eye, Plus, DollarSign, Settings, Image as ImageIcon, Megaphone, MessageCircle, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

export default async function AdminDashboardPage() {
  let productCount = 0, categoryCount = 0, viewsAgg: any = { _sum: { viewCount: 0 } };
  let recentProducts: any[] = [], lowStock: any[] = [], topProducts: any[] = [];
  let noImageCount = 0, inactiveCount = 0, whatsappCount = 0;

  try {
    [productCount, categoryCount, viewsAgg, recentProducts, lowStock, noImageCount, inactiveCount, whatsappCount, topProducts] = await Promise.all([
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
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
  }

  const totalViews = viewsAgg._sum.viewCount || 0;

  const stats = [
    { label: 'Productos Activos', value: productCount, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15', href: '/admin/productos' },
    { label: 'Categorías', value: categoryCount, icon: Tag, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/15', href: '/admin/categorias' },
    { label: 'Vistas Totales', value: totalViews.toLocaleString('es-AR'), icon: Eye, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/15', href: '/admin/productos' },
    { label: 'Clicks WhatsApp', value: whatsappCount.toLocaleString('es-AR'), icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', href: '/admin/productos' },
    { label: 'Sin Imagen', value: noImageCount, icon: ImageOff, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/15', href: '/admin/productos' },
    { label: 'Inactivos', value: inactiveCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', href: '/admin/productos' },
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
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg shadow-accent/15">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient">Dashboard</h1>
            <p className="text-sm text-text-secondary">Panel de administración de SHOWROOM JR</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group bg-card/60 border ${stat.border} rounded-xl p-4 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className={`${stat.bg} p-2.5 rounded-lg w-fit mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-white leading-none mb-1">{stat.value}</div>
              <div className="text-text-secondary text-[11px] font-semibold">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-black text-white">Acciones Rápidas</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/15 group-hover:bg-accent/20 transition-colors shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{action.label}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-black text-white">Últimos Productos</h2>
            <Link href="/admin/productos" className="text-[11px] text-accent hover:text-accent-hover font-bold flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/productos/${product.id}/editar`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-[11px] text-text-secondary">{product.category?.name}</p>
                </div>
                <span className="text-xs font-black text-accent ml-2 whitespace-nowrap">
                  $ {Number(product.price).toLocaleString('es-AR')}
                </span>
              </Link>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">Sin productos aún.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Low Stock */}
        <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/15">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <h2 className="text-base font-black text-white">Stock bajo</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {lowStock.length === 0 ? (
              <p className="text-sm text-text-secondary px-5 py-6">No hay productos con stock bajo.</p>
            ) : lowStock.map(product => (
              <Link key={product.id} href={`/admin/productos/${product.id}/editar`} className="flex justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-sm text-white">{product.name}</span>
                <span className={`text-sm font-black ${product.stock === 0 ? 'text-red-400' : 'text-yellow-400'}`}>{product.stock}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/15">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-black text-white">Más vistos</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topProducts.map((product, i) => (
              <Link key={product.id} href={`/admin/productos/${product.id}/editar`} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-text-secondary w-5">#{i + 1}</span>
                  <span className="text-sm text-white">{product.name}</span>
                </div>
                <span className="text-sm font-black text-accent">{product.viewCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <DashboardCharts />
      </div>
    </div>
  );
}
