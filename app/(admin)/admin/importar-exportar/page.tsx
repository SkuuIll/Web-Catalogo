'use client'

import React, { useState } from 'react'
import { Download, Loader2, Upload } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ImportExportPage() {
  const [loading, setLoading] = useState(false)
  const { success, error: toastError } = useToast()

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/products/import', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) success(data.message || 'Importación completada.')
      else toastError(data.error || 'Error al importar.')
    } catch (err) {
      console.error('Import error:', err);
      toastError('Error al importar.')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient mb-1">Importar / Exportar</h1>
        <p className="text-sm text-text-secondary">Gestioná productos en lote con archivos CSV.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <a href="/api/products/export" className="rounded-lg border border-white/[0.06] bg-card/40 p-6 hover:border-accent/40 transition-colors">
          <Download className="w-8 h-8 text-accent mb-4" />
          <h2 className="text-lg font-bold text-white">Exportar catálogo</h2>
          <p className="text-sm text-text-secondary mt-2">Descargá todos los productos en formato CSV.</p>
          <span className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black">Descargar CSV</span>
        </a>
        <label className="rounded-lg border border-dashed border-white/[0.06] bg-card/40 p-6 hover:border-accent/40 transition-colors cursor-pointer">
          {loading ? <Loader2 className="w-8 h-8 text-accent mb-4 animate-spin" /> : <Upload className="w-8 h-8 text-accent mb-4" />}
          <h2 className="text-lg font-bold text-white">Importar productos</h2>
          <p className="text-sm text-text-secondary mt-2">Subí un CSV con columnas como name, category, price, stock, brand, model, sizes, colors.</p>
          <span className="mt-5 inline-flex rounded-lg border border-accent/30 px-4 py-2 text-sm font-bold text-accent">Seleccionar CSV</span>
          <input type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" disabled={loading} />
        </label>
      </div>
    </div>
  )
}

