import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, slugify } from '@/lib/api-utils';
import { categorySchema, zodErrorMessage } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const where = includeInactive ? {} : { active: true };
    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slugify(data.slug),
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        active: data.active ?? true,
        sortOrder: data.sortOrder ?? 0,
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
