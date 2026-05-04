import React from 'react'
import { Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react'

export function TrustBadges({ config }: { config: any }) {
  const badges = [
    { label: config?.shippingBadge || 'Envío', icon: Truck, color: 'text-purple-400' },
    { label: config?.warrantyBadge || 'Garantía', icon: ShieldCheck, color: 'text-green-400' },
    { label: config?.returnsBadge || 'Devoluciones', icon: RefreshCcw, color: 'text-orange-400' },
    { label: config?.supportBadge || 'Soporte', icon: Headphones, color: 'text-blue-400' },
  ];
  return (
    <div className="w-full bg-bg-primary/70 border-y border-white/5 py-4 backdrop-blur">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-3 md:gap-4 min-w-max px-2">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="catalog-surface flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 group transition-all hover:-translate-y-0.5 hover:border-white/20">
                <Icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{badge.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
