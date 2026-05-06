import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';
import { processAndSaveImage, validateImageFile } from '@/lib/image-utils';

function isSafeImageUrl(value: string) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const productExists = await prisma.product.count({ where: { id: params.id } });
    if (!productExists) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // URL-based image
      const { url, altText } = await request.json();
      if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
      if (!isSafeImageUrl(url)) {
        return NextResponse.json({ error: 'La URL debe ser una imagen JPG, PNG, WebP, GIF o AVIF por HTTP/HTTPS' }, { status: 400 });
      }

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

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
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
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
