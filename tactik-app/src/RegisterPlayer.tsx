import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api/axio';
import logoTactik from './assets/logo.png';
import bgCesped from './assets/bg-cesped.jpg';
import { Shield, User } from 'lucide-react';

export default function RegisterPlayer() {
  const [formData, setFormData] = useState({
    familyInviteCode: '', 
    name: '',
    surname: '',
    birthday: '',
    dni: '',
    telephone: '',
    email: '',
    password: '',
    role: 'PLAYER' // Por defecto
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});

    if (formData.password !== confirmPassword) {
      setErrores({ confirmPassword: "Las contraseñas no coinciden." });
      return;
    }

    try {
      const response = await api.post('/auth/register-player', formData);

      if (response.data.token) {
        localStorage.setItem('tactik_token', response.data.token);
        navigate('/dashboard'); 
      } else {
        navigate('/login'); 
      }
    } 
    catch (error: any) {
      if (error.response?.status === 400) {
        setErrores(error.response.data); 
      } else {
        setErrores({ general: "Error al saltar al campo. Revisa tu código o tus datos." });
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-10"
      style={{ backgroundImage: `url(${bgCesped})` }}
    >
      <div className="absolute inset-0 bg-slate-900/80"></div>

      <div className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">
            <img src={logoTactik} alt="TacTik Logo" className="w-48 h-auto mx-auto mb-4" />
          </h1>
          <p className="text-slate-500 mb-8">Únete a tu equipo y salta al campo</p>
        </div>

        {errores.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-center text-sm mb-4">
            {errores.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          {/* ================= BLOQUE 1: CÓDIGO DE JUGADOR ================= */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
               Ficha del Equipo
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código de Jugador</label>
              <input type="text" name="familyInviteCode" value={formData.familyInviteCode} onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50 text-center font-bold tracking-widest uppercase" />
              <p className="text-xs text-slate-500 mt-2 text-center">Introduce el código que te ha dado el entrenador.</p>
              {errores.familyInviteCode && <p className="text-red-400 text-sm mt-1">{errores.familyInviteCode}</p>}
            </div>
          </div>

          {/* ================= BLOQUE 2: DATOS DE LA CUENTA ================= */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                 <User className="w-5 h-5 text-emerald-600" />
               Datos de Acceso
            </h3>
            
            <div className="space-y-4">
              
              {/* DESPLEGABLE DE ROL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">¿Quién eres?</label>
                <select name="role" value={formData.role} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium text-slate-700">
                  <option value="PLAYER">Soy el Jugador</option>
                  <option value="FAMILY">Soy un Familiar / Tutor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre real"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.name && <p className="text-red-400 text-sm mt-1">{errores.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tus Apellidos</label>
                  <input type="text" name="surname" value={formData.surname} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.surname && <p className="text-red-400 text-sm mt-1">{errores.surname}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tu Fecha Nacimiento</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.birthday && <p className="text-red-400 text-sm mt-1">{errores.birthday}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tu DNI</label>
                  <input type="text" name="dni" value={formData.dni} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.dni && <p className="text-red-400 text-sm mt-1">{errores.dni}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tu Teléfono</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                {errores.telephone && <p className="text-red-400 text-sm mt-1">{errores.telephone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Para iniciar sesión"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                {errores.email && <p className="text-red-400 text-sm mt-1">{errores.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.password && <p className="text-red-400 text-sm mt-1">{errores.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Repetir Contraseña</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.confirmPassword && <p className="text-red-400 text-sm mt-1">{errores.confirmPassword}</p>}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 mt-6 shadow-lg shadow-emerald-600/30">
            Completar Fichaje
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-slate-500">¿Ya estás inscrito en el equipo? </span>
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </div>
        
      </div>
    </div>
  );
}