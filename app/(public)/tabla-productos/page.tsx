import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceARS } from '@/lib/price-formatter';
import { ArrowLeft, ExternalLink, ListFilter } from 'lucide-react';

export const revalidate = 60;

export default async function TablaProductosPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { category: { name: 'asc' } }
  });

  return (
    <div className="min-h-screen bg-bg-primary py-10 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Vista rápida</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Lista de Productos</h1>
            <p className="text-text-secondary text-base md:text-lg">Todos nuestros artículos organizados por categoría.</p>
          </div>
          <div className="bg-secondary/50 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg inline-flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-accent" />
            <span className="text-white font-bold">{products.length}</span> <span className="text-text-secondary">productos en total</span>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="md:hidden divide-y divide-white/5">
            {products.map((product) => {
              const primaryImage = product.images?.[0]?.url || '/placeholder.png';
              return (
                <Link key={product.id} href={`/producto/${product.slug}`} className="flex gap-3 p-3 transition-colors hover:bg-white/[0.03]">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/5 bg-secondary">
                    <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-bold text-white">{product.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">{product.category.name}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="font-black text-accent">{formatPriceARS(Number(product.price))}</span>
                      <span className={product.stock > 0 ? 'text-xs font-bold text-green-400' : 'text-xs font-bold text-red-400'}>
                        {product.stock > 0 ? `${product.stock} stock` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/80 border-b border-white/10 text-text-secondary text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Precio</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => {
                  const primaryImage = product.images?.[0]?.url || '/placeholder.png';
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-secondary/50 relative overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-accent/30 transition-colors">
                            <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{product.name}</p>
                            <p className="text-xs text-text-secondary line-clamp-1">{product.shortDescription || 'Sin descripción'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-bold">{formatPriceARS(Number(product.price))}</span>
                      </td>
                      <td className="p-4">
                        {product.stock > 0 ? (
                          <span className="text-green-400 text-sm font-medium">{product.stock} en stock</span>
                        ) : (
                          <span className="text-red-400 text-sm font-medium">Agotado</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/producto/${product.slug}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-accent hover:text-bg-primary text-text-secondary transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">No hay productos disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
