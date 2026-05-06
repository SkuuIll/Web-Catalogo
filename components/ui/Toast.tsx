'use client'
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => remove(id), 4000)
  }, [remove])

  const value: ToastContextValue = {
    toast: add,
    success: (msg) => add(msg, 'success'),
    error: (msg) => add(msg, 'error'),
    warning: (msg) => add(msg, 'warning'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed left-4 right-4 top-4 z-[100] flex flex-col gap-2 pointer-events-none sm:left-auto sm:max-w-sm" aria-live="polite">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />,
  }
  const borders = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    warning: 'border-yellow-500/30',
  }

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 bg-card border ${borders[toast.type]} rounded-lg px-4 py-3 shadow-2xl shadow-black/50 w-full sm:min-w-[260px] sm:max-w-sm animate-in slide-in-from-right-2 duration-200`}
    >
      {icons[toast.type]}
      <p className="text-sm text-white font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-text-secondary hover:text-white transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
