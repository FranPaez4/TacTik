import { useState, useEffect } from 'react';
import api from '../api/axio';
import ClubBadge from './ClubBadge';

export default function EditClub() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    colors: '',
    badgeUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Cargamos los datos actuales del club al entrar
    api.get('/users/me').then(res => {
      setFormData(prev => ({
        ...prev,
        name: res.data.clubName || '',
        badgeUrl: res.data.badgeUrl || '',
        colors: res.data.colors || ''
      }));
    }).catch(err => console.error("Error al cargar perfil", err));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'tactik_preset'); // Tu preset sin firmar

    setUploading(true);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/yn4ywjgz/image/upload', {
        method: 'POST',
        body: data
      });
      const fileUploaded = await res.json();
      setFormData(prev => ({ ...prev, badgeUrl: fileUploaded.secure_url }));
    } catch (error) {
      console.error("Error subiendo el escudo a Cloudinary", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/clubs/me', formData);
      setMessage('¡Club actualizado con éxito!');
      setTimeout(() => window.location.reload(), 1000); // Recarga para actualizar el menú lateral
    } catch (error) {
      console.error("Error al actualizar el club", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres borrar tu club? Esta acción no se puede deshacer.')) {
      try {
        await api.delete('/clubs/me');
        window.location.href = '/login';
      } catch (error) {
        console.error("Error al eliminar el club", error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 font-sans">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Configuración del Club</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold border border-emerald-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Club</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
          <input 
            type="text" 
            value={formData.city} 
            onChange={e => setFormData({...formData, city: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Colores</label>
          <input 
            type="text" 
            value={formData.colors} 
            onChange={e => setFormData({...formData, colors: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Escudo del Club</label>
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <ClubBadge badgeUrl={formData.badgeUrl} clubName={formData.name} size="lg" showName={false} />
            <div className="flex-1">
              <input type="file" onChange={handleImageUpload} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
              {uploading && <p className="text-xs text-blue-600 mt-2 font-medium animate-pulse">Subiendo imagen a la nube...</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm">
            Guardar Cambios
          </button>
          <button type="button" onClick={handleDelete} className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-sm">
            Eliminar Club
          </button>
        </div>
      </form>
    </div>
  );
}