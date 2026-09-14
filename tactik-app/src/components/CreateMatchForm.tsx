import { useState } from 'react';
import api from '../api/axio';

interface CreateMatchFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateMatchForm({ onCancel, onSuccess }: CreateMatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    dateTime: '',
    localisation: '',
    durationMinutes: 90,
    isHome: true,
    matchType: 'LIGA'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/matches', formData);
      onSuccess();
    } catch (error) {
      console.error("Error al crear el partido:", error);
      alert("Hubo un error al programar el partido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Rival</label>
          <input 
            type="text" name="opponent" required
            value={formData.opponent} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
            placeholder="Ej. CD Teba"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha y Hora</label>
          <input 
            type="datetime-local" name="dateTime" required
            value={formData.dateTime} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Lugar (Localización)</label>
          <input 
            type="text" name="localisation" required
            value={formData.localisation} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
            placeholder="Campo Municipal..."
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Duración (min)</label>
            <input 
              type="number" name="durationMinutes" required
              value={formData.durationMinutes} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo</label>
            <select 
              name="matchType" value={formData.matchType} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="LIGA">Liga</option>
              <option value="COPA">Copa</option>
              <option value="AMISTOSO">Amistoso</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <input 
          type="checkbox" name="isHome" id="isHome"
          checked={formData.isHome} onChange={handleChange}
          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
        />
        <label htmlFor="isHome" className="font-semibold text-slate-700 cursor-pointer">
          Jugamos en casa (Local)
        </label>
      </div>
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Programar Partido'}
        </button>
      </div>
    </form>
  );
}