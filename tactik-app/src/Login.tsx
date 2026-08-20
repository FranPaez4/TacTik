import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axio';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue
    setErrores({}); // Limpia errores anteriores

    try {
      
      const response = await api.post('auth/authenticate', { 
        email: email.toLowerCase(),
       password: password 
      });
      localStorage.setItem('tactik_token', response.data.token); // Guardamos el token en localStorage
      navigate('/dashboard'); 
    } catch (error: any) {
      
      if (error.response?.status === 400) {
        setErrores(error.response.data); // Guardamos los errores del backend
      } else {
        console.error("Error inesperado en el servidor:", error);
      }
    }
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">⚽ TacTik</h1>
          <p className="text-slate-500">Inicia sesión en tu pizarra táctica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="tu_usuario"
              required
            />
            {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="••••••••"
              required
            />
            {errores.password && <p className="text-red-500 text-sm mt-1">{errores.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-md shadow-emerald-200"
          >
            Entrar al Vestuario
          </button>
        </form>
      </div>
    </div>
  );
}