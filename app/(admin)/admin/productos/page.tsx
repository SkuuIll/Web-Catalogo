'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, AlertTriangle, Copy, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmDialog'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const confirm = useConfirm()
  const PAGE_SIZE = 15

  const loadProducts = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({
      includeInactive: 'true',
      paginated: 'true',
      page: String(page),
      pageSize: String(PAGE_SIZE),
      sort,
    })
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    if (categoryId) params.set('categoryId', categoryId)
    if (stockFilter === 'inStock') params.set('inStock', 'true')
    if (stockFilter === 'outOfStock') params.set('stock', 'outOfStock')
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.items || []
        setProducts(items)
        setTotal(Array.isArray(data) ? items.length : data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, sort, search, statusFilter, categoryId, stockFilter])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => setCategories(Array.isArray(data) ? data : [])).catch(() => undefined)
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(loadProducts, search ? 250 : 0)
    return () => window.clearTimeout(timeout)
  }, [search, statusFilter, categoryId, stockFilter, sort, page, loadProducts])

  const handleDeactivate = async (product: any) => {
    const ok = await confirm({
      title: 'Desactivar producto',
      message: `¿Querés desactivar "${product.name}"?\nEl producto no será eliminado, solo se ocultará de la tienda.`,
      confirmLabel: 'Desactivar',
      tone: 'warning',
    })
    if (!ok) return
    setDeleting(product.id)
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (res.ok) { success('Producto desactivado correctamente.'); loadProducts() }
      else toastError('Error al desactivar producto.')
    } finally {
      setDeleting(null)
    }
  }

  const handleHardDelete = async (product: any) => {
    const ok = await confirm({
      title: 'Borrar producto definitivamente',
      message: `¿Borrar definitivamente "${product.name}"?\nEsta acción elimina el producto de la base de datos y no se puede deshacer.`,
      confirmLabel: 'Borrar definitivamente',
      tone: 'danger',
    })
    if (!ok) return
    setDeleting(product.id)
    try {
      const res = await fetch(`/api/products/${product.id}?hard=true`, { method: 'DELETE' })
      if (res.ok) { success('Producto eliminado definitivamente.'); loadProducts() }
      else toastError('Error al borrar producto.')
    } finally {
      setDeleting(null)
    }
  }

  const handleDuplicate = async (product: any) => {
    setDeleting(product.id)
    try {
      const res = await fetch(`/api/products/${product.id}/duplicate`, { method: 'POST' })
      if (res.ok) { success('Producto duplicado como borrador.'); loadProducts() }
      else toastError('Error al duplicar producto.')
    } finally {
      setDeleting(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (loading) return <div className="p-10 text-center text-text-secondary">Cargando productos...</div>

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Productos</h1>
          <p className="text-text-secondary">{products.length} productos en total.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <Filter className="h-4 w-4 text-accent" />
          Filtros y orden
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_170px_180px_150px_170px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, marca o detalle..."
              className="h-11 w-full bg-secondary border border-border rounded-lg pl-11 pr-4 text-sm text-white placeholder:text-text-secondary focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="h-11 rounded-lg border border-border bg-secondary px-3 text-sm text-white outline-none focus:border-accent">
            <option value="">Todos los estados</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="PAUSED">Pausados</option>
            <option value="DRAFT">Borradores</option>
          </select>
          <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1) }} className="h-11 rounded-lg border border-border bg-secondary px-3 text-sm text-white outline-none focus:border-accent">
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(1) }} className="h-11 rounded-lg border border-border bg-secondary px-3 text-sm text-white outline-none focus:border-accent">
            <option value="">Todo stock</option>
            <option value="inStock">Con stock</option>
            <option value="outOfStock">Agotados</option>
          </select>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }} className="h-11 rounded-lg border border-border bg-secondary px-3 text-sm text-white outline-none focus:border-accent">
            <option value="newest">Más nuevos</option>
            <option value="name_asc">Nombre A-Z</option>
            <option value="price_asc">Precio menor</option>
            <option value="price_desc">Precio mayor</option>
            <option value="stock_asc">Menor stock</option>
          </select>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {products.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-text-secondary">
            {search ? 'Sin resultados para tu búsqueda.' : 'No hay productos registrados.'}
          </div>
        ) : products.map((product) => (
          <div key={product.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="line-clamp-2 font-bold text-white">{product.name}</h2>
                  {product.featured && <Star className="h-4 w-4 shrink-0 fill-accent text-accent" />}
                </div>
                <p className="mt-1 text-xs text-text-secondary">{product.category?.name || 'Sin categoría'}</p>
              </div>
              <span className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-bold ${product.status === 'PUBLISHED' && product.active ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'}`}>
                {product.status || (product.active ? 'PUBLISHED' : 'PAUSED')}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-secondary/70 p-3">
                <p className="text-xs text-text-secondary">Precio</p>
                <p className="font-black text-accent">{formatPriceARS(Number(product.price))}</p>
              </div>
              <div className="rounded-lg bg-secondary/70 p-3">
                <p className="text-xs text-text-secondary">Stock</p>
                <p className={product.stock > 0 ? 'font-bold text-green-400' : 'font-bold text-red-400'}>
                  {product.stock > 0 ? product.stock : 'Agotado'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={`/producto/${product.slug}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-text-secondary hover:text-white">
                <Eye className="h-4 w-4" /> Ver
              </Link>
              <Link href={`/admin/productos/${product.id}/editar`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-sm font-bold text-accent">
                <Edit2 className="h-4 w-4" /> Editar
              </Link>
              <button onClick={() => handleDeactivate(product)} disabled={deleting === product.id || !product.active} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-text-secondary hover:text-white disabled:opacity-40">
                <EyeOff className="h-4 w-4" /> Ocultar
              </button>
              <button onClick={() => handleDuplicate(product)} disabled={deleting === product.id} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-text-secondary hover:text-white disabled:opacity-50">
                <Copy className="h-4 w-4" /> Duplicar
              </button>
              <button onClick={() => handleHardDelete(product)} disabled={deleting === product.id} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-400 disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> Borrar
              </button>
            </div>
            {!product.active && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4" />
                Este producto está oculto en la tienda.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    {search ? 'Sin resultados para tu búsqueda.' : 'No hay productos registrados.'}
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{product.name}</span>
                      {product.featured && (
                        <span title="Destacado" aria-label="Destacado">
                          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                      {product.category?.name || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-white font-medium">{formatPriceARS(Number(product.price))}</td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? product.stock : 'Agotado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'PUBLISHED' && product.active ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {product.status || (product.active ? 'PUBLISHED' : 'PAUSED')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/producto/${product.slug}`}
                        target="_blank"
                        className="p-2 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-secondary"
                        title="Ver en tienda"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/productos/${product.id}/editar`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-secondary"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(product)}
                        disabled={deleting === product.id}
                        className="p-2 text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-secondary disabled:opacity-50"
                        title="Duplicar como borrador"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(product)}
                        disabled={deleting === product.id}
                        className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-lg hover:bg-secondary disabled:opacity-50"
                        title="Desactivar"
                      >
                        {product.active ? <EyeOff className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleHardDelete(product)}
                        disabled={deleting === product.id}
                        className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                        title="Borrar definitivamente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          Mostrando {products.length} de {total} productos.
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || loading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-bold text-text-secondary hover:text-white disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-white">
            {page} / {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-bold text-text-secondary hover:text-white disabled:opacity-40">
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
