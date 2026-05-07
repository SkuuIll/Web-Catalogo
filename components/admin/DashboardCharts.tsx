'use client'

import React, { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie,
} from 'recharts'
import { cn } from '@/lib/utils'
import { TrendingUp, MousePointerClick, PieChart as PieIcon } from 'lucide-react'

interface ChartData {
  days: { date: string; views: number; clicks: number }[]
  topViewed: { name: string; views: number; slug: string }[]
  byCategory: { name: string; count: number }[]
}

const COLORS = ['#C8952A', '#d9a740', '#e8c45a', '#a67c22', '#8b6914', '#f5d06b', '#b8932e', '#d4a833']

export function DashboardCharts() {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/analytics/stats')
      .then(r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'No autorizado' : 'Error de red')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card/60 border border-white/[0.06] rounded-xl p-5">
            <div className="h-[200px] shimmer rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-card/60 border border-white/[0.06] rounded-xl p-6 text-center">
        <p className="text-sm text-text-secondary">No se pudieron cargar las estadísticas.</p>
      </div>
    )
  }

  const { days, topViewed, byCategory } = data
  const hasViews = days.some(d => d.views > 0)
  const hasClicks = days.some(d => d.clicks > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card/60 border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-white">Vistas últimos 7 días</h3>
        </div>
        {hasViews ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#7a7a7a' }}
                tickFormatter={(v: any) => String(v).slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#7a7a7a' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: '#161616',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f5f5f5',
                }}
                labelFormatter={(l: any) => String(l).slice(5)}
              />
              <Line type="monotone" dataKey="views" stroke="#C8952A" strokeWidth={2} dot={{ fill: '#C8952A', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">
            Sin datos de vistas todavía.
          </div>
        )}
      </div>

      <div className="bg-card/60 border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MousePointerClick className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-white">Clicks WhatsApp</h3>
        </div>
        {hasClicks ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#7a7a7a' }}
                tickFormatter={(v: any) => String(v).slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#7a7a7a' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: '#161616',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f5f5f5',
                }}
                labelFormatter={(l: any) => String(l).slice(5)}
              />
              <Line type="monotone" dataKey="clicks" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">
            Sin clicks de WhatsApp todavía.
          </div>
        )}
      </div>

      {topViewed.length > 0 && (
        <div className="bg-card/60 border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-white">Más vistos</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topViewed} layout="vertical" margin={{ left: 2, right: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#7a7a7a' }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: '#161616',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f5f5f5',
                }}
              />
              <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                {topViewed.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {byCategory.length > 0 && (
        <div className="bg-card/60 border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-white">Por categoría</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={3}
                stroke="transparent"
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#161616',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f5f5f5',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
