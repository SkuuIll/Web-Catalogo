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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-50" />
      
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-card/50 backdrop-blur-md rounded-lg border border-red-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
          <XOctagon className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-4 tracking-tighter">
          500
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Error Interno del Servidor
        </h2>
        
        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-lg mx-auto">
          Algo salió mal en nuestro extremo. Estamos trabajando para solucionarlo lo antes posible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
          <button 
            onClick={() => reset()}
            className="group flex items-center justify-center gap-2 bg-white text-primary font-bold py-4 px-8 rounded-lg hover:bg-gray-200 transition-all duration-300 w-full sm:w-auto"
          >
            <RefreshCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
            <span>Intentar de nuevo</span>
          </button>
          
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 bg-secondary border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
