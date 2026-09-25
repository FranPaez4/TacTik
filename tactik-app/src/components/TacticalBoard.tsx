import { useState } from 'react';
import pizarraCampo from '../assets/PizarraCampo.jpg';

interface PlayerFromTeam {
  id: number;
  firstName: string;
  lastName: string;
  dorsalNumber?: number;
  position?: string;
}

interface BoardPosition {
  id: number;
  label: string;
  x: number;
  y: number;
  assignedPlayer?: PlayerFromTeam | null;
}

interface TacticalBoardProps {
  selectedPlayer: PlayerFromTeam | null;
  onPlayerAssigned: () => void;
  teamPlayers: PlayerFromTeam[];
  onMatchEvent: (type: 'GOL' | 'TARJETA_AMARILLA' | 'TARJETA_ROJA' | 'SUSTITUCION', playerIn: PlayerFromTeam, playerOut?: PlayerFromTeam) => void;
}

// Definimos las posiciones base según la formación
const formations: Record<string, { name: string; role: string; x: number; y: number }[]> = {
  '4-3-3': [
    { name: 'Portero', role: 'POR', x: 50, y: 88 },
    { name: 'Lateral Dch', role: 'LD', x: 80, y: 70 },
    { name: 'Central Dch', role: 'DFC', x: 60, y: 75 },
    { name: 'Central Izq', role: 'DFC', x: 40, y: 75 },
    { name: 'Lateral Izq', role: 'LI', x: 20, y: 70 },
    { name: 'Pivote', role: 'MC', x: 50, y: 55 },
    { name: 'Interior Dch', role: 'MC', x: 68, y: 45 }, 
  ]
};

// Formaciones limpias en coordenadas porcentuales (x: ancho %, y: alto %)
const tacticalFormations: Record<string, { name: string; pos: { id: number; label: string; x: number; y: number }[] }> = {
  '4-4-2': {
    name: '4-4-2 Clásico',
    pos: [
      { id: 1, label: 'POR', x: 50, y: 88 },
      { id: 2, label: 'LD', x: 85, y: 70 },
      { id: 3, label: 'DFC', x: 62, y: 75 },
      { id: 4, label: 'DFC', x: 38, y: 75 },
      { id: 5, label: 'LI', x: 15, y: 70 },
      { id: 6, label: 'MD', x: 85, y: 45 },
      { id: 7, label: 'MC', x: 60, y: 50 },
      { id: 8, label: 'MC', x: 40, y: 50 },
      { id: 9, label: 'MI', x: 15, y: 45 },
      { id: 10, label: 'DC', x: 60, y: 20 },
      { id: 11, label: 'DC', x: 40, y: 20 }
    ]
  },
  '4-3-3': {
    name: '4-3-3 Ofensivo',
    pos: [
      { id: 1, label: 'POR', x: 50, y: 88 },
      { id: 2, label: 'LD', x: 85, y: 70 },
      { id: 3, label: 'DFC', x: 62, y: 75 },
      { id: 4, label: 'DFC', x: 38, y: 75 },
      { id: 5, label: 'LI', x: 15, y: 70 },
      { id: 6, label: 'MC', x: 50, y: 60 },
      { id: 7, label: 'MC', x: 68, y: 45 },
      { id: 8, label: 'MC', x: 32, y: 45 },
      { id: 9, label: 'ED', x: 85, y: 22 },
      { id: 10, label: 'DC', x: 50, y: 18 },
      { id: 11, label: 'EI', x: 15, y: 22 }
    ]
  }
};

