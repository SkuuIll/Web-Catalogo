import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => ({}));
    await prisma.whatsAppClick.create({
      data: {
        productId: data.productId || null,
        source: data.source || 'PRODUCT',
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
