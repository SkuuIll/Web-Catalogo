import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const data = await request.json();
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        linkText: data.linkText,
        position: data.position,
        active: data.active,
        sortOrder: data.sortOrder,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
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
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Banner eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar banner' }, { status: 500 });
  }
}
