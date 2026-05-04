import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';
import { bannerUpdateSchema, zodErrorMessage } from '@/lib/validation';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const parsed = bannerUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        linkText: data.linkText || null,
        position: data.position,
        active: data.active,
        sortOrder: data.sortOrder,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar banner' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Banner eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar banner' }, { status: 500 });
  }
}
