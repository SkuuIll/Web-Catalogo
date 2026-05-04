import React from 'react'
import { CreditCard, MessageCircle, PackageCheck, ShieldCheck } from 'lucide-react'

export function StoreAssurance() {
  const items = [
    { label: 'Consulta directa', text: 'por WhatsApp', icon: MessageCircle },
    { label: 'Stock visible', text: 'actualizado', icon: PackageCheck },
    { label: 'Compra segura', text: 'coordinada', icon: ShieldCheck },
    { label: 'Precios claros', text: 'en pesos', icon: CreditCard },
  ]

  return (
    <section className="border-y border-white/5 bg-black/25 py-3 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="grid overflow-hidden rounded-lg border border-white/10 bg-card/45 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0 sm:[&:nth-child(3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{item.label}</p>
                <p className="truncate text-xs font-medium text-text-secondary">{item.text}</p>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </section>
  )
}
