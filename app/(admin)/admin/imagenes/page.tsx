'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Link2, Trash2, ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmDialog'

export default function AdminImagesPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: toastError } = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    // Fetch all product images
    fetch('/api/products')
      .then(r => r.json())
      .then((products: any[]) => {
        const allImages = products.flatMap((p: any) =>
          (p.images || []).map((img: any) => ({
            ...img,
            productName: p.name,
            productId: p.id,
          }))
        )
        setImages(allImages)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (img: any) => {
    const ok = await confirm({
      title: 'Eliminar imagen',
      message: `¿Eliminar esta imagen de "${img.productName}"?`,
      confirmLabel: 'Eliminar',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/products/${img.productId}/images/${img.id}`, { method: 'DELETE' })
      if (res.ok) {
        success('Imagen eliminada correctamente.')
        setImages(prev => prev.filter(i => i.id !== img.id))
      } else {
        toastError('Error al eliminar imagen.')
      }
    } catch {
      toastError('Error al eliminar imagen.')
    }
  }

  if (loading) return <div className="p-10 text-center text-sm text-text-secondary">Cargando imágenes...</div>

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient mb-1">Gestor de Imágenes</h1>
        <p className="text-sm text-text-secondary">Todas las imágenes de productos en un solo lugar. Total: {images.length}</p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-card/60 border border-white/[0.06] rounded-xl px-4">
          <ImageIcon className="w-16 h-16 mx-auto text-text-secondary/30 mb-4" />
          <p className="text-text-secondary text-lg">No hay imágenes cargadas.</p>
          <p className="text-text-secondary text-sm mt-2">Subí imágenes desde la página de edición de cada producto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {images.map((img) => (
            <div key={img.id} className="group bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden hover:border-accent/30 transition-colors">
              <div className="relative aspect-square">
                <Image src={img.url} alt={img.altText || ''} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-white truncate">{img.productName}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {img.sourceType === 'UPLOAD' ? 'Subida' : 'URL'} {img.isPrimary ? '• Principal' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

