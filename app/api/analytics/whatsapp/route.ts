import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const clickSchema = z.object({
  productId: z.string().min(1).optional().nullable(),
  source: z.string().trim().max(40).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = clickSchema.safeParse(await request.json().catch(() => ({})));
    const data = parsed.success ? parsed.data : {};
    await prisma.whatsAppClick.create({
      data: {
        productId: data.productId || null,
        source: data.source || 'PRODUCT',
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
