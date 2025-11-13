// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // <-- 1. Importa el Módulo de CSS

function HomePage() {
  // ... (estados de inmuebles, loading, error - sin cambios)
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (useEffect para el fetch - sin cambios)
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/inmuebles');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        const data = await response.json();
        setInmuebles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInmuebles();
  }, []);

  // ... (lógica de loading y error - sin cambios)
  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  // 2. ¡Ya no necesitamos 'cardStyle'! Lo borramos.

  // 6. Si todo salió bien, mostramos la lista (actualizada con CSS)
  return (
    <div>
      <h1>Inmuebles Disponibles</h1>
      {/* 3. Usa la clase de la grilla */}
      <div className={styles.inmueblesGrid}>
        {inmuebles.map(inmueble => (
          <Link
            to={`/inmueble/${inmueble.inmueble_id}`}
            key={inmueble.inmueble_id}
            className={styles.cardLink} // 4. Usa la clase del link
          >
            {/* 5. Usa la clase de la tarjeta */}
            <div className={styles.card}>
              {/* 6. Añadimos un placeholder de imagen */}
              <div className={styles.cardImage}>
                {/* En el futuro aquí irá un <img /> */}
              </div>

              {/* 7. Agrupamos el contenido */}
              <div className={styles.cardContent}>
                <h3>{inmueble.titulo}</h3>
                <p>{inmueble.descripcion}</p>
                <p className={styles.price}>${inmueble.precio_mensual} / mes</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;