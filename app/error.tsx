'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, XOctagon } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center py-20 px-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center fade-up">
        <div className="w-20 h-20 bg-card/40 backdrop-blur-md rounded-2xl border border-red-500/15 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
          <XOctagon className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-[8rem] md:text-[10rem] font-black text-gradient leading-none mb-2 tracking-tighter">
          500
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Error Interno del Servidor
        </h2>
        
        <p className="text-base md:text-lg text-text-secondary mb-10 max-w-md mx-auto leading-relaxed">
          Algo salió mal en nuestro extremo. Estamos trabajando para solucionarlo lo antes posible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
          <button 
            onClick={() => reset()}
            className="group flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 px-7 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
            <span>Intentar de nuevo</span>
          </button>
          
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 bg-card border border-white/[0.06] hover:border-white/15 text-white font-bold py-3.5 px-7 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
