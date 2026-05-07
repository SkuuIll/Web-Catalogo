import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const viewsByDay = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE("updatedAt") as date, SUM("viewCount") as count
      FROM "Product"
      WHERE "updatedAt" >= ${sevenDaysAgo}
      GROUP BY DATE("updatedAt")
      ORDER BY date ASC
    `

    const topViewed = await prisma.product.findMany({
      where: { viewCount: { gt: 0 } },
      select: { name: true, viewCount: true, slug: true },
      orderBy: { viewCount: 'desc' },
      take: 8,
    })

    const byCategory = await prisma.category.findMany({
      select: { name: true, _count: { select: { products: true } } },
      orderBy: { products: { _count: 'desc' } },
    })

    const clicksByDay = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "WhatsAppClick"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const viewsThatDay = viewsByDay.find(v => v.date === dateStr)
      const clicksThatDay = clicksByDay.find(c => c.date === dateStr)
      days.push({
        date: dateStr,
        views: Number(viewsThatDay?.count ?? 0),
        clicks: Number(clicksThatDay?.count ?? 0),
      })
    }

    return NextResponse.json({
      days,
      topViewed: topViewed.map(p => ({
        name: p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name,
        views: p.viewCount,
        slug: p.slug,
      })),
      byCategory: byCategory
        .filter(c => c._count.products > 0)
        .map(c => ({ name: c.name, count: c._count.products })),
    })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
