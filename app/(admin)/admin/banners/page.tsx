'use client'
import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Megaphone, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useConfirm } from '@/components/ui/ConfirmDialog'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const confirm = useConfirm()
  const [formData, setFormData] = useState({
    title: '', imageUrl: '', linkUrl: '', linkText: '',
    position: 'HERO', active: true, sortOrder: 0
  })

  const loadBanners = () => {
    fetch('/api/banners').then(r => r.json()).then(data => {
      setBanners(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { loadBanners() }, [])

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const resetForm = () => {
    setFormData({ title: '', imageUrl: '', linkUrl: '', linkText: '', position: 'HERO', active: true, sortOrder: 0 })
    setEditId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editId ? `/api/banners/${editId}` : '/api/banners'
    const method = editId ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sortOrder: Number(formData.sortOrder) })
      })
      if (res.ok) {
        success(editId ? 'Banner actualizado.' : 'Banner creado.')
        resetForm()
        loadBanners()
      } else {
        toastError('Error al guardar banner.')
      }
    } catch { toastError('Error al guardar banner.') }
  }

  const handleEdit = (banner: any) => {
    setFormData({
      title: banner.title, imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '', linkText: banner.linkText || '',
      position: banner.position, active: banner.active,
      sortOrder: banner.sortOrder
    })
    setEditId(banner.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Eliminar banner',
      message: '¿Querés eliminar este banner promocional?',
      confirmLabel: 'Eliminar',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
      if (res.ok) { success('Banner eliminado.'); loadBanners() }
      else toastError('Error al eliminar banner.')
    } catch { toastError('Error al eliminar banner.') }
  }

  if (loading) return <div className="p-10 text-center text-sm text-text-secondary">Cargando...</div>

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient mb-1">Banners</h1>
          <p className="text-sm text-text-secondary">Administra los banners promocionales.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="bg-card/60 border border-white/[0.06] rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editId ? 'Editar Banner' : 'Nuevo Banner'}</h2>
            <button onClick={resetForm} className="text-text-secondary hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Título</label>
                <input type="text" required name="title" value={formData.title} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">URL Imagen</label>
                <input type="url" required name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">URL Enlace</label>
                <input type="text" name="linkUrl" value={formData.linkUrl} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Texto Enlace</label>
                <input type="text" name="linkText" value={formData.linkText} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Posición</label>
                <select name="position" value={formData.position} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none">
                  <option value="HERO">Hero</option>
                  <option value="MIDDLE">Medio</option>
                  <option value="FOOTER">Footer</option>
                  <option value="SIDEBAR">Sidebar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Orden</label>
                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-accent outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-medium">Activo</span>
            </label>
            <div className="flex justify-end">
              <button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-8 rounded-lg transition-colors">
                {editId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary text-text-secondary text-sm border-b border-border">
              <th className="p-4 font-medium">Título</th>
              <th className="p-4 font-medium">Posición</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-sm text-text-secondary">No hay banners.</td></tr>
            ) : banners.map((b) => (
              <tr key={b.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="p-4 font-medium">{b.title}</td>
                <td className="p-4 text-text-secondary text-sm">{b.position}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${b.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {b.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(b)} className="p-2 text-text-secondary hover:text-accent transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-text-secondary hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

