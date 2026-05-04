import React from 'react'
import { Zap } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent via-amber-400 to-yellow-500 flex items-center justify-center shadow-xl shadow-accent/20 float-soft">
            <Zap className="w-7 h-7 text-black fill-black" />
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 rounded-2xl bg-accent/15 blur-xl -z-10 pulse-accent" />
        </div>
        {/* Text */}
        <div className="text-center">
          <p className="font-bold text-white text-sm">Cargando</p>
          <p className="mt-1 text-xs text-text-secondary">Preparando la información...</p>
        </div>
        {/* Progress bar */}
        <div className="w-40 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent to-amber-400 shimmer" />
        </div>
      </div>
    </div>
  )
}
