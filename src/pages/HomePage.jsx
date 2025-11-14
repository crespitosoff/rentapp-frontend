// src/pages/HomePage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    token,
    rol,
    favoritos,
    addFavorito,
    removeFavorito
  } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        // Esta ruta ahora devuelve los inmuebles con 'url_imagen'
        const response = await fetch('http://localhost:3000/api/inmuebles');
        if (!response.ok) { throw new Error('La respuesta de la red no fue exitosa'); }
        const data = await response.json();
        setInmuebles(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchInmuebles();
  }, []);

  if (loading) { return <div>Cargando inmuebles...</div>; }
  if (error) { return <div>Error al cargar los inmuebles: {error}</div>; }

  return (
    <div>
      <h1>Inmuebles Disponibles</h1>
      <div className={styles.inmueblesGrid}>
        {inmuebles.map(inmueble => {
          const isFavorito = favoritos.find(fav => fav.inmueble_id === inmueble.inmueble_id);

          const handleFavClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!token) {
              navigate('/login');
              return;
            }
            if (isFavorito) {
              removeFavorito(inmueble.inmueble_id);
            } else {
              addFavorito(inmueble);
            }
          };

          return (
            <Link
              to={`/inmueble/${inmueble.inmueble_id}`}
              key={inmueble.inmueble_id}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.cardImageContainer}> {/* Contenedor para la imagen */}
                  {/* --- CAMBIO PRINCIPAL --- */}
                  {inmueble.url_imagen ? (
                    <img src={inmueble.url_imagen} alt={inmueble.titulo} className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder}></div>
                  )}

                  {rol !== 'arrendador' && (
                    <button
                      className={styles.saveButton}
                      onClick={handleFavClick}
                      style={{ backgroundColor: isFavorito ? '#aa2a2a' : '' }}
                    >
                      {isFavorito ? 'Quitar' : 'Guardar'}
                    </button>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3>{inmueble.titulo}</h3>
                  <p>{inmueble.descripcion}</p>
                  <p className={styles.price}>${inmueble.precio_mensual} / mes</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;