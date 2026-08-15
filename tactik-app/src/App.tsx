import React from 'react';

function App() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* Menú Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wider text-emerald-400">
          ⚽ TacTik
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="block py-2.5 px-4 bg-emerald-600 rounded-lg font-semibold">📊 Panel Principal</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-slate-800 rounded-lg transition">🛡️ Mi Equipo</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-slate-800 rounded-lg transition">📅 Partidos</a>
          <a href="#" className="block py-2.5 px-4 hover:bg-slate-800 rounded-lg transition">🏃‍♂️ Entrenamientos</a>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">¡Hola, Míster!</h1>
          <p className="text-slate-500 mt-1">Tu pizarra táctica está lista para la jornada.</p>
        </header>

        {/* Grid de Tarjetas (Widgets) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta Próximo Partido (Ocupa 2 columnas) */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wide">Próximo Encuentro</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-3">TacTik vs Antequera</h2>
              <p className="text-slate-500">Sábado, 24 de Agosto • 18:00h</p>
            </div>
            <button className="mt-6 self-start bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-md shadow-emerald-200">
              Hacer Convocatoria
            </button>
          </div>

          {/* Tarjeta Plantilla */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Plantilla</h3>
              <p className="text-4xl font-black text-slate-900 mt-2">24 <span className="text-sm font-normal text-slate-500">jugadores</span></p>
            </div>
            <button className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition">
              Gestionar Equipo
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}

export default App;