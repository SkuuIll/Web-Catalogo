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
      <article className="container mx-auto max-w-3xl fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-accent group">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>
        <div className="rounded-2xl border border-white/[0.06] bg-card/40 backdrop-blur-sm p-5 shadow-2xl shadow-black/15 sm:p-8 md:p-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h1 className="mb-7 text-3xl font-black tracking-tight text-gradient md:text-5xl">{title}</h1>
          <div className="space-y-4 text-base leading-relaxed text-text-secondary">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 20)}-${index}`} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
