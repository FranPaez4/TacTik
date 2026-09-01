import TacticalBoard from './components/TacticalBoard';

export default function Partidos() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 font-sans">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Partidos y Estrategia</h1>
        <p className="text-slate-500 mt-1">Diseña el plan de juego y configura el once inicial para el próximo rival.</p>
      </header>

      {/* Pizarra Táctica Integrada */}
      <TacticalBoard />
    </div>
  );
}