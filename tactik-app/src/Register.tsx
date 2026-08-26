import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api/axio';
import { Shield, Upload, User } from 'lucide-react';
import logoTactik from './assets/logo.png';
import bgCesped from './assets/bg-cesped.jpg';

export default function Register() {
  // Alineación titular: todos los campos que pide tu backend
  const [formData, setFormData] = useState({
    clubName: '',
    city: '',
    colors: '',
    badgeUrl: '',
    name: '',
    surname: '',
    birthday: '',
    dni: '',
    telephone: '',
    email: '',
    password: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Función genérica para manejar los cambios en cualquier input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'tactik_preset'); // <-- Tu preset de Cloudinary

    setUploadingImage(true);
    try {
      // Reemplaza 'tu_cloud_name' por tu nombre de Cloudinary real
      const res = await fetch('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', {
        method: 'POST',
        body: data
      });
      const fileUploaded = await res.json();
      setFormData(prev => ({ ...prev, badgeUrl: fileUploaded.secure_url }));
    } catch (err) {
      console.error("Error subiendo la imagen", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});

    if (formData.password !== confirmPassword) {
      setErrores({ confirmPassword: "Las contraseñas no coinciden." });
      return; // Cortamos la jugada, no se envía nada al backend
    }

    try {

      const response = await api.post('/auth/register', formData);

      // Si tu backend devuelve el token directamente al registrar:
      if (response.data.token) {
        localStorage.setItem('tactik_token', response.data.token);
        navigate('/dashboard'); // Fichado y directo al campo
      } else {
        navigate('/login'); // Si no devuelve token, lo mandamos a iniciar sesión
      }

    } 
    catch (error: any) {
      if (error.response?.status === 400) {
        setErrores(error.response.data); // Errores de validación del DTO
      } else {
        setErrores({ general: "Error al realizar el fichaje. Revisa los datos o prueba con otro correo." });
      }
    }
    };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgCesped})` }}
    >
      {/* Capa oscura semitransparente */}
      <div className="absolute inset-0 bg-slate-900/80"></div>

      {/* Caja blanca del formulario */}
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2"><img src={logoTactik} alt="TacTik Logo" className="w-55 h-auto mx-auto mb-4" /></h1>
          <p className="text-slate-500 mb-6">Ficha por nuestro equipo y gestiona tu plantilla</p>
        </div>

        {errores.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-center text-sm">
            {errores.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ================= BLOQUE 1: DATOS DEL CLUB ================= */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              <Shield className="w-5 h-5 inline-block mr-2" />
               Datos del Club
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Club</label>
                <input type="text" name="clubName" value={formData.clubName} onChange={handleChange} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                {errores.clubName && <p className="text-red-400 text-sm mt-1">{errores.clubName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.city && <p className="text-red-400 text-sm mt-1">{errores.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Colores</label>
                  <input type="text" name="colors" value={formData.colors} onChange={handleChange} placeholder="Ej: Verde y Blanco"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.colors && <p className="text-red-400 text-sm mt-1">{errores.colors}</p>}
                </div>
                {/* Selector de Escudo / Logotipo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Escudo del Club</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500 font-medium">
                      {uploadingImage ? "Subiendo escudo..." : "Sube el logo del equipo"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  
                  {formData.badgeUrl && (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                      <img src={formData.badgeUrl} alt="Escudo preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
          {/* ================= BLOQUE 2: DATOS DEL USUARIO ================= */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              <User className="w-5 h-5 inline-block mr-2" />
              Datos del Presidente
            </h3>
            {/* Nombre y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              {errores.name && <p className="text-red-400 text-sm mt-1">{errores.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
              <input type="text" name="surname" value={formData.surname} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              {errores.surname && <p className="text-red-400 text-sm mt-1">{errores.surname}</p>}
            </div>
          </div>

          { /* Fecha y DNI */ }
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Nacimiento</label>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              {errores.birthday && <p className="text-red-400 text-sm mt-1">{errores.birthday}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
              <input type="text" name="dni" value={formData.dni} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              {errores.dni && <p className="text-red-400 text-sm mt-1">{errores.dni}</p>}
            </div>
          </div>
        </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            {errores.telephone && <p className="text-red-400 text-sm mt-1">{errores.telephone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            {errores.email && <p className="text-red-400 text-sm mt-1">{errores.email}</p>}
          </div>

          {/* Contraseña */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.password && <p className="text-red-400 text-sm mt-1">{errores.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Repetir Contraseña</label>
                  {/* Ojo: Este usa confirmPassword y su propio onChange */}
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  {errores.confirmPassword && <p className="text-red-400 text-sm mt-1">{errores.confirmPassword}</p>}
                </div>
              </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 mt-4">
            Registrarse
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-slate-500">¿Ya eres parte del cuerpo técnico? </span>
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Vuelve al inicio
          </Link>
        </div>
        
      </div>
    </div>
  );
}