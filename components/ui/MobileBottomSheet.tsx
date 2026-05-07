'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showHandle?: boolean
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  showHandle = true,
}: MobileBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  const currentYRef = useRef<number>(0)
  const isDraggingRef = useRef(false)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    if (!isOpen) return

    const sheet = sheetRef.current
    if (!sheet) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startYRef.current = touch.clientY
      currentYRef.current = touch.clientY

      const rect = sheet.getBoundingClientRect()
      const touchY = touch.clientY - rect.top

      if (touchY < 40) {
        isDraggingRef.current = true
        sheet.style.transition = 'none'
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return
      const touch = e.touches[0]
      currentYRef.current = touch.clientY
      const delta = currentYRef.current - startYRef.current
      if (delta > 0) {
        sheet.style.transform = `translateY(${delta}px)`
      }
    }

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const delta = currentYRef.current - startYRef.current
      sheet.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'

      if (delta > 100) {
        sheet.style.transform = 'translateY(100%)'
        setTimeout(() => handleClose(), 300)
      } else {
        sheet.style.transform = 'translateY(0)'
      }
    }

    sheet.addEventListener('touchstart', handleTouchStart, { passive: true })
    sheet.addEventListener('touchmove', handleTouchMove, { passive: true })
    sheet.addEventListener('touchend', handleTouchEnd)

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart)
      sheet.removeEventListener('touchmove', handleTouchMove)
      sheet.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const content = (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease]"
        onClick={handleClose}
      />
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 glass-strong border-t border-white/[0.08] rounded-t-2xl pb-safe max-h-[85vh] overflow-y-auto',
          'animate-[slide-up_350ms_cubic-bezier(0.22,1,0.36,1)]',
          className
        )}
      >
        {showHandle && (
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
            {title && (
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-base"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            )}
          </div>
        )}
        {!showHandle && title && (
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-base"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        )}
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  )

  if (typeof window === 'undefined') return null
  return createPortal(content, document.body)
}
