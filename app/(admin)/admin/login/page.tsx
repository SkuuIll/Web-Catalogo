'use client'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Zap, Loader2, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { redirect: false, email, password })
    if (result?.error) {
      setError('Credenciales inválidas')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md fade-up">
        <div className="bg-card/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/30">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent via-amber-400 to-yellow-500 shadow-xl shadow-accent/20 mb-5">
              <Zap className="w-7 h-7 text-black fill-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gradient mb-1">SHOWROOM JR</h1>
            <p className="text-text-secondary text-sm">Panel de Administración</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3.5 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-300 placeholder:text-text-secondary"
                  placeholder="admin@showroom.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-300 placeholder:text-text-secondary"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-amber-500 hover:from-accent-hover hover:to-amber-400 text-black font-black py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,149,42,0.25)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-text-secondary mt-6">
          © {new Date().getFullYear()} SHOWROOM JR · Panel Admin
        </p>
      </div>
    </div>
  )
}
