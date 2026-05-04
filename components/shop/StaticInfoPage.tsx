import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function StaticInfoPage({
  eyebrow,
  title,
  content,
  fallback,
}: {
  eyebrow: string
  title: string
  content?: string | null
  fallback: string[]
}) {
  const paragraphs = (content?.trim() ? content.split(/\n{1,}/) : fallback).map((item) => item.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10 md:py-20">
      <article className="container mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-accent">
          <ArrowLeft className="h-5 w-5" />
          Volver al inicio
        </Link>
        <div className="rounded-lg border border-white/10 bg-card/60 p-5 shadow-2xl shadow-black/20 sm:p-8 md:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
          <div className="space-y-4 text-base leading-relaxed text-text-secondary">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
