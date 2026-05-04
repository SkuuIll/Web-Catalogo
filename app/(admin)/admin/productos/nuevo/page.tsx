'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', price: '', compareAtPrice: '', categoryId: '', stock: '0', active: true, featured: false
  })

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data)).catch(console.error)
  }, [])

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Auto-generate slug if empty
    let slug = formData.slug
    if (!slug) slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          stock: parseInt(formData.stock, 10),
        })
      })
      if (res.ok) {
        router.push('/admin/productos')
        router.refresh()
      } else {
        alert('Error al crear producto')
      }
    } catch (err) {
      alert('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="text-text-secondary hover:text-text-primary text-2xl">←</Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">Nuevo Producto</h1>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Nombre</label>
              <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Slug (opcional)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="auto-generado si se deja en blanco" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Precio (ARS)</label>
              <input type="number" step="0.01" required name="price" value={formData.price} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Precio Anterior (ARS, opcional)</label>
              <input type="number" step="0.01" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Categoría</label>
              <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none">
                <option value="">Seleccionar categoría...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Stock</label>
              <input type="number" required name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Descripción Corta</label>
            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Descripción Completa</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
          </div>

          <div className="flex gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-medium">Producto Activo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-medium">Destacar en Inicio</span>
            </label>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-8 rounded transition-colors disabled:opacity-50">
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
