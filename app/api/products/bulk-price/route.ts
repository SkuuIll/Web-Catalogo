import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { ids, type, value } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Se requiere una lista de IDs de productos' }, { status: 400 });
    }
    if (!type || !['percentage', 'fixed'].includes(type)) {
      return NextResponse.json({ error: 'Tipo debe ser "percentage" o "fixed"' }, { status: 400 });
    }
    if (typeof value !== 'number') {
      return NextResponse.json({ error: 'El valor debe ser un número' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    });

    const updates = products.map((product) => {
      let newPrice: number;
      if (type === 'percentage') {
        newPrice = Number(product.price) * (1 + value / 100);
      } else {
        newPrice = Number(product.price) + value;
      }
      // Ensure price is never negative
      newPrice = Math.max(0, Math.round(newPrice * 100) / 100);

      return prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({
      message: `Precios actualizados para ${products.length} productos`,
      count: products.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar precios' }, { status: 500 });
  }
}
