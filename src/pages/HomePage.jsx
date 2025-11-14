// src/pages/HomePage.jsx

import { useState, useEffect, useContext } from 'react'; // <-- Importa useContext
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { AuthContext } from '../context/AuthContext'; // <-- Importa AuthContext

function HomePage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, rol } = useContext(AuthContext); // <-- Obtén el token y el rol

  useEffect(() => {
    // ... (tu fetchInmuebles no cambia)
    const fetchInmuebles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/inmuebles');
        if (!response.ok) { throw new Error('La respuesta de la red no fue exitosa'); }
        const data = await response.json();
        setInmuebles(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchInmuebles();
  }, []);

  // --- FUNCIÓN PARA GUARDAR FAVORITO ---
  const handleSaveClick = async (inmuebleId, e) => {
    // Detenemos la propagación para que no se active el Link de la tarjeta
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert('Por favor, inicia sesión para guardar favoritos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inmueble_id: inmuebleId })
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el favorito');
      }

      alert('¡Guardado en favoritos!');
      // (En una v2, cambiaríamos el estado del botón a "Guardado")

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  return (
    <div>
      <h1>Inmuebles Disponibles</h1>
      <div className={styles.inmueblesGrid}>
        {inmuebles.map(inmueble => (
          <Link
            to={`/inmueble/${inmueble.inmueble_id}`}
            key={inmueble.inmueble_id}
            className={styles.cardLink}
          >
            <div className={styles.card}>
              <div className={styles.cardImage}>
                {/* --- 5. AÑADIMOS EL BOTÓN DE GUARDAR --- */}
                {/* Solo mostramos el botón si es 'arrendatario' */}
                {rol === 'arrendatario' && (
                  <button
                    className={styles.saveButton} // (Añadiremos este estilo)
                    onClick={(e) => handleSaveClick(inmueble.inmueble_id, e)}
                  >
                    Guardar
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
        ))}
      </div>
    </div>
  );
}

export default HomePage;