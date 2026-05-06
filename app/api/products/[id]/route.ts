import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, requireSuperAdmin, slugify } from '@/lib/api-utils';
import { productUpdateSchema, zodErrorMessage } from '@/lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    if ((!product.active || product.status !== 'PUBLISHED') && !(await requireAdminSession())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const parsed = productUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;
    
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug ? slugify(data.slug) : data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.brand !== undefined) updateData.brand = data.brand || null;
    if (data.model !== undefined) updateData.model = data.model || null;
    if (data.sizes !== undefined) updateData.sizes = data.sizes || null;
    if (data.colors !== undefined) updateData.colors = data.colors || null;
    if (data.specs !== undefined) updateData.specs = data.specs || null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice || null;
    if (data.deliveryMode !== undefined) updateData.deliveryMode = data.deliveryMode || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.whatsappMessageOverride !== undefined) updateData.whatsappMessageOverride = data.whatsappMessageOverride || null;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle || null;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription || null;
    if (data.metaKeywords !== undefined) updateData.metaKeywords = data.metaKeywords || null;
    if (data.ogImageUrl !== undefined) updateData.ogImageUrl = data.ogImageUrl || null;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un producto con ese slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      const superSession = await requireSuperAdmin();
      if (!superSession) return NextResponse.json({ error: 'No autorizado. Solo administradores principales pueden eliminar productos definitivamente.' }, { status: 401 });
      await prisma.product.delete({ where: { id: params.id } });
      return NextResponse.json({ message: 'Producto eliminado definitivamente' });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { active: false, status: 'PAUSED' },
    });
    return NextResponse.json({ message: 'Producto desactivado', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
