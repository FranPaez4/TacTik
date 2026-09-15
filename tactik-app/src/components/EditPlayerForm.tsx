import { useState } from 'react';
import api from '../api/axio'; 

// Ajusta la interfaz según los campos que tengas en tu tipo Player
interface EditPlayerProps {
  player: any; 
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditPlayerForm({ player, onCancel, onSuccess }: EditPlayerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Iniciamos el estado con los datos actuales del jugador
  const [formData, setFormData] = useState({
    firstName: player.firstName || '',
    lastName: player.lastName || '',
    dorsalNumber: player.dorsalNumber || '',
    position: player.position || '',
    status: player.status || 'DISPONIBLE'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Llamamos al @PutMapping("/{id}") que ya esta en Spring Boot
      await api.put(`/players/${player.id}`, formData);
      onSuccess(); // Si va bien, volvemos a la lista
    } catch (error) {
      console.error("Error al actualizar el jugador:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dorsal */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Dorsal</label>
          <input 
            type="number" 
            name="dorsalNumber"
            value={formData.dorsalNumber}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Posición */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Posición</label>
          <select 
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar posición...</option>
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Centrocampista">Centrocampista</option>
            <option value="Delantero">Delantero</option>
          </select>
        </div>
      </div>

      {/* Estado del Jugador */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Estado</label>
        <select 
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
        >
          <option value="DISPONIBLE">🟢 Disponible</option>
          <option value="LESIONADO">🔴 Lesionado</option>
          <option value="SANCIONADO">🟠 Sancionado</option>
        </select>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}