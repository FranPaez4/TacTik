import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import RegisterCoach from './RegisterCoach';
import RegisterPlayer from './RegisterPlayer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Si entras a la raíz, te redirige automáticamente a la página de inicio */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Nuestras pantallas principales */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path= "/register" element={<Register />} />
        <Route path= "/register-coach" element={<RegisterCoach />} />
        <Route path= "/register-player" element={<RegisterPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

