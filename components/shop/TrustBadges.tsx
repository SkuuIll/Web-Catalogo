import React from 'react'
export function TrustBadges({ config }: { config: any }) {
  const badges = [
    { label: config?.shippingBadge || 'Envíos a todo el país', icon: '🚚' },
    { label: config?.warrantyBadge || 'Garantía asegurada', icon: '🛡️' },
    { label: config?.returnsBadge || 'Devoluciones gratis', icon: '↩️' },
    { label: config?.supportBadge || 'Soporte 24/7', icon: '💬' },
  ];
  return (
    <div className="w-full bg-secondary border-y border-border py-4">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-max gap-8 md:gap-4 px-2">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-sm font-medium text-text-primary uppercase tracking-wider">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
