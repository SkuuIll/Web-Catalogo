import React from 'react'
import { CreditCard, MessageCircle, PackageCheck, ShieldCheck } from 'lucide-react'

export function StoreAssurance() {
  const items = [
    { label: 'Consulta directa', text: 'por WhatsApp', icon: MessageCircle, color: 'text-green-400' },
    { label: 'Stock visible', text: 'actualizado', icon: PackageCheck, color: 'text-blue-400' },
    { label: 'Compra segura', text: 'coordinada', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Precios claros', text: 'en pesos', icon: CreditCard, color: 'text-orange-400' },
  ]

  return (
    <section className="border-y border-white/[0.04] py-4">
      <div className="container mx-auto px-4">
        <div className="grid overflow-hidden rounded-xl border border-white/[0.06] bg-card/40 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 sm:[&:nth-child(3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 transition-colors duration-300 hover:bg-white/[0.02]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/[0.06]">
                <Icon className={`h-4 w-4 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{item.label}</p>
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
