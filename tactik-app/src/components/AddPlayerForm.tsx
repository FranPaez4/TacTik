import { useState } from 'react';
import api from '../api/axio';

interface AddPlayerFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddPlayerForm({ onCancel, onSuccess }: AddPlayerFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dorsalNumber: '',
    position: 'Centrocampista'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/players', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dorsalNumber: parseInt(formData.dorsalNumber),
        position: formData.position
      });
      
      onSuccess(); 
    } catch (error) {
      console.error("Error al guardar el jugador:", error);
      alert("Hubo un error al crear la ficha. Comprueba la consola del backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Alta de Nuevo Jugador</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
            <input 
              type="text" 
              name="firstName" 
              required
              value={formData.firstName} 
              onChange={handleChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Brahim"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Apellidos</label>
            <input 
              type="text" 
              name="lastName" 
              required
              value={formData.lastName} 
              onChange={handleChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Díaz"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dorsal</label>
            <input 
              type="number" 
              name="dorsalNumber" 
              required
              min="1"
              max="99"
              value={formData.dorsalNumber} 
              onChange={handleChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. 21"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Posición</label>
            <select 
              name="position" 
              value={formData.position} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Centrocampista">Centrocampista</option>
              <option value="Extremo">Extremo</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3">
            <span className="text-xl">ℹ️</span>
            <p>
              <strong>El código de invitación</strong> para que el jugador se vincule a esta ficha 
              se generará automáticamente. Podrás verlo en la tabla de la plantilla al guardar.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-sm disabled:opacity-70"
          >
            {loading ? 'Guardando...' : 'Dar de Alta'}
          </button>
        </div>
      </form>
    </div>
  );
}