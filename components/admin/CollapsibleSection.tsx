'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card/60 hover:bg-card/80 transition-smooth"
      >
        <span className="text-sm font-bold text-white">{title}</span>
        <ChevronDown className={cn('w-4 h-4 text-text-secondary transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 py-4 border-t border-white/[0.06] space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}
