import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paginatedResponse, parsePagination, requireAdminSession, slugify } from '@/lib/api-utils';
import { productCreateSchema, zodErrorMessage } from '@/lib/validation';
import { validateImageFile, processAndSaveImage } from '@/lib/image-utils';

function isSafeImageUrl(value: string) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const brand = searchParams.get('brand');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const inStock = searchParams.get('inStock') === 'true';
    const stock = searchParams.get('stock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const paginated = searchParams.get('paginated') === 'true';
    const adminOnlyQuery = includeInactive || Boolean(status);
    const session = adminOnlyQuery ? await requireAdminSession() : null;

    if (adminOnlyQuery && !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let whereClause: any = includeInactive ? {} : { active: true, status: 'PUBLISHED' };
    if (categoryId) whereClause.categoryId = categoryId;
    if (featured) whereClause.featured = true;
    if (status) whereClause.status = status;
    if (brand) whereClause.brand = { contains: brand };
    if (size) whereClause.sizes = { contains: size };
    if (color) whereClause.colors = { contains: color };
    if (inStock) whereClause.stock = { gt: 0 };
    if (stock === 'outOfStock') whereClause.stock = { lte: 0 };
    if (minPrice || maxPrice) {
      whereClause.price = {};
      const parsedMin = Number(minPrice);
      const parsedMax = Number(maxPrice);
      if (Number.isFinite(parsedMin)) whereClause.price.gte = parsedMin;
      if (Number.isFinite(parsedMax)) whereClause.price.lte = parsedMax;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderByClause = { price: 'asc' };
    if (sort === 'price_desc') orderByClause = { price: 'desc' };
    if (sort === 'newest') orderByClause = { createdAt: 'desc' };
    if (sort === 'featured') orderByClause = { featured: 'desc' };
    if (sort === 'stock_asc') orderByClause = { stock: 'asc' };
    if (sort === 'name_asc') orderByClause = { name: 'asc' };

    const pagination = parsePagination(searchParams);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        ...(paginated ? { skip: pagination.skip, take: pagination.take } : {}),
      }),
      paginated ? prisma.product.count({ where: whereClause }) : Promise.resolve(0),
    ]);

    if (paginated) {
      return NextResponse.json(paginatedResponse(products, total, pagination.page, pagination.pageSize));
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const formData = await request.formData();
    const dataStr = formData.get('data');
    
    if (!dataStr || typeof dataStr !== 'string') {
      return NextResponse.json({ error: 'Datos de producto inválidos' }, { status: 400 });
    }

    const parsed = productCreateSchema.safeParse(JSON.parse(dataStr));
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const data = parsed.data;
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const files = formData.getAll('images') as File[];
    const urls = formData.getAll('imageUrls') as string[];

    // Pre-validate all files before creating the product
    for (const file of files) {
      if (!file || typeof file === 'string' || !file.arrayBuffer) {
         return NextResponse.json({ error: 'Archivo inválido enviado' }, { status: 400 });
      }
      const validationError = validateImageFile(file);
      if (validationError) {
        return NextResponse.json({ error: `Imagen ${file.name || 'desconocida'}: ${validationError}` }, { status: 400 });
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        brand: data.brand || null,
        model: data.model || null,
        sizes: data.sizes || null,
        colors: data.colors || null,
        specs: data.specs || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        deliveryMode: data.deliveryMode || 'INMEDIATA',
        status: data.status || (data.active === false ? 'PAUSED' : 'PUBLISHED'),
        categoryId: data.categoryId,
        featured: data.featured || false,
        active: data.active ?? true,
        stock: data.stock || 0,
        whatsappMessageOverride: data.whatsappMessageOverride || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogImageUrl: data.ogImageUrl || null,
      },
    });

    let sortOrder = 0;
    
    for (const url of urls) {
      if (!isSafeImageUrl(url)) continue;
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url,
          altText: '',
          sourceType: 'URL',
          isPrimary: sortOrder === 0,
          sortOrder: sortOrder++,
        }
      });
    }

    for (const file of files) {
      const validationError = validateImageFile(file);
      if (!validationError) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const savedUrl = await processAndSaveImage(buffer, product.id, file.name);
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: savedUrl,
            altText: '',
            sourceType: 'UPLOAD',
            localPath: savedUrl,
            isPrimary: sortOrder === 0,
            sortOrder: sortOrder++,
          }
        });
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un producto con ese slug. Cambiá el nombre o el slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
