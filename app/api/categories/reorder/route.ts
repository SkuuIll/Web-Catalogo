import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-utils'

export async function PUT(request: NextRequest) {
  try {
    await requireAdminSession()
    const { ids } = await request.json()
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids array required' }, { status: 400 })
    }

    await prisma.$transaction(
      ids.map((id: string, index: number) =>
        prisma.category.update({ where: { id }, data: { sortOrder: index } })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error reordering categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
