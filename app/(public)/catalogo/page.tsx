'use client'
import React, { useState, useEffect, useRef } from 'react'
import { ProductCard } from '@/components/shop/ProductCard'
import { FeaturedProductCard } from '@/components/shop/FeaturedProductCard'
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, PackageCheck, Loader2 } from 'lucide-react'

function SkeletonCard() {
  return (
    <div className="bg-card/30 border border-white/[0.04] rounded-xl overflow-hidden">
      <div className="aspect-square bg-secondary/30 shimmer" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 bg-white/[0.04] rounded-full w-1/3 shimmer" />
        <div className="h-3.5 bg-white/[0.04] rounded-full w-4/5 shimmer" />
        <div className="h-3 bg-white/[0.04] rounded-full w-2/5 shimmer" />
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const [config, setConfig] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersReady, setFiltersReady] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sort, setSort] = useState('newest')
  const [brand, setBrand] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [inStock, setInStock] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const requestSeq = useRef(0)
  const PER_PAGE = 12

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialSearch = params.get('search') || ''
    setSearch(initialSearch)
    setDebouncedSearch(initialSearch)
    setCategoryId(params.get('categoryId') || '')
    setSort(params.get('sort') || 'newest')
    setBrand(params.get('brand') || '')
    setSize(params.get('size') || '')
    setColor(params.get('color') || '')
    setInStock(params.get('inStock') === 'true')
    setMinPrice(params.get('minPrice') || '')
    setMaxPrice(params.get('maxPrice') || '')
    setFiltersReady(true)

    Promise.all([
      fetch('/api/config').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([cfg, cats]) => {
      setConfig(cfg)
      setCategories(Array.isArray(cats) ? cats : [])
    })
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, categoryId, sort, brand, size, color, inStock, minPrice, maxPrice])

  useEffect(() => {
    if (!filtersReady) return
    const requestId = requestSeq.current + 1
    requestSeq.current = requestId
    setLoading(true)
    const params = new URLSearchParams()
    params.set('paginated', 'true')
    params.set('page', String(page))
    params.set('pageSize', String(PER_PAGE))
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (categoryId) params.set('categoryId', categoryId)
    if (sort) params.set('sort', sort)
    if (brand) params.set('brand', brand)
    if (size) params.set('size', size)
    if (color) params.set('color', color)
    if (inStock) params.set('inStock', 'true')
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const visibleParams = new URLSearchParams(params)
    visibleParams.delete('paginated')
    visibleParams.delete('pageSize')
    if (page === 1) visibleParams.delete('page')
    window.history.replaceState(null, '', visibleParams.toString() ? `/catalogo?${visibleParams}` : '/catalogo')

    const controller = new AbortController()
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (requestSeq.current !== requestId) return
        const items = Array.isArray(data) ? data : data.items || []
        setProducts(page === 1 ? items : prev => [...prev, ...items])
        setTotal(Array.isArray(data) ? items.length : data.total || 0)
        setLoading(false)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError' && requestSeq.current === requestId) setLoading(false)
    })
    return () => controller.abort()
  }, [filtersReady, debouncedSearch, categoryId, sort, brand, size, color, inStock, minPrice, maxPrice, page])

  const featured = products.find(p => p.featured)
  const rest = products.filter(p => !p.featured || p !== featured)
  const allDisplay = featured ? [featured, ...rest] : products
  const hasMore = allDisplay.length < total

  const clearFilters = () => { setSearch(''); setCategoryId(''); setSort('newest'); setBrand(''); setSize(''); setColor(''); setInStock(false); setMinPrice(''); setMaxPrice('') }
  const hasActiveFilters = search || categoryId || sort !== 'newest' || brand || size || color || inStock || minPrice || maxPrice
  const filterFieldClass = "h-11 w-full rounded-xl border border-white/[0.06] bg-black/20 px-3.5 text-sm font-medium text-white placeholder:text-text-secondary outline-none transition-all duration-300 focus:border-accent focus:bg-black/30 focus:ring-1 focus:ring-accent/20"
  const selectClass = "h-12 w-full appearance-none rounded-xl border border-white/[0.06] bg-black/20 px-4 pr-10 text-sm font-bold text-white outline-none transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent/20"

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 md:py-16">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 overflow-hidden rounded-xl border border-white/[0.06] bg-card/60">
          <div className="relative p-5 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_10%,rgba(200,149,42,0.12),transparent)]" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  <Sparkles className="h-3 w-3 fill-accent" />
                  Tienda visual
                </p>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gradient">Catálogo</h1>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-text-secondary">
                  Explorá productos por categoría, marca, talle, color y disponibilidad. Todo preparado para consultar rápido por WhatsApp.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3 text-sm text-text-secondary">
                <PackageCheck className="mb-2 h-5 w-5 text-accent" />
                <span className="block text-2xl font-black text-white">{loading && page === 1 ? '...' : total}</span>
                producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-8 overflow-hidden rounded-xl border border-white/[0.06] bg-card/50 shadow-2xl shadow-black/15">
          <div className="border-b border-white/[0.06] px-4 py-3.5 md:px-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-white">Buscar y filtrar</p>
                <p className="text-xs text-text-secondary">Afiná por rubro, marca, variante, precio y stock.</p>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-2 text-xs font-bold text-text-secondary transition-all duration-300 hover:border-accent/30 hover:text-accent hover:bg-accent/[0.05]">
                  <X className="h-3.5 w-3.5" /> Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="border-b border-white/[0.06] px-4 py-3 md:px-5">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setCategoryId('')}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${!categoryId ? 'border-accent bg-accent text-black shadow-lg shadow-accent/15' : 'border-white/[0.06] bg-black/15 text-text-secondary hover:border-accent/30 hover:text-accent'}`}
                >
                  Todo
                </button>
                {categories.slice(0, 10).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${categoryId === c.id ? 'border-accent bg-accent text-black shadow-lg shadow-accent/15' : 'border-white/[0.06] bg-black/15 text-text-secondary hover:border-accent/30 hover:text-accent'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_210px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por producto, marca o detalle..."
                  className="h-12 w-full rounded-xl border border-white/[0.06] bg-black/20 pl-11 pr-10 text-sm font-medium text-white placeholder:text-text-secondary outline-none transition-all duration-300 focus:border-accent focus:bg-black/30 focus:ring-1 focus:ring-accent/20"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative hidden md:block">
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={selectClass}>
                  <option value="">Todas las categorías</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              </div>

              <div className="relative hidden md:block">
                <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass}>
                  <option value="newest">Más nuevos</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all duration-300 md:hidden ${showFilters || hasActiveFilters ? 'border-accent bg-accent/10 text-accent' : 'border-white/[0.06] bg-black/20 text-text-secondary'}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </button>
            </div>

            <div className="hidden grid-cols-2 gap-3 md:grid lg:grid-cols-[1fr_1fr_1fr_0.85fr_0.85fr_150px]">
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marca" className={filterFieldClass} />
              <input value={size} onChange={e => setSize(e.target.value)} placeholder="Talle / variante" className={filterFieldClass} />
              <input value={color} onChange={e => setColor(e.target.value)} placeholder="Color" className={filterFieldClass} />
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Precio mín." className={filterFieldClass} />
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Precio máx." className={filterFieldClass} />
              <label className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-bold transition-all duration-300 ${inStock ? 'border-accent bg-accent/10 text-accent' : 'border-white/[0.06] bg-black/20 text-text-secondary'}`}>
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                Solo stock
              </label>
            </div>
          </div>
        </section>

        {/* Mobile filters panel */}
        {showFilters && (
          <div className="md:hidden bg-card/60 border border-white/[0.06] rounded-xl p-4 mb-4 space-y-3 slide-up">
            <div>
              <label className="text-xs text-text-secondary mb-1 block font-semibold">Categoría</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:border-accent outline-none"
              >
                <option value="">Todas</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block font-semibold">Ordenar</label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:border-accent outline-none"
              >
                <option value="newest">Más nuevos</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Marca" className={filterFieldClass} />
              <input value={size} onChange={e => setSize(e.target.value)} placeholder="Talle / variante" className={filterFieldClass} />
              <input value={color} onChange={e => setColor(e.target.value)} placeholder="Color" className={filterFieldClass} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Mín." className={filterFieldClass} />
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Máx." className={filterFieldClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                Mostrar solo productos con stock
              </label>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-accent hover:text-accent-hover underline">Limpiar filtros</button>
            )}
          </div>
        )}

        {/* Product grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : allDisplay.length === 0 ? (
          <div className="text-center py-20 bg-card/30 backdrop-blur-md rounded-xl border border-white/[0.06]">
            <Search className="w-12 h-12 mx-auto text-text-secondary/20 mb-4" />
            <p className="text-xl text-text-secondary font-bold">Sin resultados para tu búsqueda.</p>
            <p className="text-sm text-text-secondary mt-2">Probá con otros filtros o palabras clave.</p>
            <button onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover transition-colors">Ver todos los productos</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {allDisplay.map((product, idx) => {
                if (idx === 0 && product.featured && !debouncedSearch && !categoryId) {
                  return <FeaturedProductCard key={product.id} product={product} />
                }
                return <ProductCard key={product.id} product={product} config={config} />
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="group inline-flex items-center gap-2 bg-card border border-white/[0.06] hover:border-accent/30 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 hover:bg-accent/[0.05]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Cargar más productos'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
