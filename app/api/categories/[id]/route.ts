import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, requireSuperAdmin, slugify } from '@/lib/api-utils';
import { categoryUpdateSchema, zodErrorMessage } from '@/lib/validation';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const parsed = categoryUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = slugify(data.slug);
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return NextResponse.json({ error: 'No autorizado. Solo administradores principales pueden eliminar categorías.' }, { status: 401 });

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: params.id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: la categoría tiene ${productCount} productos asociados` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
