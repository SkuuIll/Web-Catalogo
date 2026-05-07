'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Upload, Link2, Trash2, Sparkles, MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useUnsavedChanges } from '@/lib/useUnsavedChanges'
import { Stepper, type Step } from '@/components/ui/Stepper'
import { useAdvancedMode } from '@/components/admin/AdvancedModeProvider'

export default function NewProductPage() {
  const router = useRouter()
  const { isAdvanced } = useAdvancedMode()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const { success, error: toastError } = useToast()

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', brand: '', model: '',
    sizes: '', colors: '', specs: '', price: '', compareAtPrice: '', status: 'PUBLISHED',
    deliveryMode: 'INMEDIATA', categoryId: '', stock: '0', active: true, featured: false,
    whatsappMessageOverride: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImageUrl: ''
  })

  useUnsavedChanges(formData.name.length > 0 || formData.description.length > 0)

  const addSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes ? (prev.sizes.split(/,\s*/).includes(size) ? prev.sizes : `${prev.sizes}, ${size}`) : size
    }))
  }

  const addColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors ? (prev.colors.split(/,\s*/).includes(color) ? prev.colors : `${prev.colors}, ${color}`) : color
    }))
  }

  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingUrls, setPendingUrls] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data)).catch(console.error)
  }, [])

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setPendingFiles(prev => [...prev, ...Array.from(files)])
    e.target.value = ''
  }

  const handleUrlAdd = () => {
    if (!imageUrlInput.trim()) return
    setPendingUrls(prev => [...prev, imageUrlInput.trim()])
    setImageUrlInput('')
  }

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removePendingUrl = (index: number) => {
    setPendingUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerateAI = async () => {
    if (!formData.name) { toastError('Primero ingresá el nombre del producto'); return }
    setGeneratingAI(true)
    try {
      const selectedCategory = categories.find((c: any) => c.id === formData.categoryId) as any
      const res = await fetch('/api/ai/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, categoryName: selectedCategory?.name,
          price: formData.price, stock: formData.stock, brand: formData.brand,
          model: formData.model, sizes: formData.sizes, colors: formData.colors, specs: formData.specs,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          shortDescription: data.shortDescription || prev.shortDescription,
          description: data.description || prev.description,
          whatsappMessageOverride: data.whatsappMessage || prev.whatsappMessageOverride
        }))
        success('Publicación mejorada con IA')
      } else { toastError(data.error || 'Error al generar con IA') }
    } catch { toastError('Error de conexión con IA') }
    finally { setGeneratingAI(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (parseFloat(formData.price) <= 0) { toastError('El precio debe ser mayor a 0.'); setLoading(false); return }

    let slug = formData.slug
    if (!slug) {
      const baseSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
    }

    try {
      if (pendingFiles.length > 0 || pendingUrls.length > 0) setUploadingImages(true)
      const fd = new FormData()
      fd.append('data', JSON.stringify({
        ...formData, slug,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        stock: parseInt(formData.stock, 10),
      }))
      pendingFiles.forEach(file => fd.append('images', file))
      pendingUrls.forEach(url => fd.append('imageUrls', url))

      const res = await fetch('/api/products', { method: 'POST', body: fd })
      if (res.ok) { success('Producto e imágenes creados correctamente.'); router.push('/admin/productos'); router.refresh() }
      else { const errData = await res.json().catch(() => ({})); toastError(errData.error || 'Error al crear producto.') }
    } catch { toastError('Error al crear producto y subir imágenes.') }
    finally { setUploadingImages(false); setLoading(false) }
  }

  const inputClass = "w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none text-sm"
  const labelClass = "block text-sm font-medium text-text-secondary mb-1"

  const basicFieldsContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>Nombre *</label>
        <input type="text" required name="name" value={formData.name} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Slug (opcional)</label>
        <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} placeholder="auto-generado" />
      </div>
      <div>
        <label className={labelClass}>Precio (ARS) *</label>
        <input type="number" step="0.01" required name="price" value={formData.price} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Precio Anterior (ARS, opcional)</label>
        <input type="number" step="0.01" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Categoría *</label>
        <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClass}>
          <option value="">Seleccionar categoría...</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Stock *</label>
        <input type="number" required name="stock" value={formData.stock} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Modo de entrega</label>
        <select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange} className={inputClass}>
          <option value="INMEDIATA">Entrega inmediata</option>
          <option value="POR_PEDIDO">Por pedido</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Estado</label>
        <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="PAUSED">Pausado</option>
          <option value="SOLD_OUT">Agotado</option>
        </select>
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-accent" />
          <span className="text-sm">Producto Activo</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-accent" />
          <span className="text-sm">Destacar en Inicio</span>
        </label>
      </div>
    </div>
  )

  const attributesContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>Marca</label>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="Nike, Stanley, Bosch..." />
      </div>
      <div>
        <label className={labelClass}>Modelo / Línea</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} className={inputClass} placeholder="Air Max, Classic 1L..." />
      </div>
      <div>
        <label className={labelClass}>Talles / variantes</label>
        <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className={`${inputClass} mb-2`} placeholder="S, M, L, XL / 39, 40, 41" />
        <div className="flex flex-wrap gap-1">
          {['S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43'].map(s => (
            <button type="button" key={s} onClick={() => addSize(s)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Colores</label>
        <input type="text" name="colors" value={formData.colors} onChange={handleChange} className={`${inputClass} mb-2`} placeholder="Negro, blanco, rojo..." />
        <div className="flex flex-wrap gap-1">
          {['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo', 'Verde', 'Beige'].map(c => (
            <button type="button" key={c} onClick={() => addColor(c)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{c}</button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className={labelClass}>Detalles técnicos, medidas o material</label>
        <textarea name="specs" value={formData.specs} onChange={handleChange} rows={3} className={inputClass} placeholder="Material, medidas, potencia..." />
      </div>
    </div>
  )

  const publicationContent = (
    <div className="space-y-4">
      {isAdvanced && (
        <div className="flex justify-end mb-2">
          <button
            type="button" onClick={handleGenerateAI}
            disabled={generatingAI || !formData.name}
            className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generatingAI ? 'Generando...' : 'Mejorar con IA'}
          </button>
        </div>
      )}
      <div>
        <label className={labelClass}>Descripción Corta</label>
        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Descripción Completa</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={inputClass} />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1">
          <MessageCircle className="w-4 h-4 text-accent" />
          Mensaje WhatsApp personalizado
        </label>
        <textarea name="whatsappMessageOverride" value={formData.whatsappMessageOverride} onChange={handleChange} rows={3} className={inputClass} placeholder="Ej: Hola! Quiero consultar por {productName}..." />
      </div>
    </div>
  )

  const seoContent = (
    <div className="space-y-4">
      <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputClass} placeholder="Título SEO" />
      <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className={inputClass} placeholder="Descripción SEO" />
      <input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className={inputClass} placeholder="Keywords separadas por coma" />
      <input name="ogImageUrl" value={formData.ogImageUrl} onChange={handleChange} className={inputClass} placeholder="Imagen Open Graph opcional" />
    </div>
  )

  const imagesContent = (
    <div>
      <label className="block w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors mb-4">
        <Upload className="w-8 h-8 mx-auto text-text-secondary mb-2" />
        <span className="text-sm text-text-secondary">Arrastrá o tocá para subir</span>
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
      </label>

      <div className="flex gap-2 mb-4">
        <input
          type="url" value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          placeholder="Pegá una URL..."
          className={`${inputClass} flex-1`}
        />
        <button type="button" onClick={handleUrlAdd} className="bg-accent/20 text-accent hover:bg-accent/30 px-3 rounded-lg transition-colors">
          <Link2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {pendingFiles.map((file, i) => (
          <div key={`file-${i}`} className="relative rounded-lg overflow-hidden border border-white/5 h-24">
            <Image src={URL.createObjectURL(file)} alt="preview" fill className="object-cover" sizes="120px" unoptimized />
            <button type="button" onClick={() => removePendingFile(i)} className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors z-10">
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        {pendingUrls.map((url, i) => (
          <div key={`url-${i}`} className="relative rounded-lg overflow-hidden border border-white/5 h-24">
            <Image src={url} alt="preview" fill className="object-cover" sizes="120px" unoptimized />
            <button type="button" onClick={() => removePendingUrl(i)} className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors z-10">
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
      </div>
      {pendingFiles.length === 0 && pendingUrls.length === 0 && (
        <p className="text-sm text-text-secondary text-center py-4">Sin imágenes preparadas</p>
      )}
      <p className="text-xs text-text-secondary mt-2">Las imágenes se suben al crear el producto.</p>
    </div>
  )

  const stepList: Step[] = [
    { id: 'info', label: 'Info', content: basicFieldsContent },
    { id: 'attrs', label: 'Atributos', content: attributesContent },
    { id: 'publish', label: 'Publicación', content: publicationContent },
    ...(isAdvanced ? [{ id: 'seo', label: 'SEO', content: seoContent, optional: true }] : []),
    { id: 'images', label: 'Imágenes', content: imagesContent },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Link href="/admin/productos" className="text-text-secondary hover:text-text-primary text-2xl">←</Link>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Nuevo Producto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mobile: stepper wizard */}
        <div className="lg:hidden bg-card border border-border rounded-lg p-4 sm:p-6">
          <Stepper steps={stepList} />
        </div>

        {/* Desktop: layout normal */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">
            {basicFieldsContent}

            <div className="border-t border-border pt-6">
              <h3 className="mb-4 text-lg font-bold">Atributos y variantes</h3>
              {attributesContent}
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Publicación</h3>
                <button type="button" onClick={handleGenerateAI} disabled={generatingAI || !formData.name}
                  className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50">
                  {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generatingAI ? 'Generando...' : 'Mejorar con IA'}
                </button>
              </div>
              {publicationContent}
            </div>

            {isAdvanced && (
              <div className="border-t border-border pt-6">
                <h3 className="mb-4 text-lg font-bold">SEO del producto</h3>
                {seoContent}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={loading || uploadingImages}
                className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {(loading || uploadingImages) && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploadingImages ? 'Subiendo imágenes...' : loading ? 'Creando...' : 'Crear Producto'}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Imágenes (se suben al crear)</h2>
            {imagesContent}
          </div>
        </div>
      </form>
    </div>
  )
}
