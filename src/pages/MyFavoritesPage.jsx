// src/pages/MyFavoritesPage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Reutilizamos los estilos que ya creamos para la Home Page
import styles from './HomePage.module.css';

function MyFavoritesPage() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    // Función para cargar los favoritos
    const fetchFavoritos = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('No se pudo cargar tus favoritos');
            }
            const data = await response.json();
            setFavoritos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar favoritos al montar la página
    useEffect(() => {
        if (token) {
            fetchFavoritos();
        }
    }, [token]);

    // Función para QUITAR de favoritos
    const handleRemoveFavorito = async (inmuebleId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/favoritos/${inmuebleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('No se pudo eliminar el favorito');
            }
            // Actualiza la UI al instante filtrando el inmueble eliminado
            setFavoritos(favoritos.filter(inm => inm.inmueble_id !== inmuebleId));
        } catch (err) {
            setError(err.message);
        }
    };

    // Lógica de renderizado
    if (loading) return <div>Cargando tus favoritos...</div>;

    return (
        <div>
            <h1>Mis Inmuebles Favoritos</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {favoritos.length === 0 && !loading && (
                <p>Aún no has guardado ningún inmueble. <Link to="/">¡Explora ahora!</Link></p>
            )}

            <div className={styles.inmueblesGrid}>
                {favoritos.map(inmueble => (
                    <div key={inmueble.inmueble_id} className={styles.card}>
                        <Link to={`/inmueble/${inmueble.inmueble_id}`} className={styles.cardLink}>
                            <div className={styles.cardImage}>{/* Placeholder */}</div>
                            <div className={styles.cardContent}>
                                <h3>{inmueble.titulo}</h3>
                                <p className={styles.price}>${inmueble.precio_mensual} / mes</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => handleRemoveFavorito(inmueble.inmueble_id)}
                            style={{ margin: '1rem', width: 'calc(100% - 2rem)', backgroundColor: '#aa2a2a' }}
                        >
                            Quitar de Favoritos
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyFavoritesPage;