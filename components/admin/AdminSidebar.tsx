'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Package, Tag, DollarSign,
  ImageIcon, Megaphone, Settings, LogOut,
  UploadCloud, Zap, ChevronLeft, ChevronRight,
  EllipsisVertical, FlaskConical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdvancedMode } from './AdvancedModeProvider'
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet'

const primaryItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/precios', label: 'Precios', icon: DollarSign },
]

const secondaryItems = [
  { href: '/admin/imagenes', label: 'Imágenes', icon: ImageIcon },
  { href: '/admin/banners', label: 'Banners', icon: Megaphone },
  { href: '/admin/importar-exportar', label: 'Importar', icon: UploadCloud, adminOnly: true },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings, adminOnly: true },
]

function isLinkActive(pathname: string, href: string) {
  return pathname === href || (href !== '/admin' && pathname.startsWith(`${href}/`))
}

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  collapsed,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  pathname: string
  collapsed?: boolean
  onClick?: () => void
}) {
  const active = isLinkActive(pathname, href)

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'relative flex items-center gap-3 rounded-xl transition-all duration-300 text-sm',
        collapsed ? 'justify-center px-2 py-3' : 'px-4 py-2.5',
        active
          ? 'bg-accent/10 text-accent font-semibold'
          : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
      )}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent" />
      )}
      {active && collapsed && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent" />
      )}
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && label}
    </Link>
  )
}

function MobileTab({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
  isMore,
}: {
  href?: string
  label: string
  icon: React.ElementType
  pathname: string
  onClick?: () => void
  isMore?: boolean
}) {
  const active = href ? isLinkActive(pathname, href) : false

  const content = (
    <span
      className={cn(
        'relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl text-[10px] font-medium transition-all duration-300 min-w-0 flex-1',
        active ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/[0.04] hover:text-white'
      )}
    >
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-accent" />
      )}
      <Icon className={cn('w-5 h-5', isMore && 'text-text-secondary')} />
      <span className="truncate max-w-full">{label}</span>
    </span>
  )

  if (href) {
    return <Link href={href} className="flex-1 min-w-0">{content}</Link>
  }

  return (
    <button type="button" onClick={onClick} className="flex-1 min-w-0">
      {content}
    </button>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isAdvanced, toggleAdvanced } = useAdvancedMode()
  const [collapsed, setCollapsed] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const role = (session?.user as any)?.role
  const isSuperAdmin = role === 'SUPER_ADMIN'

  const filteredSecondary = secondaryItems.filter(
    item => !item.adminOnly || isSuperAdmin
  )

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const openMore = useCallback(() => {
    setMoreOpen(true)
  }, [])

  const closeMore = useCallback(() => {
    setMoreOpen(false)
  }, [])

  return (
    <>
      {/* ─── Desktop: sidebar plegable ─── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-card/80 backdrop-blur-md border-r border-white/[0.06] h-screen sticky top-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn('border-b border-white/[0.06]', collapsed ? 'p-3' : 'p-6')}>
          {collapsed ? (
            <Link href="/admin" className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg shadow-accent/15">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg shadow-accent/15">
                  <Zap className="w-4 h-4 text-black fill-black" />
                </div>
                <div>
                  <span className="text-base font-black text-accent tracking-tight block leading-none">
                    SHOWROOM JR
                  </span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                    Panel Admin
                  </span>
                </div>
              </Link>
              <button
                onClick={toggleCollapsed}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-text-secondary hover:text-text-primary transition-base"
                aria-label="Colapsar menú"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {primaryItems.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}

          <div className="my-1 mx-2 border-t border-white/[0.04]" />

          {filteredSecondary.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}

          <div className="my-1 mx-2 border-t border-white/[0.04]" />

          <button
            onClick={toggleAdvanced}
            title={collapsed ? (isAdvanced ? 'Modo avanzado activo' : 'Modo básico') : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-xl transition-all duration-300 text-sm',
              collapsed ? 'justify-center px-2 py-3' : 'px-4 py-2.5',
              isAdvanced
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
            )}
          >
            <FlaskConical className={cn('w-4 h-4 flex-shrink-0', isAdvanced && 'text-accent')} />
            {!collapsed && (
              <span className="flex items-center gap-2">
                Avanzado
                <span className={cn(
                  'w-7 h-4 rounded-full transition-all duration-300 flex items-center px-[2px]',
                  isAdvanced ? 'bg-accent' : 'bg-white/15'
                )}>
                  <span className={cn(
                    'w-3 h-3 rounded-full bg-white shadow transition-all duration-300',
                    isAdvanced ? 'translate-x-3' : 'translate-x-0'
                  )} />
                </span>
              </span>
            )}
          </button>
        </nav>

        <div className={cn('border-t border-white/[0.06]', collapsed ? 'p-2' : 'p-3')}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleCollapsed}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-text-secondary hover:text-text-primary transition-base"
                aria-label="Expandir menú"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/[0.08] text-text-secondary hover:text-red-400 transition-base"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-text-secondary hover:bg-red-500/[0.08] hover:text-red-400 transition-all duration-300 flex-1 text-left text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
              <button
                onClick={toggleCollapsed}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-text-secondary hover:text-text-primary transition-base flex-shrink-0"
                aria-label="Colapsar menú"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Mobile: barra inferior 5 tabs fijos ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/[0.06] z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between px-1">
          {primaryItems.map(item => (
            <MobileTab
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              pathname={pathname}
            />
          ))}
          <MobileTab
            label="Más"
            icon={EllipsisVertical}
            pathname={pathname}
            onClick={openMore}
            isMore
          />
        </div>
      </div>

      {/* ─── Mobile: hoja "Más" ─── */}
      <MobileBottomSheet isOpen={moreOpen} onClose={closeMore} title="Más opciones">
        <div className="flex flex-col gap-1">
          {filteredSecondary.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMore}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm',
                isLinkActive(pathname, item.href)
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}

          <div className="my-2 border-t border-white/[0.06]" />

          <button
            onClick={() => { toggleAdvanced() }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm w-full text-left',
              isAdvanced ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
            )}
          >
            <FlaskConical className={cn('w-5 h-5 flex-shrink-0', isAdvanced && 'text-accent')} />
            <span className="flex-1">Modo avanzado</span>
            <span className={cn(
              'w-9 h-5 rounded-full transition-all duration-300 flex items-center px-[2px]',
              isAdvanced ? 'bg-accent' : 'bg-white/15'
            )}>
              <span className={cn(
                'w-4 h-4 rounded-full bg-white shadow transition-all duration-300',
                isAdvanced ? 'translate-x-4' : 'translate-x-0'
              )} />
            </span>
          </button>

          <div className="my-2 border-t border-white/[0.06]" />

          <button
            onClick={() => {
              closeMore()
              signOut({ callbackUrl: '/' })
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </MobileBottomSheet>
    </>
  )
}
