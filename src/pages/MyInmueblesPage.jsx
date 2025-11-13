// src/pages/MyInmueblesPage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MyInmueblesPage() {
    // Estados para los datos, carga y errores
    const [inmuebles, setInmuebles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtenemos el token del contexto para la autenticación
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyInmuebles = async () => {
            try {
                // Hacemos el fetch a la NUEVA ruta protegida
                const response = await fetch('http://localhost:3000/api/inmuebles/propios', {
                    headers: {
                        // Enviamos el token para la autorización
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error al cargar los inmuebles');
                }

                const data = await response.json();
                setInmuebles(data); // Guardamos los datos en el estado

            } catch (err) {
                setError(err.message); // Guardamos el error
            } finally {
                setLoading(false); // Dejamos de cargar
            }
        };

        // Solo hacemos el fetch si tenemos un token
        if (token) {
            fetchMyInmuebles();
        }
    }, [token]); // El array de dependencias incluye el token

    // Lógica de renderizado
    if (loading) {
        return <div>Cargando mis inmuebles...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Mis Inmuebles Publicados</h1>
            {inmuebles.length === 0 ? (
                <p>Aún no has publicado ningún inmueble. <Link to="/crear-inmueble">¡Publica el primero!</Link></p>
            ) : (
                <div>
                    {inmuebles.map(inmueble => (
                        // --- INICIO DEL CAMBIO ---
                        <Link
                            to={`/inmueble/${inmueble.inmueble_id}`}
                            key={inmueble.inmueble_id} // La 'key' se mueve al elemento padre
                            style={{ textDecoration: 'none', color: 'inherit' }} // Estilo para que no parezca un link
                        >
                            <div style={cardStyle}> {/* La 'key' se quita de aquí */}
                                <h3>{inmueble.titulo}</h3>
                                <p>{inmueble.descripcion}</p>
                                <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
                                {/* Aquí podríamos añadir botones de Editar/Eliminar en el futuro */}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// Estilos de tarjeta (puedes reutilizarlos)
const cardStyle = {
    border: '1px solid #555',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    textAlign: 'left'
};

export default MyInmueblesPage;