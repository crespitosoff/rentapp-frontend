import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute() {
    // Obtenemos el token y el estado de carga del contexto
    const { token, isLoading } = useContext(AuthContext);

    // MIENTRAS EL GERENTE REVISA... MUESTRA UN MENSAJE
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // AHORA SÍ, TOMA LA DECISIÓN (CUANDO isLoading ES false)
    // 1. Revisa si hay un token (si el usuario ha iniciado sesión)
    if (!token) {
        // 2. Si no hay token, redirige al usuario a la página de login
        return <Navigate to="/login" replace />;
    }

    // 3. Si hay un token, muestra el contenido de la página solicitada
    return <Outlet />;
}

export default ProtectedRoute;