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

    let whereClause: any = { active: true };
    if (categoryId) whereClause.categoryId = categoryId;
    if (featured) whereClause.featured = true;
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderByClause: any = { sortOrder: 'asc' };
    if (sort === 'price_asc') orderByClause = { price: 'asc' };
    if (sort === 'price_desc') orderByClause = { price: 'desc' };
    if (sort === 'newest') orderByClause = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        categoryId: data.categoryId,
        featured: data.featured || false,
        active: data.active ?? true,
        stock: data.stock || 0,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
