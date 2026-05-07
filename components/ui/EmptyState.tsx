'use client'

import { type LucideIcon, Search, PackageSearch, Grid2x2, Image, ShoppingBag, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateVariant = 'search' | 'products' | 'categories' | 'images' | 'default' | 'error'

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
}

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: EmptyStateAction
  variant?: EmptyStateVariant
  className?: string
}

const variantDefaults: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string }> = {
  search: { icon: Search, title: 'Sin resultados', description: 'Probá con otros filtros o palabras clave.' },
  products: { icon: ShoppingBag, title: 'No hay productos', description: 'Aún no hay productos disponibles.' },
  categories: { icon: Grid2x2, title: 'No hay categorías', description: 'Aún no hay categorías disponibles.' },
  images: { icon: Image, title: 'No hay imágenes', description: 'No hay imágenes cargadas todavía.' },
  error: { icon: AlertCircle, title: 'Algo salió mal', description: 'Ocurrió un error inesperado. Intentá de nuevo.' },
  default: { icon: PackageSearch, title: 'Vacío', description: 'No hay contenido para mostrar.' },
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const defaults = variantDefaults[variant]
  const Icon = icon ?? defaults.icon
  const displayTitle = title || defaults.title
  const displayDescription = description ?? defaults.description

  return (
    <div className={cn('text-center py-16 px-6', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-white/[0.06] mb-5">
        <Icon className="w-8 h-8 text-text-secondary/30" strokeWidth={1.5} />
      </div>
      <p className="text-lg font-bold text-text-primary mb-1.5">{displayTitle}</p>
      {displayDescription && (
        <p className="text-sm text-text-secondary max-w-xs mx-auto">{displayDescription}</p>
      )}
      {action && (
        <div className="mt-5">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover transition-smooth"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover transition-smooth active:scale-[0.98]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
