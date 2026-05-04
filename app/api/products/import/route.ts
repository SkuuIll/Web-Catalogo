import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Archivo CSV requerido' }, { status: 400 });

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0] || '').map(h => h.trim());
  let count = 0;

  for (const line of lines.slice(1)) {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => { row[header] = values[index] || ''; });
    if (!row.name || !row.price || !row.category) continue;

    const category = await prisma.category.upsert({
      where: { slug: slugify(row.category) },
      update: {},
      create: { name: row.category, slug: slugify(row.category), active: true },
    });

    await prisma.product.upsert({
      where: { slug: row.slug || slugify(row.name) },
      update: {
        price: Number(row.price),
        stock: Number(row.stock || 0),
        active: row.active !== 'false',
        status: row.status || 'PUBLISHED',
      },
      create: {
        name: row.name,
        slug: row.slug || slugify(row.name),
        categoryId: category.id,
        price: Number(row.price),
        compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
        stock: Number(row.stock || 0),
        status: row.status || 'PUBLISHED',
        active: row.active !== 'false',
        featured: row.featured === 'true',
        brand: row.brand || null,
        model: row.model || null,
        sizes: row.sizes || null,
        colors: row.colors || null,
        shortDescription: row.shortDescription || null,
      },
    });
    count++;
  }

  return NextResponse.json({ message: `${count} productos importados o actualizados.` });
}
