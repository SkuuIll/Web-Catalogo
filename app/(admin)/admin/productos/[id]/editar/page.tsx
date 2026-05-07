'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Link2, Trash2, Star, Sparkles, Loader2, Eye, MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { SkeletonForm } from '@/components/ui/Skeleton'
import { useUnsavedChanges } from '@/lib/useUnsavedChanges'
import { Stepper, type Step } from '@/components/ui/Stepper'
import { useAdvancedMode } from '@/components/admin/AdvancedModeProvider'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { isAdvanced } = useAdvancedMode()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const { success, error: toastError } = useToast()
  const confirm = useConfirm()
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '',
    brand: '', model: '', sizes: '', colors: '', specs: '',
    price: '', compareAtPrice: '', status: 'PUBLISHED', deliveryMode: 'INMEDIATA',
    categoryId: '', stock: '0', active: true, featured: false,
    whatsappMessageOverride: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImageUrl: ''
  })

  useUnsavedChanges(formData.name.length > 0 || formData.description.length > 0)

  const addSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes ? (prev.sizes.includes(size) ? prev.sizes : `${prev.sizes}, ${size}`) : size
    }))
  }

  const addColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors ? (prev.colors.includes(color) ? prev.colors : `${prev.colors}, ${color}`) : color
    }))
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/products/${productId}`).then(r => r.json()),
    ]).then(([cats, product]) => {
      setCategories(cats)
      setFormData({
        name: product.name || '', slug: product.slug || '',
        description: product.description || '', shortDescription: product.shortDescription || '',
        brand: product.brand || '', model: product.model || '',
        sizes: product.sizes || '', colors: product.colors || '', specs: product.specs || '',
        price: String(product.price || ''), compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
        status: product.status || 'PUBLISHED', deliveryMode: product.deliveryMode || 'INMEDIATA',
        categoryId: product.categoryId || '', stock: String(product.stock || 0),
        active: product.active ?? true, featured: product.featured ?? false,
        whatsappMessageOverride: product.whatsappMessageOverride || '',
        metaTitle: product.metaTitle || '', metaDescription: product.metaDescription || '',
        metaKeywords: product.metaKeywords || '', ogImageUrl: product.ogImageUrl || '',
      })
      setImages(product.images || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [productId])

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (parseFloat(formData.price) <= 0) { toastError('El precio debe ser mayor a 0.'); setSaving(false); return }
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          stock: parseInt(formData.stock, 10),
        })
      })
      if (res.ok) { success('Producto guardado correctamente.'); router.push('/admin/productos'); router.refresh() }
      else toastError('Error al guardar producto.')
    } catch { toastError('Error al guardar producto.') } finally { setSaving(false) }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch(`/api/products/${productId}/images`, { method: 'POST', body: fd })
        if (res.ok) { const img = await res.json(); setImages(prev => [...prev, img]) }
      } catch {}
    }
    setUploading(false)
    e.target.value = ''
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

  const handleUrlImport = async () => {
    if (!imageUrl.trim()) return
    setUploading(true)
    try {
      const res = await fetch(`/api/products/${productId}/images`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl.trim() })
      })
      if (res.ok) { const img = await res.json(); setImages(prev => [...prev, img]); setImageUrl('') }
    } catch {}
    setUploading(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    const ok = await confirm({
      title: 'Eliminar imagen', message: '¿Querés eliminar esta imagen del producto?',
      confirmLabel: 'Eliminar', tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, { method: 'DELETE' })
      if (res.ok) { success('Imagen eliminada.'); setImages(prev => prev.filter(i => i.id !== imageId)) }
      else toastError('Error al eliminar imagen.')
    } catch { toastError('Error al eliminar imagen.') }
  }

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, { method: 'PUT' })
      if (res.ok) {
        success('Imagen principal actualizada.')
        setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === imageId })))
      } else { toastError('Error al marcar imagen principal.') }
    } catch { toastError('Error al marcar imagen principal.') }
  }

  if (loading) return <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full"><SkeletonForm fields={10} /></div>

  const inputClass = "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-text-secondary mb-1"

  const basicFieldsContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className={labelClass}>Nombre *</label><input type="text" required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
      <div><label className={labelClass}>Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} /></div>
      <div><label className={labelClass}>Precio (ARS) *</label><input type="number" step="0.01" required name="price" value={formData.price} onChange={handleChange} className={inputClass} /></div>
      <div><label className={labelClass}>Precio Anterior</label><input type="number" step="0.01" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className={inputClass} /></div>
      <div><label className={labelClass}>Categoría *</label><select required name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClass}><option value="">Seleccionar...</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div><label className={labelClass}>Stock *</label><input type="number" required name="stock" value={formData.stock} onChange={handleChange} className={inputClass} /></div>
      <div><label className={labelClass}>Modo de entrega</label><select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange} className={inputClass}><option value="INMEDIATA">Entrega inmediata</option><option value="POR_PEDIDO">Por pedido</option></select></div>
      <div><label className={labelClass}>Estado</label><select name="status" value={formData.status} onChange={handleChange} className={inputClass}><option value="DRAFT">Borrador</option><option value="PUBLISHED">Publicado</option><option value="PAUSED">Pausado</option><option value="SOLD_OUT">Agotado</option></select></div>
      <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-accent" /><span className="text-sm">Activo</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-accent" /><span className="text-sm">Destacado</span></label>
      </div>
    </div>
  )

  const attributesContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className={labelClass}>Marca</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="Nike, Bosch, Stanley..." /></div>
      <div><label className={labelClass}>Modelo / Línea</label><input type="text" name="model" value={formData.model} onChange={handleChange} className={inputClass} placeholder="Air Max, Classic..." /></div>
      <div>
        <label className={labelClass}>Talles / variantes</label>
        <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className={`${inputClass} mb-2`} placeholder="S, M, L / 38, 39, 40" />
        <div className="flex flex-wrap gap-1">{['S','M','L','XL','XXL','38','39','40','41','42','43'].map(s => (<button type="button" key={s} onClick={() => addSize(s)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{s}</button>))}</div>
      </div>
      <div>
        <label className={labelClass}>Colores</label>
        <input type="text" name="colors" value={formData.colors} onChange={handleChange} className={`${inputClass} mb-2`} placeholder="Negro, blanco..." />
        <div className="flex flex-wrap gap-1">{['Negro','Blanco','Gris','Azul','Rojo','Verde','Beige'].map(c => (<button type="button" key={c} onClick={() => addColor(c)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{c}</button>))}</div>
      </div>
      <div className="md:col-span-2"><label className={labelClass}>Detalles técnicos, medidas o material</label><textarea name="specs" value={formData.specs} onChange={handleChange} rows={3} className={inputClass} placeholder="Material, medidas, potencia..." /></div>
    </div>
  )

  const publicationContent = (
    <div className="space-y-4">
      {isAdvanced && (
        <div className="flex justify-end mb-2">
          <button type="button" onClick={handleGenerateAI} disabled={generatingAI || !formData.name}
            className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50">
            {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generatingAI ? 'Generando...' : 'Mejorar con IA'}
          </button>
        </div>
      )}
      <div><label className={labelClass}>Descripción Corta</label><textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className={inputClass} /></div>
      <div><label className={labelClass}>Descripción Completa</label><textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={inputClass} /></div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1"><MessageCircle className="w-4 h-4 text-accent" />Mensaje WhatsApp personalizado</label>
        <textarea name="whatsappMessageOverride" value={formData.whatsappMessageOverride} onChange={handleChange} rows={2} className={inputClass} placeholder="Variables: {productName}, {price}" />
      </div>
    </div>
  )

  const seoContent = (
    <div className="space-y-4">
      <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputClass} placeholder="Título SEO" />
      <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className={inputClass} placeholder="Descripción SEO" />
      <input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className={inputClass} placeholder="Keywords" />
      <input name="ogImageUrl" value={formData.ogImageUrl} onChange={handleChange} className={inputClass} placeholder="Imagen Open Graph opcional" />
    </div>
  )

  const imagesContent = (
    <div>
      <label className="block w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 relative">
        <Upload className="w-8 h-8 mx-auto text-text-secondary mb-2" />
        <span className="text-sm text-text-secondary">Arrastrá o tocá para subir</span>
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
        {uploading && (
          <div className="absolute inset-0 bg-card/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
            <span className="text-sm font-bold text-accent">Subiendo...</span>
          </div>
        )}
      </label>

      <div className="flex gap-2 mb-4">
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de imagen..." className={`${inputClass} flex-1`} />
        <button onClick={handleUrlImport} disabled={uploading} className="bg-accent/20 text-accent hover:bg-accent/30 px-3 rounded-lg transition-colors"><Link2 className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-white/5">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.altText || ''} fill className="object-cover" sizes="150px" />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={() => handleSetPrimaryImage(img.id)} className="p-1.5 bg-black/60 rounded-full hover:bg-accent transition-colors">
                <Star className={`w-3 h-3 ${img.isPrimary ? 'text-accent fill-accent' : 'text-white'}`} />
              </button>
              <button type="button" onClick={() => handleDeleteImage(img.id)} className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors">
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
            {img.isPrimary && <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black">Principal</span>}
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-sm text-text-secondary text-center py-4">Sin imágenes</p>}
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
        <Link href="/admin/productos" className="text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <p className="text-text-secondary text-sm">{formData.name}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/producto/${formData.slug}`} target="_blank"
            className="border border-white/10 text-text-secondary hover:text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Ver
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave}>
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
              <button type="submit" disabled={saving}
                className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Imágenes del producto</h2>
            {imagesContent}
          </div>
        </div>
      </form>
    </div>
  )
}
