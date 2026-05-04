import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center py-20 px-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center fade-up">
        <div className="w-20 h-20 bg-card/40 backdrop-blur-md rounded-2xl border border-white/[0.06] flex items-center justify-center mb-8 shadow-2xl">
          <AlertCircle className="w-10 h-10 text-accent" />
        </div>
        
        <h1 className="text-[8rem] md:text-[10rem] font-black text-gradient leading-none mb-2 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-base md:text-lg text-text-secondary mb-10 max-w-md mx-auto leading-relaxed">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida o eliminada.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3.5 px-7 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,149,42,0.25)]"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Ir al Inicio</span>
          </Link>
          
          <Link 
            href="/catalogo" 
            className="group flex items-center justify-center gap-2 bg-card border border-white/[0.06] hover:border-accent/30 text-white font-bold py-3.5 px-7 rounded-xl transition-all duration-300 hover:bg-accent/[0.05]"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
