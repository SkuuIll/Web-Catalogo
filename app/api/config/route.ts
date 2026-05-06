import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, requireSuperAdmin } from '@/lib/api-utils';
import { siteConfigSchema, zodErrorMessage } from '@/lib/validation';

function redactConfig(config: any, isAdmin = false) {
  const { aiApiKey, ...publicConfig } = config;
  return {
    ...publicConfig,
    ...(isAdmin ? { aiApiKey: '', aiApiKeyConfigured: Boolean(aiApiKey) } : {}),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wantsAdminConfig = searchParams.get('admin') === 'true';
    const session = wantsAdminConfig ? await requireAdminSession() : null;

    if (wantsAdminConfig && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await prisma.siteConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }
    return NextResponse.json(redactConfig(config, wantsAdminConfig));
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado. Solo administradores principales pueden modificar la configuración.' }, { status: 401 });
    }
    const parsed = siteConfigSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (!data.aiApiKey) {
      delete data.aiApiKey;
    }
    const requiredStringFields = ['siteName', 'primaryColor', 'secondaryColor', 'whatsappButtonText', 'currencySymbol', 'currencyCode'];
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || (requiredStringFields.includes(key) && value === null)) {
        delete data[key];
      }
    }

    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data as any,
      create: { id: 1, ...(data as any) },
    });
    return NextResponse.json(redactConfig(config, true));
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
