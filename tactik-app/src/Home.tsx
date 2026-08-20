import { Link } from 'react-router-dom';
import bgCesped from './assets/bg-cesped.jpg'; 
import logoTactik from './assets/logo.png';

export default function Home() {
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
          
          <Link 
            to="/register" 
            className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full transition-all border-2 border-slate-400 hover:border-white text-lg backdrop-blur-sm"
          >
            Registrarse
          </Link>
        </div>

      </div>
    </div>
  );
}