// src/pages/HomePage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- 1. Importa useNavigate
import styles from './HomePage.module.css';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Obtenemos todo lo que necesitamos del cerebro
  const {
    token,
    rol,
    favoritos,
    addFavorito,
    removeFavorito
  } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // 3. ¡ELIMINAMOS handleSaveClick! Ya no se necesita.

  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  return (
    <div>
      <h1>Inmuebles Disponibles</h1>
      <div className={styles.inmueblesGrid}>
        {inmuebles.map(inmueble => {
          // 4. LÓGICA DEL BOTÓN INTELIGENTE
          // Comprueba si este inmueble YA está en la lista de favoritos del contexto
          const isFavorito = favoritos.find(fav => fav.inmueble_id === inmueble.inmueble_id);

          // 5. Lógica del clic
          const handleFavClick = (e) => {
            e.preventDefault(); // Detiene la navegación del Link
            e.stopPropagation();

            if (!token) {
              // ¡Tu idea! Incita al login
              navigate('/login');
              return;
            }

            // Si ya es favorito, lo quita. Si no, lo añade.
            if (isFavorito) {
              removeFavorito(inmueble.inmueble_id);
            } else {
              addFavorito(inmueble); // Pasamos el objeto 'inmueble' completo
            }
          };

          return (
            <Link
              to={`/inmueble/${inmueble.inmueble_id}`}
              key={inmueble.inmueble_id}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.cardImage}>
                  {/* 6. LÓGICA DE MOSTRAR BOTÓN */}
                  {/* Mostramos el botón si NO eres arrendador */}
                  {rol !== 'arrendador' && (
                    <button
                      className={styles.saveButton}
                      onClick={handleFavClick}
                      // Cambiamos el estilo si es favorito
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