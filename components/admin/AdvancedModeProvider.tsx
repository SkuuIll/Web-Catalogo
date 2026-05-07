'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'admin-advanced-mode'

interface AdvancedModeContextType {
  isAdvanced: boolean
  toggleAdvanced: () => void
  enableAdvanced: () => void
  disableAdvanced: () => void
}

const AdvancedModeContext = createContext<AdvancedModeContextType>({
  isAdvanced: false,
  toggleAdvanced: () => {},
  enableAdvanced: () => {},
  disableAdvanced: () => {},
})

export function AdvancedModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setIsAdvanced(stored === 'true')
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, String(isAdvanced))
    }
  }, [isAdvanced, mounted])

  const toggleAdvanced = useCallback(() => {
    setIsAdvanced(prev => !prev)
  }, [])

  const enableAdvanced = useCallback(() => {
    setIsAdvanced(true)
  }, [])

  const disableAdvanced = useCallback(() => {
    setIsAdvanced(false)
  }, [])

  return (
    <AdvancedModeContext.Provider value={{ isAdvanced, toggleAdvanced, enableAdvanced, disableAdvanced }}>
      {children}
    </AdvancedModeContext.Provider>
  )
}

export function useAdvancedMode() {
  return useContext(AdvancedModeContext)
}
