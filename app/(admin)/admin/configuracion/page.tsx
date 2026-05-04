'use client'
import React, { useState, useEffect } from 'react'

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/config').then(res => res.json()).then(data => { setConfig(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setConfig({ ...config, [e.target.name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
      if (res.ok) alert('Configuración guardada correctamente.');
      else alert('Error al guardar configuración.');
    } catch (error) {
      alert('Error al guardar configuración.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configuración Global</h1>
          <p className="text-text-secondary">Administra los parámetros de la tienda.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded transition-colors disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <form className="p-6 space-y-8" onSubmit={handleSave}>
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2 text-accent">WhatsApp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Número de WhatsApp</label>
                <input type="text" name="whatsappNumber" value={config?.whatsappNumber || ''} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="ej: 5491112345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Habilitar Botón Flotante</label>
                <div className="mt-2 flex items-center">
                  <input type="checkbox" name="whatsappButtonEnabled" checked={config?.whatsappButtonEnabled || false} onChange={handleChange} className="w-5 h-5 accent-accent" />
                  <span className="ml-2 text-sm text-text-secondary">Mostrar en la tienda</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">Mensaje Predeterminado (Productos)</label>
                <textarea name="whatsappMessage" value={config?.whatsappMessage || ''} onChange={handleChange} rows={2} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" placeholder="Hola! Me interesa el producto: {productName} - Precio: ${price} ARS." />
                <p className="text-xs text-text-secondary mt-1">Variables disponibles: {`{productName}`}, {`{price}`}</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2 text-accent">General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nombre del Sitio</label>
                <input type="text" name="siteName" value={config?.siteName || ''} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Slogan del Sitio</label>
                <input type="text" name="siteSlogan" value={config?.siteSlogan || ''} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">URL del Logo</label>
                <input type="text" name="logoUrl" value={config?.logoUrl || ''} onChange={handleChange} className="w-full bg-secondary border border-border rounded px-4 py-2 focus:border-accent outline-none" />
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
