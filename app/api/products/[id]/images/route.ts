import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { processAndSaveImage } from '@/lib/image-utils';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // URL-based image
      const { url, altText } = await request.json();
      if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 });

      const existingCount = await prisma.productImage.count({ where: { productId: params.id } });
      const image = await prisma.productImage.create({
        data: {
          productId: params.id,
          url,
          altText: altText || '',
          sourceType: 'URL',
          isPrimary: existingCount === 0,
          sortOrder: existingCount,
        },
      });
      return NextResponse.json(image, { status: 201 });
    }

    // File upload
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });

    const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10) * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `Archivo muy grande. Máximo ${process.env.MAX_FILE_SIZE_MB || '10'}MB` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const savedUrl = await processAndSaveImage(buffer, params.id, file.name);

    const existingCount = await prisma.productImage.count({ where: { productId: params.id } });
    const image = await prisma.productImage.create({
      data: {
        productId: params.id,
        url: savedUrl,
        altText: formData.get('altText')?.toString() || '',
        sourceType: 'UPLOAD',
        localPath: savedUrl,
        isPrimary: existingCount === 0,
        sortOrder: existingCount,
      },
    });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
