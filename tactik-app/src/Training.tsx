export default function Training() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Entrenamientos</h1>
        <p className="text-slate-500 mt-1">Planifica tus sesiones y diseña ejercicios para el equipo.</p>
      </header>

      <div className="bg-emerald-50 border border-emerald-200 p-10 rounded-xl text-center flex flex-col items-center justify-center mt-6">
        <span className="text-5xl mb-4 block">🏃‍♂️</span>
        <h3 className="text-2xl font-bold text-emerald-800">Módulo en construcción</h3>
        <p className="text-emerald-700 mt-2 max-w-md mx-auto">
          Pronto podrás crear plantillas de entrenamiento, planificar los microciclos y guardar tus ejercicios tácticos favoritos.
        </p>
      </div>
    </div>
  );
}