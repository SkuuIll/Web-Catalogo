'use client'
import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import {
  BadgeCheck,
  Bot,
  FileText,
  Loader2,
  MessageCircle,
  Palette,
  PanelBottom,
  Save,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'

const tabs = [
  { id: 'general', label: 'General', desc: 'Identidad y mantenimiento', icon: Settings },
  { id: 'apariencia', label: 'Apariencia', desc: 'Hero, colores e imagen', icon: Palette },
  { id: 'whatsapp', label: 'WhatsApp', desc: 'Consultas y mensajes', icon: MessageCircle },
  { id: 'redes', label: 'Redes', desc: 'Perfiles y banners', icon: Share2 },
  { id: 'badges', label: 'Confianza', desc: 'Sellos comerciales', icon: BadgeCheck },
  { id: 'seo', label: 'SEO', desc: 'Buscadores y previews', icon: Search },
  { id: 'paginas', label: 'Páginas', desc: 'Legales e institucionales', icon: FileText },
  { id: 'footer', label: 'Footer', desc: 'Pie y moneda', icon: PanelBottom },
  { id: 'ia', label: 'IA', desc: 'Proveedor y API key', icon: Bot },
]

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const { success, error: toastError } = useToast()

  useEffect(() => {
    fetch('/api/config?admin=true').then(r => r.json()).then(data => { setConfig(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setConfig({ ...config, [e.target.name]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const { aiApiKeyConfigured, ...payload } = config
      const res = await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { const data = await res.json(); setConfig(data); setSaved(true); success('Configuración guardada correctamente.'); setTimeout(() => setSaved(false), 3000) }
      else toastError('Error al guardar configuración.')
    } catch { toastError('Error al guardar configuración.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="p-10 text-center text-sm text-text-secondary">Cargando configuración...</div>

  const activeTabMeta = tabs.find(tab => tab.id === activeTab) || tabs[0]
  const ActiveIcon = activeTabMeta.icon

  const Field = ({ label, name, type = 'text', placeholder = '', rows, help }: { label: string; name: string; type?: string; placeholder?: string; rows?: number; help?: string }) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      {rows ? (
        <textarea name={name} value={config?.[name] || ''} onChange={handleChange} rows={rows} placeholder={placeholder} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm leading-relaxed" />
      ) : type === 'checkbox' ? (
        <div className="flex items-center mt-1">
          <input type="checkbox" name={name} checked={config?.[name] || false} onChange={handleChange} className="w-5 h-5 accent-accent" />
          <span className="ml-2 text-sm text-sm text-text-secondary">{placeholder || 'Activar'}</span>
        </div>
      ) : (
        <input type={type} name={name} value={config?.[name] || ''} onChange={handleChange} placeholder={placeholder} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm" />
      )}
      {help && <p className="mt-1.5 text-xs leading-relaxed text-sm text-text-secondary">{help}</p>}
    </div>
  )

  const ImageUploadField = ({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) => {
    const [uploading, setUploading] = useState(false)
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'site')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok) {
          setConfig((prev: any) => ({ ...prev, [name]: data.url }))
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

    return (
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
        <div className="flex gap-2">
          <input
            type="text"
            name={name}
            value={config?.[name] || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm"
          />
          <label className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2.5 rounded-lg cursor-pointer flex items-center justify-center transition-colors">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
        {config?.[name] && (
          <div className="relative mt-3 rounded-lg overflow-hidden border border-border bg-black/50 inline-block">
            <img src={config[name]} alt="Preview" className="object-contain max-h-[120px] w-auto" />
            <button type="button" onClick={() => setConfig((prev: any) => ({ ...prev, [name]: '' }))} className="absolute top-1 right-1 bg-red-500/80 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="sticky top-0 md:top-0 z-20 -mx-4 mb-6 border-b border-border bg-bg-primary/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gradient mb-1">Configuración Global</h1>
          <p className="text-sm text-text-secondary">Control central de tienda, contenido, SEO, IA y mantenimiento.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover text-black font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar'}
        </button>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:flex-col lg:overflow-visible">
        {tabs.map(tab => (
          (() => {
            const Icon = tab.icon
            return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-w-[180px] lg:min-w-0 text-left rounded-lg border px-4 py-3 transition-colors ${
              activeTab === tab.id ? 'border-accent/40 bg-accent/10 text-white' : 'border-white/[0.06] bg-card/40 text-text-secondary hover:border-white/20 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className={`rounded-lg p-2 ${activeTab === tab.id ? 'bg-accent text-black' : 'bg-secondary text-accent'}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-sm font-bold">{tab.label}</span>
                <span className="block text-xs text-sm text-text-secondary">{tab.desc}</span>
              </span>
            </span>
          </button>
            )
          })()
        ))}
      </div>
      </div>

      <div className="bg-card/60 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent/10 p-2 text-accent">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{activeTabMeta.label}</h2>
              <p className="mt-1 text-sm text-sm text-text-secondary">{activeTabMeta.desc}</p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
        {/* General */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nombre del Sitio" name="siteName" placeholder="SHOWROOM JR" />
              <Field label="Slogan" name="siteSlogan" placeholder="Tu tienda premium" />
              <ImageUploadField label="URL del Logo" name="logoUrl" placeholder="https://..." />
              <ImageUploadField label="URL del Favicon" name="faviconUrl" placeholder="https://..." />
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <Field label="Modo Mantenimiento" name="maintenanceMode" type="checkbox" placeholder="Mostrar pantalla de mantenimiento en la tienda pública" />
              <div className="mt-4 grid grid-cols-1 gap-4">
                <Field label="Título de mantenimiento" name="maintenanceTitle" placeholder="Estamos realizando mejoras" />
                <Field label="Mensaje de mantenimiento" name="maintenanceMessage" rows={3} placeholder="Volvemos pronto con novedades. Para consultas urgentes, escribinos por WhatsApp." />
              </div>
              <p className="mt-3 text-xs text-sm text-text-secondary">El panel admin seguirá disponible para que puedas editar y desactivar este modo.</p>
            </div>
          </div>
        )}

        {/* Apariencia */}
        {activeTab === 'apariencia' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Color Primario" name="primaryColor" type="color" />
              <Field label="Color Secundario (Acento)" name="secondaryColor" type="color" />
              <Field label="Título del Hero" name="heroTitle" placeholder="Todo lo que buscás." />
              <Field label="Subtítulo del Hero" name="heroSubtitle" placeholder="Selección premium..." />
            </div>
            <ImageUploadField label="URL Imagen del Hero (Banner Desktop)" name="heroImageUrl" placeholder="https://..." />
          </div>
        )}

        {/* WhatsApp */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Número de WhatsApp" name="whatsappNumber" placeholder="ej: 5491112345678" />
              <Field label="Texto del Botón" name="whatsappButtonText" placeholder="Consultar por WhatsApp" />
            </div>
            <Field label="Habilitar Botón Flotante" name="whatsappButtonEnabled" type="checkbox" placeholder="Mostrar en la tienda" />
            <Field label="Mensaje Predeterminado" name="whatsappMessage" placeholder="Hola! Me interesa el producto: {productName} - Precio: ${price} ARS." rows={3} />
            <p className="text-xs text-sm text-text-secondary">Variables disponibles: {'{productName}'}, {'{price}'}</p>
          </div>
        )}

        {/* Redes Sociales */}
        {activeTab === 'redes' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Twitter/X Handle" name="twitterHandle" placeholder="@showroomjr" />
              <Field label="Instagram Handle" name="instagramHandle" placeholder="@showroomjr" />
              <Field label="Facebook URL" name="facebookUrl" placeholder="https://facebook.com/..." />
              <ImageUploadField label="Banner URL (Open Graph/Twitter)" name="bannerImageUrl" placeholder="https://..." />
            </div>
          </div>
        )}

        {/* Badges */}
        {activeTab === 'badges' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Envío" name="shippingBadge" placeholder="Envío a todo el país" />
              <Field label="Garantía" name="warrantyBadge" placeholder="Garantía asegurada" />
              <Field label="Devoluciones" name="returnsBadge" placeholder="Devoluciones gratis" />
              <Field label="Soporte" name="supportBadge" placeholder="Soporte 24/7" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Mostrar Contador de Productos" name="showProductCount" type="checkbox" placeholder="Mostrar en el hero" />
              <Field label="Mostrar Contador de Categorías" name="showCategoryCount" type="checkbox" placeholder="Mostrar en el hero" />
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <Field label="Meta Título" name="metaTitle" placeholder="SHOWROOM JR - Tu tienda premium" />
            <Field label="Meta Descripción" name="metaDescription" placeholder="Descripción para buscadores..." rows={3} help="Ideal: entre 140 y 160 caracteres, claro y con palabras clave reales." />
            <Field label="Keywords (separadas por coma)" name="metaKeywords" placeholder="tienda, productos, premium" />
          </div>
        )}

        {/* Footer */}
        {activeTab === 'paginas' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-sm text-text-secondary">
              Estos textos aparecen en las páginas públicas del footer. Podés editarlos cuando cambien tus políticas de venta.
            </div>
            <div className="space-y-5">
              <Field label="Título de Términos y condiciones" name="termsTitle" placeholder="Términos y condiciones" />
              <Field label="Contenido de Términos y condiciones" name="termsContent" rows={8} placeholder="Condiciones de compra, precios, stock, reservas, responsabilidad..." />
              <Field label="Título de Política de privacidad" name="privacyTitle" placeholder="Política de privacidad" />
              <Field label="Contenido de Política de privacidad" name="privacyContent" rows={8} placeholder="Qué datos se usan, contacto por WhatsApp, finalidad, conservación..." />
              <Field label="Título de Preguntas frecuentes" name="faqTitle" placeholder="Preguntas frecuentes" />
              <Field label="Contenido de Preguntas frecuentes" name="faqContent" rows={8} placeholder="Escribí preguntas y respuestas. Una por párrafo o línea." />
              <Field label="Título de Sobre nosotros" name="aboutTitle" placeholder="Sobre nosotros" />
              <Field label="Contenido de Sobre nosotros" name="aboutContent" rows={7} placeholder="Historia, forma de trabajo, tipo de productos, atención..." />
              <Field label="Título de Contacto" name="contactTitle" placeholder="Contacto" />
              <Field label="Contenido de Contacto" name="contactContent" rows={6} placeholder="Horarios, zona, redes, forma de atención, retiro o coordinación..." />
            </div>
          </div>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
          <div className="space-y-5">
            <Field label="Texto del Footer" name="footerText" placeholder="© 2024 SHOWROOM JR. Todos los derechos reservados." rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Símbolo de Moneda" name="currencySymbol" placeholder="$" />
              <Field label="Código de Moneda" name="currencyCode" placeholder="ARS" />
            </div>
          </div>
        )}

        {/* IA */}
        {activeTab === 'ia' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Proveedor de IA</label>
                <select name="aiProvider" value={config?.aiProvider || 'GEMINI'} onChange={handleChange} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 focus:border-accent outline-none transition-colors text-sm">
                  <option value="GEMINI">Google Gemini</option>
                  <option value="OPENAI">OpenAI (ChatGPT)</option>
                  <option value="ANTHROPIC">Anthropic Claude</option>
                  <option value="GROQ">Groq</option>
                  <option value="MISTRAL">Mistral AI</option>
                  <option value="OPENROUTER">OpenRouter</option>
                </select>
              </div>
              <Field label="API Key de IA" name="aiApiKey" type="password" placeholder={config?.aiApiKeyConfigured ? 'Ya hay una API key guardada. Pegá otra solo si querés reemplazarla.' : 'Pegá la API key del proveedor elegido'} help={config?.aiApiKeyConfigured ? 'Por seguridad, la API key guardada no se muestra en pantalla.' : undefined} />
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-sm text-text-secondary">
              <p className="font-semibold text-accent">Qué genera la IA</p>
              <p className="mt-1">Descripción corta, descripción completa y mensaje personalizado de WhatsApp usando nombre, categoría, precio y stock del producto. El prompt evita inventar datos técnicos si no existen.</p>
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  )
}

