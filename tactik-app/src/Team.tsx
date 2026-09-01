import EditClub from './components/EditClub';

export default function Team() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Mi Equipo</h1>
        <p className="text-slate-500 mt-1">Gestiona los datos de tu club y tu plantilla de jugadores.</p>
      </header>
      
      <EditClub />
      
      {/* Más adelante meteremos aquí la lista de jugadores */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Plantilla Actual</h3>
        <p className="text-slate-500 text-sm">El listado de jugadores aparecerá aquí...</p>
      </div>
    </div>
  );
}