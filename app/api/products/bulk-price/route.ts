import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';
import { z } from 'zod';

const bulkPriceSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().finite().min(-1000000).max(1000000),
});

export async function PUT(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const parsed = bulkPriceSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos de actualización inválidos' }, { status: 400 });
    }
    const { ids, type, value } = parsed.data;

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
