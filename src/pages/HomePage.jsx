import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- ESTADO PARA LA BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState('');

  const {
    token,
    rol,
    favoritos,
    addFavorito,
    removeFavorito
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función para cargar inmuebles (ahora acepta un término de búsqueda opcional)
  const fetchInmuebles = async (query = '') => {
    setLoading(true);
    try {
      // Construimos la URL con el parámetro de búsqueda si existe
      let url = 'http://localhost:3000/api/inmuebles';
      if (query) {
        url += `?q=${query}`;
      }

      const response = await fetch(url);
      if (!response.ok) { throw new Error('La respuesta de la red no fue exitosa'); }
      const data = await response.json();
      setInmuebles(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Carga inicial (sin búsqueda)
  useEffect(() => {
    fetchInmuebles();
  }, []);

  // Manejador del formulario de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInmuebles(searchTerm);
  };

  if (loading && inmuebles.length === 0) { return <div>Cargando inmuebles...</div>; }
  if (error) { return <div>Error al cargar los inmuebles: {error}</div>; }

  return (
    <div>
      {/* --- SECCIÓN DE BÚSQUEDA --- */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Encuentra tu espacio ideal</h1>
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por título, dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>
      </div>

      {/* Mensaje si no hay resultados */}
      {!loading && inmuebles.length === 0 && (
        <p style={{ textAlign: 'center' }}>No se encontraron inmuebles que coincidan con tu búsqueda.</p>
      )}

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
                <div className={styles.cardImageContainer}>
                  {/* --- ETIQUETA DE DESTACADO --- */}
                  {inmueble.es_destacado && (
                    <span className={styles.featuredBadge}>Destacado</span>
                  )}

                  {inmueble.url_imagen ? (
                    <img src={inmueble.url_imagen} alt={inmueble.titulo} className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder}></div>
                  )}

                  {rol !== 'arrendador' && (
                    <button
                      className={isFavorito ? styles.saveButtonRemove : styles.saveButton}
                      onClick={handleFavClick}
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