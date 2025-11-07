// src/components/RoleProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// 1. Aceptamos el 'rol' permitido como argumento
function RoleProtectedRoute({ allowedRole }) {
  const { token, rol, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // 2. Primero, ¿está conectado?
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Segundo, ¿tiene el rol correcto?
  if (rol !== allowedRole) {
    // Si no tiene el rol, lo mandamos a la página de inicio
    return <Navigate to="/" replace />;
  }

  // 4. Si todo pasó, mostramos la página
  return <Outlet />;
}

export default RoleProtectedRoute;