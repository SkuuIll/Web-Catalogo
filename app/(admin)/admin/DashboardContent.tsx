'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle, ImageOff, Package, Tag, Eye, Plus, DollarSign,
  Settings, Image as ImageIcon, Megaphone, MessageCircle, ArrowRight,
  TrendingUp, Zap, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardCharts } from '@/components/admin/DashboardCharts'

const iconMap: Record<string, React.ElementType> = {
  Package, Tag, Eye, MessageCircle, ImageOff, AlertTriangle,
}

const quickActions = [
  { href: '/admin/productos/nuevo', label: 'Nuevo Producto', icon: Plus, desc: 'Agregar al catálogo' },
  { href: '/admin/precios', label: 'Precios', icon: DollarSign, desc: 'Editar inline y masivo' },
  { href: '/admin/imagenes', label: 'Imágenes', icon: ImageIcon, desc: 'Ver y eliminar fotos' },
  { href: '/admin/banners', label: 'Banners', icon: Megaphone, desc: 'Promociones' },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag, desc: 'Organizar' },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings, desc: 'Ajustes de tienda' },
]

interface DashboardContentProps {
  stats: { label: string; value: string | number; icon: string; color: string; bg: string; border: string; href: string }[]
  recentProducts: any[]
  lowStock: any[]
  topProducts: any[]
}

function StatsCarousel({ stats }: { stats: DashboardContentProps['stats'] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollTo = (direction: 'prev' | 'next') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 8 : 180
    const newScroll = el.scrollLeft + (direction === 'next' ? cardWidth : -cardWidth)
    el.scrollTo({ left: newScroll, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 8 : 180
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(idx)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Resumen</h2>
        <div className="hidden sm:flex items-center gap-1">
          <button onClick={() => scrollTo('prev')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-text-secondary transition-base">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scrollTo('next')} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-text-secondary transition-base">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop: full grid */}
      <div className="hidden sm:grid grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(stat => {
          const Icon = iconMap[stat.icon]
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group bg-card/60 border ${stat.border} rounded-xl p-4 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className={`${stat.bg} p-2.5 rounded-lg w-fit mb-3`}>
                {Icon && <Icon className={`w-5 h-5 ${stat.color}`} />}
              </div>
              <div className="text-2xl font-black text-white leading-none mb-1">{stat.value}</div>
              <div className="text-text-secondary text-[11px] font-semibold">{stat.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Mobile: horizontal swipeable carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="sm:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 -mx-1"
      >
        {stats.map(stat => {
          const Icon = iconMap[stat.icon]
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`shrink-0 w-[155px] snap-start bg-card/60 border ${stat.border} rounded-xl p-4 hover:border-white/20 transition-all duration-300 active:scale-[0.98]`}
            >
              <div className={`${stat.bg} p-2 rounded-lg w-fit mb-3`}>
                {Icon && <Icon className={`w-4 h-4 ${stat.color}`} />}
              </div>
              <div className="text-xl font-black text-white leading-none mb-1">{stat.value}</div>
              <div className="text-text-secondary text-[11px] font-semibold">{stat.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Page dots for mobile */}
      <div className="flex sm:hidden justify-center gap-1.5 mt-2">
        {stats.map((_, i) => (
          <span
            key={i}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all duration-300',
              i === activeIndex ? 'bg-accent w-3' : 'bg-white/20'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function DashboardContent({ stats, recentProducts, lowStock, topProducts }: DashboardContentProps) {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg shadow-accent/15">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient">Dashboard</h1>
            <p className="text-sm text-text-secondary">Panel de administración</p>
          </div>
        </div>
      </div>

      {/* Stats: carousel mobile / grid desktop */}
      <StatsCarousel stats={stats} />

      {/* Quick Actions */}
      <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden mb-5">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-base font-black text-white">Acciones rápidas</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/15 shrink-0">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">{action.label}</p>
                    <p className="text-[10px] text-text-secondary hidden sm:block">{action.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Products + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-1 bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-black text-white">Últimos productos</h2>
            <Link href="/admin/productos" className="text-[11px] text-accent hover:text-accent-hover font-bold flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentProducts.length > 0 ? recentProducts.map(product => (
              <Link
                key={product.id}
                href={`/admin/productos/${product.id}/editar`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-[11px] text-text-secondary">{product.category?.name}</p>
                </div>
                <span className="text-xs font-black text-accent ml-2 whitespace-nowrap">
                  $ {Number(product.price).toLocaleString('es-AR')}
                </span>
              </Link>
            )) : (
              <p className="text-sm text-text-secondary text-center py-8">Sin productos aún.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/15">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <h2 className="text-base font-black text-white">Stock bajo</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {lowStock.length > 0 ? lowStock.map(product => (
              <Link
                key={product.id}
                href={`/admin/productos/${product.id}/editar`}
                className="flex justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm text-white line-clamp-1">{product.name}</span>
                <span className={`text-sm font-black ml-2 ${product.stock === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {product.stock}
                </span>
              </Link>
            )) : (
              <p className="text-sm text-text-secondary px-5 py-8 text-center">No hay productos con stock bajo.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/15">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-black text-white">Más vistos</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topProducts.length > 0 ? topProducts.map((product, i) => (
              <Link
                key={product.id}
                href={`/admin/productos/${product.id}/editar`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-black text-text-secondary w-5 flex-shrink-0">#{i + 1}</span>
                  <span className="text-sm text-white line-clamp-1">{product.name}</span>
                </div>
                <span className="text-sm font-black text-accent ml-2 flex-shrink-0">{product.viewCount}</span>
              </Link>
            )) : (
              <p className="text-sm text-text-secondary px-5 py-8 text-center">Sin datos de vistas.</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div>
        <DashboardCharts />
      </div>
    </div>
  )
}
