'use client';
import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Trash2, Plus, Minus, ShoppingBag, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPriceARS } from '@/lib/price-formatter';

interface CartDrawerProps {
  whatsappNumber?: string | null;
}

export function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    let message = 'Hola! Me interesa la siguiente lista de productos:\n\n';
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} (${formatPriceARS(item.price)})\n`;
    });
    message += `\nTotal estimado: ${formatPriceARS(total)}\n\n¿Tienen stock disponible?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-bg-primary border-l border-white/10 z-[101] shadow-2xl shadow-black flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.06] bg-card/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Tu Lista</h2>
              <p className="text-xs text-text-secondary">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center fade-up">
              <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-text-secondary/30" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tu lista está vacía</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-[250px]">Agregá productos a tu lista para consultar por todos juntos.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-secondary text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors"
              >
                Seguir explorando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-card/40 border border-white/[0.04] relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary relative shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0 py-1 flex flex-col">
                  <Link href={`/producto/${item.slug}`} onClick={() => setIsOpen(false)} className="text-sm font-bold text-white line-clamp-1 hover:text-accent transition-colors">
                    {item.name}
                  </Link>
                  <span className="text-sm font-black text-accent mt-1">{formatPriceARS(item.price)}</span>
                  
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-secondary rounded-lg border border-white/[0.06] p-0.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 rounded-md transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 rounded-md transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-text-secondary/50 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-card/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary font-medium">Total estimado</span>
              <span className="text-2xl font-black text-white">{formatPriceARS(total)}</span>
            </div>
            
            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
            >
              <Send className="w-5 h-5" />
              Consultar por WhatsApp
            </button>
            <button 
              onClick={clearCart}
              className="w-full mt-3 py-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </>
  );
}
