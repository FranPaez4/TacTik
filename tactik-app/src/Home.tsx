import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Clipboard, X, User } from 'lucide-react';
import bgCesped from './assets/bg-cesped.jpg'; 
import logoTactik from './assets/logo.png';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center text-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgCesped})` }}
    >
      {/* Capa oscura superpuesta (más intensa para estilo cinematográfico) */}
      <div className="absolute inset-0 bg-slate-900/80"></div>

      {/* Contenido (relative para estar por encima de la capa oscura) */}
      <div className="relative z-10 px-6 max-w-4xl">
        
        {/* Logo */}
        <img src={logoTactik} 
             alt="TacTik Logo" 
             className="h-40 md:h-48 w-auto mx-auto mb-6 object-contain drop-shadow-2xl" 
        />
        
        {/* Eslogan principal */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          Lleva a tu equipo al <span className="text-emerald-500">siguiente nivel</span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light max-w-2xl mx-auto">
          La pizarra táctica digital definitiva para gestionar plantillas, planificar entrenamientos y dominar los partidos como un auténtico profesional.
        </p>
        
        {/* Botonera */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-600/50 text-lg"
          >
            Iniciar Sesión
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full transition-all border-2 border-slate-400 hover:border-white text-lg backdrop-blur-sm"
          >
            Registrarse
          </button>
        </div>
      </div>
      {/* VENTANA EMERGENTE (MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl text-left relative">
            
            {/* Botón de cerrar (X) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold"
            >
              <X className="w-6 h-6" />
              &times;
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Únete a TacTik</h3>
            <p className="text-slate-400 text-sm mb-6">Selecciona cómo deseas registrarte en la plataforma:</p>

            {/* Opciones del Modal */}
            <div className="flex flex-col gap-4">
              <Link 
                to="/register" 
                className="p-4 rounded-xl bg-slate-800 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 transition-all group"
              >
                <div className="font-bold text-white group-hover:text-emerald-400 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                   Fundar un Club
                </div>
                <div className="text-xs text-slate-400 mt-1">Crea tu entidad, define colores y gestiona la directiva.</div>
              </Link>

              <Link 
                to="/register-coach" 
                className="p-4 rounded-xl bg-slate-800 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 transition-all group"
              >
                <div className="font-bold text-white group-hover:text-emerald-400 flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-emerald-400" />
                   Tengo un Código de Entrenador
                </div>
                <div className="text-xs text-slate-400 mt-1">Únete a un club existente usando la llave del equipo.</div>
              </Link>

              <Link 
                to="/register-player" 
                className="p-4 rounded-xl bg-slate-800 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 transition-all group"
              >
                <div className="font-bold text-white group-hover:text-emerald-400 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                   Tengo un Código de Jugador
                </div>
                <div className="text-xs text-slate-400 mt-1">Accede como jugador o familiar con tu código asignado.</div>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300 underline"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
    
  );

}