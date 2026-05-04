'use client'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-accent mb-2">SHOWROOM JR</h1>
          <p className="text-text-secondary">Panel de Administración</p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-secondary border border-border rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder="admin@showroom.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-secondary border border-border rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-3 rounded transition-colors disabled:opacity-50 mt-6">{loading ? 'Iniciando...' : 'Ingresar'}</button>
        </form>
      </div>
    </div>
  )
}
