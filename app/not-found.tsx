import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center py-20 px-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-50" />
      
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-card/50 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-accent" />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Página no encontrada
        </h2>
        
        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-lg mx-auto">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida, eliminada o que el enlace sea incorrecto.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-primary font-bold py-4 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
            <span>Ir al Inicio</span>
          </Link>
          
          <Link 
            href="/catalogo" 
            className="group flex items-center justify-center gap-2 bg-secondary border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
