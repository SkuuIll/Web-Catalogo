import React from 'react';
import { prisma } from '@/lib/prisma';
import { containerClasses } from '@/lib/utils';
import { DashboardContent } from './DashboardContent';

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
      prisma.product.findMany({
        where: { active: true, stock: { lte: 3 } },
        include: { category: true },
        take: 6,
        orderBy: { stock: 'asc' },
      }),
      prisma.product.count({ where: { active: true, images: { none: {} } } }),
      prisma.product.count({ where: { active: false } }),
      prisma.whatsAppClick.count(),
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { viewCount: 'desc' },
        take: 5,
      }),
    ]);
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
  }

  const totalViews = viewsAgg._sum.viewCount || 0;

  const stats = [
    { label: 'Activos', value: productCount, icon: 'Package', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15', href: '/admin/productos' },
    { label: 'Categorías', value: categoryCount, icon: 'Tag', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/15', href: '/admin/categorias' },
    { label: 'Vistas', value: totalViews.toLocaleString('es-AR'), icon: 'Eye', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/15', href: '/admin/productos' },
    { label: 'WhatsApp', value: whatsappCount.toLocaleString('es-AR'), icon: 'MessageCircle', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', href: '/admin/productos' },
    { label: 'Sin Imagen', value: noImageCount, icon: 'ImageOff', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/15', href: '/admin/productos' },
    { label: 'Inactivos', value: inactiveCount, icon: 'AlertTriangle', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', href: '/admin/productos' },
  ];

  return (
    <DashboardContent
      stats={stats}
      recentProducts={recentProducts}
      lowStock={lowStock}
      topProducts={topProducts}
    />
  );
}