export default function TacticalBoard({ selectedPlayer, onPlayerAssigned, teamPlayers, onMatchEvent }: TacticalBoardProps) {
  const [selectedFormation, setSelectedFormation] = useState<'4-4-2' | '4-3-3'>('4-4-2');
  const [players, setPlayers] = useState<BoardPosition[]>(tacticalFormations['4-4-2'].pos);
  const [activePlayer, setActivePlayer] = useState<number | null>(null);
  const [activeMenuPositionId, setActiveMenuPositionId] = useState<number | null>(null);
  const [subMenuView, setSubMenuView] = useState<'actions' | 'substitution' | null>(null);

  const handleFormationChange = (formation: '4-4-2' | '4-3-3') => {
    setSelectedFormation(formation);
    setPlayers(tacticalFormations[formation].pos);
  };

  // Permite mover los jugadores haciendo clic en el campo
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activePlayer === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPlayers(players.map(p => p.id === activePlayer ? { ...p, x, y } : p));
    setActivePlayer(null);
  };

  const handlePositionClick = (positionId: number, assignedPlayer: PlayerFromTeam | null | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPlayer) {
      // Si tenemos un jugador seleccionado del banquillo, lo colocamos aquí
      setPlayers(players.map(p => p.id === positionId ? { ...p, assignedPlayer: selectedPlayer } : p));
      onPlayerAssigned();
      setActiveMenuPositionId(null);
    } else if (assignedPlayer) {
      // Si ya hay un jugador en el campo, abrimos/cerramos su menú de acciones
      if (activeMenuPositionId === positionId) {
        setActiveMenuPositionId(null);
        setSubMenuView(null);
      } else {
        setActiveMenuPositionId(positionId);
        setSubMenuView('actions');
      }
    } else {
      setActivePlayer(positionId);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Pizarra Táctica</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => handleFormationChange('4-4-2')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${selectedFormation === '4-4-2' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            4-4-2
          </button>
          <button 
            onClick={() => handleFormationChange('4-3-3')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${selectedFormation === '4-3-3' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            4-3-3
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        {selectedPlayer 
          ? `🎯 Haz clic en una posición del campo para colocar a ${selectedPlayer.firstName}.` 
          : activePlayer !== null 
            ? '📍 Haz clic en el césped para mover al jugador seleccionado.' 
            : '💡 Selecciona un jugador en la plantilla y haz clic en el campo para alinearlo.'}
      </p>

      {/* Campo de Fútbol */}
      <div 
        onClick={handleBoardClick}
        className="relative w-full h-[550px] rounded-xl shadow-inner border-4 border-emerald-800 cursor-crosshair bg-cover bg-center"
        style={{ backgroundImage: `url(${pizarraCampo})` }}
      >
        {/* Líneas del campo (Marcas tácticas con Tailwind) */}
        <div className="absolute inset-4 border-2 border-white/40 pointer-events-none rounded-sm">
          {/* Línea central */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2"></div>
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          {/* Área superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-white/40"></div>
          {/* Área inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-white/40"></div>
        </div>

        {/* Fichas de los Jugadores */}
        {players.map(player => (
          <div
            key={player.id}
            onClick={(e) => handlePositionClick(player.id, player.assignedPlayer, e)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-xs shadow-lg transition-transform cursor-pointer ${
              activePlayer === player.id 
                ? 'bg-amber-400 text-slate-900 scale-125 ring-4 ring-white animate-pulse' 
                : player.assignedPlayer
                  ? 'bg-emerald-700 text-white border-2 border-white hover:scale-110'
                  : 'bg-emerald-600 text-white border-2 border-white/80 hover:scale-110'
            }`}
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <span className="bg-white/20 px-1 rounded text-[10px]">{player.label}</span>
            <span>{player.assignedPlayer?.firstName || ''}</span>

            {/* MENÚ FLOTANTE AL PULSAR AL JUGADOR EN EL CAMPO */}
            {activeMenuPositionId === player.id && player.assignedPlayer && (
              <div className={`absolute left-1/2 -translate-x-1/2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-2 z-50 ${
                               player.y > 60 ? 'bottom-full mb-2' : 'top-full mt-2'
                              }`}>
                
                {subMenuView === 'actions' && (
                  <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                    <div className="text-xs font-bold text-slate-400 px-2 py-1 border-b border-slate-100">
                      Acción: {player.assignedPlayer.firstName}
                    </div>
                    <button 
                      onClick={() => { onMatchEvent('GOL', player.assignedPlayer!); setActiveMenuPositionId(null); }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-2"
                    >
                      <span>⚽</span> Registrar Gol
                    </button>
                    <button 
                      onClick={() => setSubMenuView('substitution')}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center gap-2"
                    >
                      <span>🔄</span> Hacer Cambio
                    </button>
                    <button 
                      onClick={() => { onMatchEvent('TARJETA_AMARILLA', player.assignedPlayer!); setActiveMenuPositionId(null); }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-50 rounded-lg flex items-center gap-2"
                    >
                      <span>🟨</span> Tarjeta Amarilla
                    </button>
                    <button 
                      onClick={() => { onMatchEvent('TARJETA_ROJA', player.assignedPlayer!); setActiveMenuPositionId(null); }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <span>🟥</span> Tarjeta Roja
                    </button>
                  </div>
                )}

                {subMenuView === 'substitution' && (
                  <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                    <div className="text-xs font-bold text-blue-600 px-2 py-1 border-b border-slate-100 flex justify-between items-center">
                      <span>Entra por {player.assignedPlayer.firstName}</span>
                      <button onClick={() => setSubMenuView('actions')} className="text-slate-400 hover:text-slate-600">&larr; Volver</button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {teamPlayers
                        .filter(p => p.id !== player.assignedPlayer?.id)
                        .map(sub => (
                          <button 
                            key={sub.id}
                            onClick={() => {
                              // CAMBIO REAL EN EL CAMPO: Reemplazamos el jugador en esta posición
                              setPlayers(players.map(p => p.id === player.id ? { ...p, assignedPlayer: sub } : p));
                              onMatchEvent('SUSTITUCION', sub, player.assignedPlayer!);
                              setActiveMenuPositionId(null);
                              setSubMenuView(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded flex justify-between items-center"
                          >
                            <span>#{sub.dorsalNumber || '-'} {sub.firstName}</span>
                            <span className="text-emerald-600 font-bold">Meter</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}