import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

