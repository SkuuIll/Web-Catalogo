import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function uniqueSlug(slug: string) {
  return `${slug}-copia-${Date.now().toString(36)}`;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const duplicated = await prisma.product.create({
      data: {
        name: `${product.name} (copia)`,
        slug: uniqueSlug(product.slug),
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        model: product.model,
        sizes: product.sizes,
        colors: product.colors,
        specs: product.specs,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        status: 'DRAFT',
        categoryId: product.categoryId,
        featured: false,
        active: false,
        stock: product.stock,
        sortOrder: product.sortOrder,
        whatsappMessageOverride: product.whatsappMessageOverride,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        ogImageUrl: product.ogImageUrl,
        images: {
          create: product.images.map((image) => ({
            url: image.url,
            altText: image.altText,
            sourceType: image.sourceType,
            localPath: image.localPath,
            isPrimary: image.isPrimary,
            sortOrder: image.sortOrder,
          })),
        },
      },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al duplicar producto' }, { status: 500 });
  }
}
