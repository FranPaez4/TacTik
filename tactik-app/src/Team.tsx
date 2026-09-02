import { useState, useEffect } from 'react';
import api from './api/axio'; // Tu instancia de Axios configurada
import AddPlayerForm from './components/AddPlayerForm';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  dorsalNumber: number;
  position: string;
  status: string;
  familyInviteCode: string;
  photoUrl?: string; 
}

export default function Team() {
  const [teamView, setTeamView] = useState<'list' | 'register' | 'edit'>('list');
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  
  // Ahora iniciamos el estado vacío, ya que los datos vendrán de Spring Boot
  const [players, setPlayers] = useState<Player[]>([]);

  // 1. CARGAR JUGADORES (GET)
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // NOTA: Cambia '/players' por la ruta exacta de tu controlador (ej. '/api/jugadores')
        const response = await api.get('/players/my-team'); 
        console.log("Datos recibidos del backend:", response.data);
        setPlayers(response.data);
      } catch (error) {
        console.error("Error al cargar la plantilla desde el servidor:", error);
      }
    };

    // Solo cargamos la lista si estamos en la vista 'list'
    if (teamView === 'list') {
      fetchPlayers();
    }
  }, [teamView]); // Se vuelve a ejecutar si volvemos a la vista de lista tras registrar uno nuevo

  // 2. ELIMINAR JUGADOR (DELETE)
  const handleDelete = async (id: number) => {
    if(window.confirm('¿Seguro que quieres dar de baja a este jugador?')) {
      try {
        // Petición DELETE al backend
        await api.delete(`/players/${id}`); 
        
        // Si el backend responde bien (200 OK), lo quitamos de la pantalla
        setPlayers(players.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error al dar de baja al jugador:", error);
        alert("Hubo un error al intentar eliminar el jugador.");
      }
    }
  };

  const handleEdit = (player: Player) => {
    setPlayerToEdit(player);
    setTeamView('edit');
  };

  // --------------------------------------------------------
  // RENDER: VISTA DE REGISTRO
  // --------------------------------------------------------
  if (teamView === 'register') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setTeamView('list')} 
          className="text-slate-500 hover:text-emerald-600 font-semibold mb-2 flex items-center gap-2 transition"
        >
          &larr; Volver a la plantilla
        </button>
        <AddPlayerForm 
          onCancel={() => setTeamView('list')}
          onSuccess={() => {
            setTeamView('list');
            // Como vuelve a 'list', el useEffect saltará solo y recargará los datos nuevos de la BD
          }} 
        />
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: VISTA DE EDICIÓN
  // --------------------------------------------------------
  if (teamView === 'edit') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => { setTeamView('list'); setPlayerToEdit(null); }} 
          className="text-slate-500 hover:text-emerald-600 font-semibold mb-2 flex items-center gap-2 transition"
        >
          &larr; Cancelar edición
        </button>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Editando a: <span className="text-emerald-600">{playerToEdit?.firstName} {playerToEdit?.lastName}</span>
          </h2>
          {/* Aquí irá tu componente de edición cuando lo adaptemos */}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: VISTA PRINCIPAL (LISTA)
  // --------------------------------------------------------
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <header>
          <h1 className="text-3xl font-bold text-slate-800">Plantilla</h1>
          <p className="text-slate-500 mt-1">Gestiona los jugadores, posiciones y dorsales de tu equipo.</p>
        </header>
        <button 
          onClick={() => setTeamView('register')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm"
        >
          <span className="text-xl leading-none">+</span> Registrar Jugador
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold w-20 text-center">Dorsal</th>
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Posición</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-center">Código</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-slate-50 transition group">
                  <td className="p-4 text-slate-400 font-bold text-center text-lg">{player.dorsalNumber}</td>
                  <td className="p-4">
                   <div className="flex items-center gap-3">
                    {/* Contenedor de la foto */}
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                      {player.photoUrl ? (
                      <img 
                       src={player.photoUrl} 
                       alt={`${player.firstName} ${player.lastName}`} 
                       className="h-full w-full object-cover"
                       />
                     ) : (
                     // Icono por defecto por si falla la imagen
                     <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                   </svg>
                   </div>
                   )}
                   </div>
    
                   {/* Nombre del jugador */}
                    <div>
                    <div className="font-bold text-slate-800 text-sm">
                      {player.firstName} {player.lastName}
                    </div>
                   </div>
                  </div>
                </td>
                  <td className="p-4 text-slate-600">{player.position}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          player.status?.toUpperCase() === 'LESIONADO' ? 'bg-red-100 text-red-700' :
                          player.status?.toUpperCase() === 'SANCIONADO' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                         }`}>
                            {player.status || 'DISPONIBLE'}
                   </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono text-sm font-bold tracking-wider">
                        {player.familyInviteCode}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Baja
                    </button>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No hay jugadores registrados en la plantilla. ¡Toca acudir al mercado!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}