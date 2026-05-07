'use client'

import React from 'react'
import { ToastProvider } from '@/components/ui/Toast'

export function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
