import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ESTADOS DE FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // '' (defecto), 'price_asc', 'price_desc'

  const { token, rol, favoritos, addFavorito, removeFavorito } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función de carga unificada
  const fetchInmuebles = async () => {
    setLoading(true);
    try {
      // Construimos la URL con TODOS los parámetros
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortOrder) params.append('sort', sortOrder);

      const url = `http://localhost:3000/api/inmuebles?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) { throw new Error('Error al cargar inmuebles'); }
      const data = await response.json();
      setInmuebles(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Carga inicial
  useEffect(() => {
    fetchInmuebles();
  }, []);

  // Manejador del formulario (Búsqueda y Filtros)
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchInmuebles(); // Llama al fetch con los estados actuales
  };

  // Si cambia el orden, recargar automáticamente
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    // Pequeño truco: como el estado 'sortOrder' no se actualiza instantáneamente
    // para el fetch, pasamos el valor nuevo manualmente o usamos useEffect.
    // Para simplificar, aquí forzamos un re-render rápido o usamos useEffect separado.
    // Mejor opción rápida: useEffect que escuche 'sortOrder'.
  };

  // Efecto secundario para recargar cuando cambia el orden
  useEffect(() => {
    fetchInmuebles();
  }, [sortOrder]);


  if (loading && inmuebles.length === 0) { return <div>Cargando...</div>; }
  if (error) { return <div>Error: {error}</div>; }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Encuentra tu espacio ideal</h1>

        {/* --- FORMULARIO DE BÚSQUEDA Y FILTROS --- */}
        <form onSubmit={handleFilterSubmit}>
          {/* Buscador Principal */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por título, dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>Buscar</button>
          </div>

          {/* Filtros Avanzados */}
          <div className={styles.filtersContainer}>
            <div>
              <span className={styles.filterLabel}>Precio:</span>
              <input
                type="number" placeholder="Mín"
                value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                className={styles.filterInput}
              />
              {' - '}
              <input
                type="number" placeholder="Máx"
                value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div>
              <span className={styles.filterLabel}>Ordenar por:</span>
              <select value={sortOrder} onChange={handleSortChange} className={styles.filterSelect}>
                <option value="">Más recientes</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            {/* Botón pequeño para aplicar filtros de precio */}
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Filtrar</button>
          </div>
        </form>
      </div>

      <div className={styles.inmueblesGrid}>
        {/* ... (Mapeo de inmuebles SIN CAMBIOS) ... */}
        {inmuebles.map(inmueble => {
          const isFavorito = favoritos.find(fav => fav.inmueble_id === inmueble.inmueble_id);
          const handleFavClick = (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!token) { navigate('/login'); return; }
            isFavorito ? removeFavorito(inmueble.inmueble_id) : addFavorito(inmueble);
          };

          return (
            <Link to={`/inmueble/${inmueble.inmueble_id}`} key={inmueble.inmueble_id} className={styles.cardLink}>
              <div className={styles.card}>
                <div className={styles.cardImageContainer}>
                  {inmueble.es_destacado && <span className={styles.featuredBadge}>Destacado</span>}
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