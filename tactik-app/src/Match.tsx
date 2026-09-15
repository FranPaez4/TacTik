import { useState, useEffect } from 'react';
import api from './api/axio';
import TacticalBoard from './components/TacticalBoard';
import CreateMatchForm from './components/CreateMatchForm';

interface Match {
  id: number;
  dateTime: string;
  localisation: string;
  opponent: string;
  durationMinutes: number;
  isHome: boolean;
  matchType: string;
  status?: string;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  dorsalNumber?: number;
  position?: string;
}

interface MatchEvent {
  id: number;
  minute: number; 
  type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB';
  message: string;
}

export default function Partidos() {
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Estados del partido en vivo
  const [matchTime, setMatchTime] = useState(0);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'playing' | 'paused' | 'finished'>('playing');
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [myTeamScore, setMyTeamScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  // Estados de la plantilla
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [activeMenuPlayerId, setActiveMenuPlayerId] = useState<number | null>(null);
  const [subMenuView, setSubMenuView] = useState<'actions' | 'substitution' | null>(null);
  const [selectedPlayerToPosition, setSelectedPlayerToPosition] = useState<Player | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches/my-matches');
        setMatches(response.data);
      } catch (error) {
        console.error("Error al cargar los partidos:", error);
      }
    };
    if (view === 'list') fetchMatches();
  }, [view]);

  useEffect(() => {
    if (view === 'details' && selectedMatch) {
      const fetchTeamPlayers = async () => {
        try {
          const response = await api.get('/players/my-team');
          setTeamPlayers(response.data);
        } catch (error) {
          console.error("Error al cargar la plantilla:", error);
        }
      };
      fetchTeamPlayers();
    }
  }, [view, selectedMatch]);

  // Motor del cronómetro
  useEffect(() => {
    let interval: any;
    if (isMatchActive) {
      interval = setInterval(() => {
        setMatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMatchActive]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Función para registrar eventos desde la Pizarra
  const handleMatchEvent = (type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB', mainPlayer: Player, subPlayer?: Player) => {
    const currentMinute = Math.floor(matchTime / 60); // Coge el minuto real del cronómetro
    
    let message = '';
    if (type === 'GOAL'){
      message = `¡Gol de ${mainPlayer.firstName}!`;
      setMyTeamScore(prev => prev + 1); // <-- ¡AQUÍ SUMAMOS TU GOL!
    } 
    if (type === 'YELLOW') message = `Tarjeta amarilla para ${mainPlayer.firstName}`;
    if (type === 'RED') message = `Tarjeta roja para ${mainPlayer.firstName}`;
    if (type === 'SUB') message = `Entra ${mainPlayer.firstName} por ${subPlayer?.firstName}`;

    setMatchEvents(prev => [{ id: Date.now(), minute: currentMinute, type, message }, ...prev]);
  };

  // --------------------------------------------------------
  // VISTA: CREAR PARTIDO
  // --------------------------------------------------------
  if (view === 'create') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-4">
        <button onClick={() => setView('list')} className="text-slate-500 font-semibold flex items-center gap-2 transition hover:text-emerald-600">
          &larr; Volver al calendario
        </button>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-100 pb-4 text-slate-800">Programar Nuevo Partido</h2>
          <CreateMatchForm 
            onCancel={() => setView('list')}
            onSuccess={() => setView('list')} 
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VISTA: DETALLES Y PIZARRA TÁCTICA
  // --------------------------------------------------------
  if (view === 'details' && selectedMatch) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <button onClick={() => setView('list')} className="text-slate-500 font-semibold flex items-center gap-2 transition hover:text-emerald-600">
          &larr; Volver al calendario
        </button>
        
        {/* Cabecera del partido seleccionado */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-3 py-1 rounded-lg font-bold text-xs tracking-wide ${
                selectedMatch.isHome ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {selectedMatch.isHome ? 'LOCAL' : 'VISITANTE'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 my-2">
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                {/* Nombre Equipo Local */}
                <span className={selectedMatch.isHome ? '' : 'text-slate-500'}>
                  {selectedMatch.isHome ? 'UD Alameda' : selectedMatch.opponent}
                </span>
                
                {/* Caja del Marcador */}
                <div className="flex items-center bg-slate-100 rounded-lg px-4 py-1 border border-slate-200">
                  <span className="text-3xl text-emerald-600 font-black w-8 text-center">
                    {selectedMatch.isHome ? myTeamScore : opponentScore}
                  </span>
                  <span className="text-slate-400 mx-2">-</span>
                  <span className="text-3xl text-emerald-600 font-black w-8 text-center">
                    {selectedMatch.isHome ? opponentScore : myTeamScore}
                  </span>
                </div>

                {/* Nombre Equipo Visitante */}
                <span className={!selectedMatch.isHome ? '' : 'text-slate-500'}>
                  {selectedMatch.isHome ? selectedMatch.opponent : 'UD Alameda'}
                </span>
              </div>
              
              {/* Botón rápido para registrar gol del rival */}
              {matchStatus !== 'finished' && (
                <button 
                  onClick={() => {
                    setOpponentScore(prev => prev + 1);
                    setMatchEvents(prev => [{ 
                      id: Date.now(), 
                      minute: Math.floor(matchTime / 60), 
                      type: 'GOAL', 
                      message: `Gol de ${selectedMatch.opponent}` 
                    }, ...prev]);
                  }}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1.5 rounded hover:bg-red-100 transition shadow-sm font-semibold flex items-center gap-1"
                >
                  ⚽ + Gol Rival
                </button>
              )}
            </div>
            <p className="text-slate-500 mt-1 font-medium">
              {new Date(selectedMatch.dateTime).toLocaleString()} | {selectedMatch.localisation}
            </p>
          </div>
          
          {/* Panel del Cronómetro y Botones Superiores */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl shadow-inner text-white w-full lg:w-auto justify-between">
            <div className="text-4xl font-mono font-bold tracking-wider text-emerald-400">
              {formatTime(matchTime)}
            </div>
            <div className="flex gap-2">
              {matchStatus !== 'finished' && (
                <button 
                  onClick={() => {
                    setIsMatchActive(!isMatchActive);
                    setMatchStatus(isMatchActive ? 'paused' : 'playing');
                  }}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition ${
                    isMatchActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {isMatchActive ? '⏸️ Pausa' : '▶️ Iniciar'}
                </button>
              )}
              <button 
                onClick={() => {
                  if(window.confirm('¿Estás seguro de finalizar el partido?')) {
                    setIsMatchActive(false);
                    setMatchStatus('finished');
                  }
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition"
              >
                ⏹️ Finalizar
              </button>
            </div>
          </div>
        </header>

        {/* Diseño en dos columnas para pantallas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Pizarra (Más ancha) */}
          <div className="lg:col-span-8">
            <TacticalBoard 
              selectedPlayer={selectedPlayerToPosition} 
              onPlayerAssigned={() => setSelectedPlayerToPosition(null)}
              teamPlayers={teamPlayers}
              onMatchEvent={handleMatchEvent}
            />
          </div>

          {/* Columna Derecha: Plantilla y Eventos */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. CAJA DE PLANTILLA */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800">Plantilla</h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                  {teamPlayers.length} Jugadores
                </span>
              </div>
              
              {selectedPlayerToPosition && (
                <div className="mb-3 p-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex justify-between items-center shadow-sm">
                  <span>🎯 #{selectedPlayerToPosition.dorsalNumber || '-'} {selectedPlayerToPosition.firstName}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedPlayerToPosition(null); }}
                    className="text-emerald-200 hover:text-white font-bold px-1.5 py-0.5 rounded"
                  >✕</button>
                </div>
              )}

              <div className="space-y-2 overflow-y-auto pr-2 flex-1 relative">
                {teamPlayers.length > 0 ? (
                  teamPlayers.map((player) => (
                    <div key={player.id} className="relative mb-2">
                      <div 
                        onClick={() => {
                          setSelectedPlayerToPosition(player);
                          if (activeMenuPlayerId === player.id) {
                            setActiveMenuPlayerId(null);
                            setSubMenuView(null);
                          } else {
                            setActiveMenuPlayerId(player.id);
                            setSubMenuView('actions');
                          }
                        }}
                        className={`flex justify-between items-center p-3 rounded-lg border transition cursor-pointer group ${
                          selectedPlayerToPosition?.id === player.id 
                            ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
                            : 'bg-slate-50 border-slate-100 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-emerald-200 group-hover:text-emerald-800 text-slate-600 flex items-center justify-center font-bold text-sm transition">
                            {player.dorsalNumber || '-'}
                          </span>
                          <span className="font-semibold text-slate-700 group-hover:text-emerald-800 transition">
                            {player.firstName} {player.lastName}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">
                          {player.position || 'POR'}
                        </span>
                      </div>

                      {/* Menú Flotante del Banquillo */}
                      {activeMenuPlayerId === player.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                          {subMenuView === 'actions' && (
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-slate-400 px-2 py-1 border-b border-slate-100">
                                Acción: {player.firstName}
                              </div>
                              <button 
                                onClick={() => { handleMatchEvent('GOAL', player); setActiveMenuPlayerId(null); }}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                              >
                                <span>⚽</span> Registrar Gol
                              </button>
                              <button 
                                onClick={() => setSubMenuView('substitution')}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                              >
                                <span>🔄</span> Hacer Cambio
                              </button>
                              <button 
                                onClick={() => { handleMatchEvent('YELLOW', player); setActiveMenuPlayerId(null); }}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-50 rounded-lg flex items-center gap-2"
                              >
                                <span>🟨</span> Amarilla
                              </button>
                              <button 
                                onClick={() => { handleMatchEvent('RED', player); setActiveMenuPlayerId(null); }}
                                className="w-full text-left px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2"
                              >
                                <span>🟥</span> Roja
                              </button>
                            </div>
                          )}

                          {subMenuView === 'substitution' && (
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-blue-600 px-2 py-1 border-b border-slate-100 flex justify-between items-center">
                                <span>Entra por {player.firstName}</span>
                                <button onClick={() => setSubMenuView('actions')} className="text-slate-400">&larr;</button>
                              </div>
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {teamPlayers.filter(p => p.id !== player.id).map(sub => (
                                  <button 
                                    key={sub.id}
                                    onClick={() => {
                                      handleMatchEvent('SUB', sub, player);
                                      setActiveMenuPlayerId(null);
                                      setSubMenuView(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded flex justify-between"
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
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 italic bg-slate-50 rounded-lg border border-slate-100">
                    Cargando jugadores...
                  </div>
                )}
              </div>
            </div>

            {/* 2. CAJA DE CRONOGRAMA */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[350px]">
              <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center justify-between">
                <span>⏱️ Cronograma</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{matchEvents.length} eventos</span>
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {matchEvents.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center italic mt-10">Dale a Iniciar y usa la pizarra táctica.</p>
                ) : (
                  matchEvents.map(event => (
                    <div key={event.id} className="flex gap-3 items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-500 w-8 text-right">{event.minute}'</span>
                      <span className="text-lg">
                        {event.type === 'GOAL' ? '⚽' : event.type === 'YELLOW' ? '🟨' : event.type === 'RED' ? '🟥' : '🔄'}
                      </span>
                      <span className="text-slate-700 font-medium flex-1 leading-tight">{event.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VISTA: LISTA PRINCIPAL (CALENDARIO)
  // --------------------------------------------------------
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <header>
          <h1 className="text-3xl font-bold text-slate-800">Partidos y Estrategia</h1>
          <p className="text-slate-500 mt-1">Gestiona el calendario y configura el once inicial para el próximo rival.</p>
        </header>
        <button 
          onClick={() => setView('create')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg transition flex items-center gap-2 shadow-sm"
        >
          <span className="text-xl leading-none">+</span> Programar Partido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div 
            key={match.id} 
            onClick={() => { setSelectedMatch(match); setView('details'); }}
            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                match.isHome ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {match.isHome ? 'Local' : 'Visitante'}
              </span>
              <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-1 rounded">
                {new Date(match.dateTime).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition mb-1">
              vs {match.opponent}
            </h3>
            <p className="text-sm text-slate-500 mb-4">{match.localisation}</p>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">{match.status || 'PROGRAMADO'}</span>
              <span className="text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Gestionar &rarr;
              </span>
            </div>
          </div>
        ))}
        
        {matches.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-100 text-slate-500 shadow-sm">
            No hay partidos programados. ¡Empieza la pretemporada!
          </div>
        )}
      </div>
    </div>
  );
}