import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();
    
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.brand !== undefined) updateData.brand = data.brand || null;
    if (data.model !== undefined) updateData.model = data.model || null;
    if (data.sizes !== undefined) updateData.sizes = data.sizes || null;
    if (data.colors !== undefined) updateData.colors = data.colors || null;
    if (data.specs !== undefined) updateData.specs = data.specs || null;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock, 10);
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
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      await prisma.product.delete({ where: { id: params.id } });
      return NextResponse.json({ message: 'Producto eliminado definitivamente' });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { active: false, status: 'PAUSED' },
    });
    return NextResponse.json({ message: 'Producto desactivado', product });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
