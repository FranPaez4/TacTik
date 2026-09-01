import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import axios from 'axios';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Recuperamos el token actual
      const token = localStorage.getItem('tactik_token');

      // 2. Avisamos al backend para que lo meta en la lista negra
      if (token) {
        // Asegúrate de que la URL coincide con la de tu servidor Spring Boot
        await axios.post('http://localhost:8080/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Error al revocar el token en el servidor:", error);
      // Aunque falle el servidor (ej. si está caído), seguimos con el proceso para no dejar al usuario atrapado
    } finally {
      // 3. Vaciamos la taquilla local
      localStorage.removeItem('tactik_token');
      
      // 4. (Opcional) Si en el futuro usas Zustand o Context para los datos del usuario, límpialo aquí.

      // 5. Expulsamos al usuario (Login)
      navigate('/home');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium w-full"
    >
      <LogOut className="w-5 h-5" />
      <span>Cerrar Sesión</span>
    </button>
  );
}