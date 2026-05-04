import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';

function csvValue(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['name', 'slug', 'category', 'price', 'compareAtPrice', 'stock', 'status', 'active', 'featured', 'brand', 'model', 'sizes', 'colors', 'shortDescription'];
  const rows = products.map((p) => [
    p.name, p.slug, p.category.name, p.price, p.compareAtPrice, p.stock, p.status, p.active, p.featured, p.brand, p.model, p.sizes, p.colors, p.shortDescription,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvValue).join(',')).join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="productos-showroom-jr.csv"',
    },
  });
}
