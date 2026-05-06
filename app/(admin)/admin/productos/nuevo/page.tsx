'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, MessageCircle, Sparkles, Loader2, Upload, Link2, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const { success, error: toastError } = useToast()
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '', brand: '', model: '', sizes: '', colors: '', specs: '', price: '', compareAtPrice: '', status: 'PUBLISHED', deliveryMode: 'INMEDIATA', categoryId: '', stock: '0', active: true, featured: false, whatsappMessageOverride: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImageUrl: ''
  })
  
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

    let slug = formData.slug
    if (!slug) {
      const baseSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const randomSuffix = Math.random().toString(36).substring(2, 6)
      slug = `${baseSlug}-${randomSuffix}`
    }

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
        const newProduct = await res.json()
        let hasErrors = false;
        
        if (pendingFiles.length > 0 || pendingUrls.length > 0) {
          setUploadingImages(true)
        }
        
        for (const file of pendingFiles) {
          const fd = new FormData()
          fd.append('file', file)
          const imgRes = await fetch(`/api/products/${newProduct.id}/images`, { method: 'POST', body: fd }).catch(e => {
            console.error(e);
            return null;
          })
          
          if (!imgRes || !imgRes.ok) {
            hasErrors = true;
            const errText = imgRes ? await imgRes.text().catch(() => 'Error desconocido') : 'Error de red';
            toastError(`Error al subir imagen ${file.name}: ${errText.slice(0, 50)}`)
          }
        }
        
        for (const url of pendingUrls) {
          const imgRes = await fetch(`/api/products/${newProduct.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          }).catch(() => null)
          if (!imgRes || !imgRes.ok) {
            hasErrors = true;
            toastError(`Error al subir imagen desde URL`)
          }
        }

        if (hasErrors) {
          success('Producto creado, pero hubo errores con algunas imágenes. Revisalas en la edición.');
          router.push(`/admin/productos/${newProduct.id}/editar`);
        } else {
          success('Producto e imágenes creados correctamente.')
          router.push('/admin/productos')
        }
        router.refresh()
      } else {
        const errData = await res.json().catch(() => ({}));
        toastError(errData.error || 'Error al crear producto. Verificá que el slug no esté en uso.')
      }
    } catch (err) {
      toastError('Error al crear producto.')
    } finally {
      setUploadingImages(false)
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Link href="/admin/productos" className="text-text-secondary hover:text-text-primary text-2xl">←</Link>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Nuevo Producto</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 sm:p-6">
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
                <label className="block text-sm font-medium text-text-secondary mb-1">Modo de entrega</label>
                <select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none">
                  <option value="INMEDIATA">Entrega inmediata</option>
                  <option value="POR_PEDIDO">Por pedido</option>
                </select>
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
                  <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none mb-2" placeholder="S, M, L, XL / 39, 40, 41 / 1L" />
                  <div className="flex flex-wrap gap-1">
                    {['S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43'].map(s => (
                      <button type="button" key={s} onClick={() => addSize(s)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Colores</label>
                  <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none mb-2" placeholder="Negro, blanco, rojo..." />
                  <div className="flex flex-wrap gap-1">
                    {['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo', 'Verde', 'Beige'].map(c => (
                      <button type="button" key={c} onClick={() => addColor(c)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded transition-colors">{c}</button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Detalles técnicos, medidas o material</label>
                  <textarea name="specs" value={formData.specs} onChange={handleChange} rows={3} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Material, medidas, potencia, compatibilidad, contenido del kit..." />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 mt-2">
                <div>
                  <h3 className="font-bold text-lg">Publicación</h3>
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

            <div className="pt-6 flex justify-end">
              <button type="submit" disabled={loading || uploadingImages} className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {(loading || uploadingImages) && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploadingImages ? 'Subiendo imágenes...' : loading ? 'Creando...' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>

        {/* Panel de Imágenes lateral */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Imágenes (se suben al crear)</h2>
          
          <div className="mb-4">
            <label className="block w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
              <Upload className="w-8 h-8 mx-auto text-text-secondary mb-2" />
              <span className="text-sm text-text-secondary">Arrastrá o hacé clic para subir</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Pegá una URL..."
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
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
        </div>
      </div>
    </div>
  )
}
