import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteLocalImage } from '@/lib/image-utils';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const image = await prisma.productImage.findUnique({
      where: { id: params.imageId },
    });

    if (!image || image.productId !== params.id) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    // Delete from disk if it's a local upload
    if (image.sourceType === 'UPLOAD' && image.localPath) {
      await deleteLocalImage(image.localPath);
    }

    // Delete from database
    await prisma.productImage.delete({ where: { id: params.imageId } });

    // If deleted image was primary, set next image as primary
    if (image.isPrimary) {
      const nextImage = await prisma.productImage.findFirst({
        where: { productId: params.id },
        orderBy: { sortOrder: 'asc' },
      });
      if (nextImage) {
        await prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const image = await prisma.productImage.findUnique({ where: { id: params.imageId } });
    if (!image || image.productId !== params.id) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    await prisma.productImage.updateMany({
      where: { productId: params.id },
      data: { isPrimary: false },
    });

    const updated = await prisma.productImage.update({
      where: { id: params.imageId },
      data: { isPrimary: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al marcar imagen principal' }, { status: 500 });
  }
}
