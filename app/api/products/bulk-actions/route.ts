import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession()
    const { ids, action } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array required' }, { status: 400 })
    }
    if (!['publish', 'pause', 'delete', 'draft'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    switch (action) {
      case 'publish':
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: 'PUBLISHED', active: true } })
        break
      case 'pause':
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: 'PAUSED', active: false } })
        break
      case 'draft':
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: 'DRAFT' } })
        break
      case 'delete':
        await prisma.productImage.deleteMany({ where: { productId: { in: ids } } })
        await prisma.whatsAppClick.deleteMany({ where: { productId: { in: ids } } })
        await prisma.product.deleteMany({ where: { id: { in: ids } } })
        break
    }

    return NextResponse.json({ success: true, count: ids.length })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error in bulk action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
