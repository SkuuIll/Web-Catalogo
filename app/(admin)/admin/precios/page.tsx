'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { formatPriceARS } from '@/lib/price-formatter'
import { Check, X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

export default function AdminPricesPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  // Bulk update state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkType, setBulkType] = useState<'percentage' | 'fixed'>('percentage')
  const [bulkValue, setBulkValue] = useState('')
  const [bulkCategoryId, setBulkCategoryId] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkMsg, setBulkMsg] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : [])
      setCategories(Array.isArray(cats) ? cats : [])
      setLoading(false)
    })
  }, [])

  const startEdit = (product: any) => {
    setEditingId(product.id)
    setEditValue(String(Number(product.price)))
  }

  const cancelEdit = () => { setEditingId(null); setEditValue('') }

  const savePrice = async (productId: string) => {
    const newPrice = parseFloat(editValue)
    if (isNaN(newPrice) || newPrice < 0) return cancelEdit()
    setSavingId(productId)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      })
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p))
      }
    } finally {
      setSavingId(null)
      setEditingId(null)
      setEditValue('')
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => setSelectedIds(new Set(filteredByCategory.map(p => p.id)))
  const selectNone = () => setSelectedIds(new Set())

  const filteredByCategory = bulkCategoryId
    ? products.filter(p => p.categoryId === bulkCategoryId)
    : products

  const handleBulkUpdate = async () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : filteredByCategory.map(p => p.id)
    if (ids.length === 0) return setBulkMsg('Seleccioná al menos un producto.')
    const val = parseFloat(bulkValue)
    if (isNaN(val)) return setBulkMsg('Ingresá un valor válido.')

    setBulkLoading(true)
    setBulkMsg('')
    try {
      const res = await fetch('/api/products/bulk-price', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, type: bulkType, value: val }),
      })
      const data = await res.json()
      if (res.ok) {
        setBulkMsg(`✓ ${data.message}`)
        // Refresh products
        fetch('/api/products').then(r => r.json()).then(prods => setProducts(Array.isArray(prods) ? prods : []))
        selectNone()
        setBulkValue('')
      } else {
        setBulkMsg(data.error || 'Error al actualizar precios.')
      }
    } finally {
      setBulkLoading(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-text-secondary">Cargando precios...</div>

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient mb-1">Gestión de Precios</h1>
        <p className="text-sm text-text-secondary">Hacé clic en el precio para editarlo. Presioná Enter o ✓ para guardar.</p>
      </div>

      {/* Bulk Update Panel */}
      <div className="bg-card/60 border border-white/[0.06] rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-base font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Actualización Masiva
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-3">
          <div className="min-w-0">
            <label className="block text-xs text-text-secondary mb-1">Categoría</label>
            <select
              value={bulkCategoryId}
              onChange={e => { setBulkCategoryId(e.target.value); selectNone() }}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-xs text-text-secondary mb-1">Tipo</label>
            <select
              value={bulkType}
              onChange={e => setBulkType(e.target.value as 'percentage' | 'fixed')}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (ARS)</option>
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-xs text-text-secondary mb-1">
              Valor {bulkType === 'percentage' ? '(use negativo para bajar, ej: -10)' : '(negativo para bajar)'}
            </label>
            <input
              type="number"
              value={bulkValue}
              onChange={e => setBulkValue(e.target.value)}
              placeholder={bulkType === 'percentage' ? 'ej: 15' : 'ej: 5000'}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none lg:w-36"
            />
          </div>
          <button
            onClick={selectAll}
            className="text-xs text-accent hover:text-accent-hover border border-accent/20 hover:border-accent/50 px-3 py-2 rounded-lg transition-colors"
          >
            Selec. todos ({filteredByCategory.length})
          </button>
          {selectedIds.size > 0 && (
            <button onClick={selectNone} className="text-xs text-text-secondary hover:text-white border border-border px-3 py-2 rounded-lg transition-colors">
              Quitar selección ({selectedIds.size})
            </button>
          )}
          <button
            onClick={handleBulkUpdate}
            disabled={bulkLoading}
            className="justify-center bg-accent hover:bg-accent-hover text-black font-bold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Aplicar
          </button>
        </div>
        {bulkMsg && <p className="mt-3 text-sm text-accent">{bulkMsg}</p>}
      </div>

      {/* Price Table */}
      <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-text-secondary text-xs uppercase tracking-wider border-b border-white/[0.06]">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredByCategory.length && filteredByCategory.length > 0}
                    onChange={selectedIds.size === filteredByCategory.length ? selectNone : selectAll}
                    className="w-4 h-4 accent-accent"
                  />
                </th>
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio ARS</th>
                <th className="p-4 font-medium">Precio Anterior</th>
                <th className="p-4 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-secondary/40 transition-colors ${selectedIds.has(product.id) ? 'bg-accent/5' : ''}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 accent-accent"
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-white">{product.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                      {product.category?.name || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-text-secondary text-sm">$</span>
                        <input
                          type="number"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') savePrice(product.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          autoFocus
                          className="w-28 bg-secondary border border-accent rounded px-2 py-1 text-sm focus:outline-none"
                        />
                        <button onClick={() => savePrice(product.id)} disabled={!!savingId} className="p-1 text-green-400 hover:text-green-300">
                          {savingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={cancelEdit} className="p-1 text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="text-white font-bold hover:text-accent transition-colors cursor-pointer px-2 py-1 rounded hover:bg-accent/10 group flex items-center gap-1"
                        title="Clic para editar"
                      >
                        {formatPriceARS(Number(product.price))}
                        <span className="text-[10px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">editar</span>
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {product.compareAtPrice ? formatPriceARS(Number(product.compareAtPrice)) : '-'}
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? product.stock : 'Agotado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-text-secondary">No hay productos.</div>
          )}
        </div>
      </div>
    </div>
  )
}
