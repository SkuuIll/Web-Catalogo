import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const brand = searchParams.get('brand');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const inStock = searchParams.get('inStock') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');

    let whereClause: any = includeInactive ? {} : { active: true, status: 'PUBLISHED' };
    if (categoryId) whereClause.categoryId = categoryId;
    if (featured) whereClause.featured = true;
    if (status) whereClause.status = status;
    if (brand) whereClause.brand = { contains: brand };
    if (size) whereClause.sizes = { contains: size };
    if (color) whereClause.colors = { contains: color };
    if (inStock) whereClause.stock = { gt: 0 };
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = Number(minPrice);
      if (maxPrice) whereClause.price.lte = Number(maxPrice);
    }

    // SQLite-compatible search (no mode:'insensitive', use contains only)
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderByClause = { price: 'asc' };
    if (sort === 'price_desc') orderByClause = { price: 'desc' };
    if (sort === 'newest') orderByClause = { createdAt: 'desc' };
    if (sort === 'featured') orderByClause = { featured: 'desc' };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.price || !data.categoryId) {
      return NextResponse.json({ error: 'Nombre, precio y categoría son requeridos' }, { status: 400 });
    }

    // Auto-generate slug if missing
    const slug = data.slug || data.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        brand: data.brand || null,
        model: data.model || null,
        sizes: data.sizes || null,
        colors: data.colors || null,
        specs: data.specs || null,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        status: data.status || (data.active === false ? 'PAUSED' : 'PUBLISHED'),
        categoryId: data.categoryId,
        featured: data.featured || false,
        active: data.active ?? true,
        stock: parseInt(data.stock, 10) || 0,
        whatsappMessageOverride: data.whatsappMessageOverride || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogImageUrl: data.ogImageUrl || null,
      },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un producto con ese slug. Cambiá el nombre o el slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
