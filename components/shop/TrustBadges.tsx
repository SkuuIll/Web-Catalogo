import React from 'react'
import { Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react'

export function TrustBadges({ config }: { config: any }) {
  const badges = [
    { label: config?.shippingBadge || 'Envío seguro', icon: Truck, gradient: 'from-purple-500/15 to-purple-500/5', color: 'text-purple-400', border: 'border-purple-500/15' },
    { label: config?.warrantyBadge || 'Con garantía', icon: ShieldCheck, gradient: 'from-emerald-500/15 to-emerald-500/5', color: 'text-emerald-400', border: 'border-emerald-500/15' },
    { label: config?.returnsBadge || 'Devoluciones', icon: RefreshCcw, gradient: 'from-orange-500/15 to-orange-500/5', color: 'text-orange-400', border: 'border-orange-500/15' },
    { label: config?.supportBadge || 'Soporte directo', icon: Headphones, gradient: 'from-blue-500/15 to-blue-500/5', color: 'text-blue-400', border: 'border-blue-500/15' },
  ];

  return (
    <div className="w-full border-y border-white/[0.04] py-4">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-2.5 md:gap-3 min-w-max px-2">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 rounded-xl border ${badge.border} bg-gradient-to-r ${badge.gradient} px-4 py-2.5 group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <Icon className={`w-4 h-4 ${badge.color} transition-transform duration-300 group-hover:scale-110`} />
                <span className="text-[13px] font-semibold text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap">{badge.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
