// src/pages/MyFavoritesPage.jsx

import { useContext } from 'react'; // <-- Importa solo lo que necesitas
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Reutilizamos los estilos que ya creamos para la Home Page
import styles from './HomePage.module.css';

function MyFavoritesPage() {
    // 1. Obtenemos TODO del cerebro (AuthContext)
    const { favoritos, removeFavorito, isLoading } = useContext(AuthContext);

    // 2. Ya no necesitamos fetchFavoritos, useEffect, useState, etc. ¡Todo está en el contexto!

    // 3. Usamos el 'isLoading' del contexto
    if (isLoading) return <div>Cargando...</div>;

    return (
        <div>
            <h1>Mis Inmuebles Favoritos</h1>
            {favoritos.length === 0 ? (
                <p>Aún no has guardado ningún inmueble. <Link to="/">¡Explora ahora!</Link></p>
            ) : (
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
                                // 4. Usamos la función 'removeFavorito' del contexto
                                onClick={() => removeFavorito(inmueble.inmueble_id)}
                                style={{ margin: '1rem', width: 'calc(100% - 2rem)', backgroundColor: '#aa2a2a' }}
                            >
                                Quitar de Favoritos
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyFavoritesPage;