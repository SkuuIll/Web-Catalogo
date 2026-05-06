import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';
import { bannerSchema, zodErrorMessage } from '@/lib/validation';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Error al obtener banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const parsed = bannerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        linkText: data.linkText || null,
        position: data.position || 'HERO',
        active: data.active ?? true,
        sortOrder: data.sortOrder ?? 0,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Error al crear banner' }, { status: 500 });
  }
}
