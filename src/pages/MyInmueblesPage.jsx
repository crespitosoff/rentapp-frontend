// src/pages/MyInmueblesPage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importa useNavigate
import { AuthContext } from '../context/AuthContext';

function MyInmueblesPage() {
    // ... (estados de inmuebles, loading, error, token)
    const [inmuebles, setInmuebles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate(); // <-- Hook para redirigir

    useEffect(() => {
        const fetchMyInmuebles = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/inmuebles/propios', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error al cargar los inmuebles');
                }
                const data = await response.json();
                setInmuebles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchMyInmuebles();
        }
    }, [token]);

    // --- NUEVA FUNCIÓN PARA ELIMINAR ---
    const handleDelete = async (inmuebleId) => {
        // Pedimos confirmación antes de un borrado destructivo
        if (!window.confirm('¿Estás seguro de que quieres eliminar este inmueble? Esta acción no se puede deshacer.')) {
            return; // Si el usuario cancela, no hacemos nada
        }

        try {
            const response = await fetch(`http://localhost:3000/api/inmuebles/${inmuebleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Autenticación
                }
            });

            if (!response.ok) {
                // Si el backend da error (ej: 403, 404, 500)
                const errData = await response.json();
                throw new Error(errData.message || 'Error al eliminar el inmueble');
            }

            // ¡Éxito! Actualizamos la UI al instante
            // Filtramos la lista de inmuebles, quitando el que acabamos de borrar
            setInmuebles(inmuebles.filter(inm => inm.inmueble_id !== inmuebleId));

        } catch (err) {
            setError(err.message); // Mostramos cualquier error
        }
    };

    // Lógica de renderizado (sin cambios)
    if (loading) { /* ... */ }
    if (error) { /* ... */ }

    return (
        <div>
            <h1>Mis Inmuebles Publicados</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Mostramos el error de borrado */}
            {inmuebles.length === 0 ? (
                <p>Aún no has publicado ningún inmueble. <Link to="/crear-inmueble">¡Publica el primero!</Link></p>
            ) : (
                <div>
                    {inmuebles.map(inmueble => (
                        // Usamos un <div> como contenedor padre
                        <div key={inmueble.inmueble_id} style={cardStyle}>
                            <Link
                                to={`/inmueble/${inmueble.inmueble_id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <h3>{inmueble.titulo}</h3>
                                <p>{inmueble.descripcion}</p>
                                <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
                            </Link>

                            {/* --- AÑADIMOS LOS BOTONES --- */}
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Link to={`/mis-inmuebles/editar/${inmueble.inmueble_id}`}>
                                    <button>Editar</button>
                                </Link>
                                <button onClick={() => handleDelete(inmueble.inmueble_id)} style={{ backgroundColor: 'red' }}>
                                    Eliminar
                                </button>
                            </div>
                            {/* --- FIN DE LOS BOTONES --- */}
                        </div>
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