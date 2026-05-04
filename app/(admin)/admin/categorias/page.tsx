'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Loader2, Upload } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmDialog'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const confirm = useConfirm()
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', imageUrl: '', active: true, sortOrder: 0
  })
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        success('Imagen subida correctamente')
      } else {
        toastError(data.error || 'Error al subir imagen')
      }
    } catch {
      toastError('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const loadCategories = () => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { setCategories(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadCategories() }, [])

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', imageUrl: '', active: true, sortOrder: 0 })
    setEditId(null)
    setShowForm(false)
  }

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    // Auto-generate slug from name
    if (e.target.name === 'name' && !editId) {
      const autoSlug = e.target.value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, name: e.target.value, slug: autoSlug }))
      return
    }
    setFormData(prev => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const url = editId ? `/api/categories/${editId}` : '/api/categories'
    const method = editId ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sortOrder: Number(formData.sortOrder) })
      })
      const data = await res.json()
      if (res.ok) {
        success(editId ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.')
        resetForm()
        loadCategories()
      } else {
        toastError(data.error || 'Error al guardar categoría.')
      }
    } catch { toastError('Error al guardar categoría.') }
    finally { setSaving(false) }
  }

  const handleEdit = (cat: any) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      active: cat.active,
      sortOrder: cat.sortOrder,
    })
    setEditId(cat.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (cat: any) => {
    const ok = await confirm({
      title: 'Eliminar categoría',
      message: `¿Eliminar la categoría "${cat.name}"?\nSolo se puede eliminar si no tiene productos asociados.`,
      confirmLabel: 'Eliminar',
      tone: 'danger',
    })
    if (!ok) return
    setDeleting(cat.id)
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        success('Categoría eliminada correctamente.')
        loadCategories()
      } else {
        toastError(data.error || 'Error al eliminar categoría.')
      }
    } catch { toastError('Error al eliminar categoría.') }
    finally { setDeleting(null) }
  }

  if (loading) return <div className="p-10 text-center text-text-secondary">Cargando categorías...</div>

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Categorías</h1>
          <p className="text-text-secondary">{categories.length} categorías registradas.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">{editId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <button onClick={resetForm} className="text-text-secondary hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nombre *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
                  placeholder="ej: Electrónica"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Slug *</label>
                <input
                  type="text"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm font-mono"
                  placeholder="ej: electronica"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Imagen de la Categoría</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
                    placeholder="URL o subir archivo..."
                  />
                  <label className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2.5 rounded-lg cursor-pointer flex items-center justify-center transition-colors">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border mt-3">
                    <img src={formData.imageUrl} alt="Vista previa" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white hover:bg-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Orden</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
                  placeholder="Descripción de la categoría..."
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 accent-accent"
              />
              <span className="text-sm font-medium">Categoría activa</span>
            </label>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-border text-text-secondary hover:text-white hover:border-white/30 transition-colors text-sm">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover text-black font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                <th className="p-4 font-medium w-16">Imagen</th>
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Orden</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="p-4">
                    {cat.imageUrl ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary border border-border">
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-text-secondary text-[10px] leading-tight text-center p-1">Sin img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-white">{cat.name}</td>
                  <td className="p-4 text-text-secondary font-mono text-sm">{cat.slug}</td>
                  <td className="p-4 text-text-secondary">{cat.sortOrder}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      cat.active
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-red-500/15 text-red-400 border border-red-500/20'
                    }`}>
                      {cat.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-secondary"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-lg hover:bg-secondary disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deleting === cat.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
