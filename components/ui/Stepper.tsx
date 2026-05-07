'use client'

import React, { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  optional?: boolean
}

interface StepperProps {
  steps: Step[]
  onComplete?: () => void
  className?: string
  initialStep?: number
}

export function Stepper({ steps, onComplete, className, initialStep = 0 }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const goNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }, [isLastStep, onComplete])

  const goPrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }, [isFirstStep])

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-1 mb-6 overflow-x-auto no-scrollbar px-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  className={cn(
                    'h-[1px] flex-1 min-w-[16px] transition-all duration-300',
                    isCompleted || isActive ? 'bg-accent' : 'bg-white/10'
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (idx <= currentStep) setCurrentStep(idx)
                }}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap text-xs font-medium',
                  isActive && 'bg-accent/15 text-accent',
                  isCompleted && 'text-accent/70',
                  !isActive && !isCompleted && 'text-text-secondary'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 flex-shrink-0',
                    isActive && 'bg-accent text-black font-bold',
                    isCompleted && 'bg-accent/40 text-white',
                    !isActive && !isCompleted && 'bg-white/10 text-text-secondary'
                  )}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex-1 min-h-0">
        {steps[currentStep].content}
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirstStep}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
            isFirstStep
              ? 'text-white/20 cursor-not-allowed'
              : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <span className="text-xs text-text-secondary">
          {currentStep + 1} / {steps.length}
        </span>

        <button
          type="button"
          onClick={goNext}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
            isLastStep
              ? 'bg-accent text-black hover:bg-accent-hover'
              : 'bg-accent/10 text-accent hover:bg-accent/20'
          )}
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4" />
              Completar
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
