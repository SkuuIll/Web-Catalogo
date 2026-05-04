'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, MessageCircle, Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const { success, error: toastError } = useToast()
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', brand: '', model: '', sizes: '', colors: '', specs: '', price: '', compareAtPrice: '', status: 'PUBLISHED', categoryId: '', stock: '0', active: true, featured: false, whatsappMessageOverride: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImageUrl: ''
  })

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data)).catch(console.error)
  }, [])

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleGenerateAI = async () => {
    if (!formData.name) {
      toastError('Primero ingresa el nombre del producto');
      return;
    }
    setGeneratingAI(true);
    try {
      const selectedCategory = categories.find((category: any) => category.id === formData.categoryId) as any
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          categoryName: selectedCategory?.name,
          price: formData.price,
          stock: formData.stock,
          brand: formData.brand,
          model: formData.model,
          sizes: formData.sizes,
          colors: formData.colors,
          specs: formData.specs,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          shortDescription: data.shortDescription || prev.shortDescription,
          description: data.description || prev.description,
          whatsappMessageOverride: data.whatsappMessage || prev.whatsappMessageOverride
        }));
        success('Publicación mejorada con IA');
      } else {
        toastError(data.error || 'Error al generar con IA');
      }
    } catch {
      toastError('Error de conexión con IA');
    } finally {
      setGeneratingAI(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (parseFloat(formData.price) <= 0) {
      toastError('El precio debe ser mayor a 0.')
      setLoading(false)
      return
    }

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
        success('Producto creado correctamente.')
        router.push('/admin/productos')
        router.refresh()
      } else {
        toastError('Error al crear producto. Verificá que el slug no esté en uso.')
      }
    } catch (err) {
      toastError('Error al crear producto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Link href="/admin/productos" className="text-text-secondary hover:text-text-primary text-2xl">←</Link>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Nuevo Producto</h1>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6">
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
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Estado</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none">
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="PAUSED">Pausado</option>
                <option value="SOLD_OUT">Agotado</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="mb-1 text-lg font-bold">Atributos y variantes</h3>
            <p className="mb-4 text-xs text-text-secondary">Sirve para ropa, gorras, zapatillas, herramientas, tecnología y productos generales.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Marca</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Nike, Stanley, Bosch..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Modelo / Línea</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Air Max, Classic 1L, GSB..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Talles / variantes</label>
                <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="S, M, L, XL / 39, 40, 41 / 1L" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Colores</label>
                <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Negro, blanco, rojo..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">Detalles técnicos, medidas o material</label>
                <textarea name="specs" value={formData.specs} onChange={handleChange} rows={3} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Material, medidas, potencia, compatibilidad, contenido del kit, estado, uso recomendado..." />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 mt-2">
              <div>
                <h3 className="font-bold text-lg">Publicación</h3>
                <p className="text-xs text-text-secondary">Gemini puede completar textos de venta y WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={generatingAI || !formData.name}
                className="w-full sm:w-auto justify-center bg-accent/20 hover:bg-accent/30 text-accent font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                title="Genera textos automáticamente usando los datos del producto"
              >
                {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generatingAI ? 'Generando...' : 'Mejorar con IA'}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Descripción Corta</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Descripción Completa</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1">
                  <MessageCircle className="w-4 h-4 text-accent" />
                  Mensaje WhatsApp personalizado
                </label>
                <textarea
                  name="whatsappMessageOverride"
                  value={formData.whatsappMessageOverride}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none"
                  placeholder="Ej: Hola! Quiero consultar por {productName}, precio {price}. ¿Me pasás más info?"
                />
                <p className="mt-1 text-xs text-text-secondary">Variables disponibles: {'{productName}'} y {'{price}'}. Si lo dejás vacío usa el mensaje global.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-medium">Producto Activo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-medium">Destacar en Inicio</span>
            </label>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="mb-4 text-lg font-bold">SEO del producto</h3>
            <div className="space-y-4">
              <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Título SEO" />
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Descripción SEO" />
              <input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Keywords separadas por coma" />
              <input name="ogImageUrl" value={formData.ogImageUrl} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Imagen Open Graph opcional" />
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <button type="button" onClick={() => toastError('Guardá el producto para previsualizarlo con su URL final.')} className="w-full sm:w-auto border border-white/10 text-text-secondary hover:text-white font-bold py-2.5 px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" /> Previsualizar
            </button>
            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-primary font-bold py-2.5 px-8 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
