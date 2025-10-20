// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  // (estados de inmuebles, loading, y error siguen igual)
  // 1. Estado para guardar la lista de inmuebles
  const [inmuebles, setInmuebles] = useState([]);
  // 2. Estado para saber si está cargando
  const [loading, setLoading] = useState(true);
  // 3. Estado para guardar cualquier error
  const [error, setError] = useState(null);

  // (useEffect para hacer el fetch sigue igual)
  // 4. useEffect se ejecuta una vez cuando el componente se carga
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        // Hacemos la petición a nuestra API del backend
        const response = await fetch('http://localhost:3000/api/inmuebles');

        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }

        const data = await response.json();
        setInmuebles(data); // Guardamos los datos en el estado
      } catch (err) {
        setError(err.message); // Guardamos el error
      } finally {
        setLoading(false); // Dejamos de cargar (ya sea con éxito o error)
      }
    };

    fetchInmuebles(); // Llamamos a la función
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // (lógica de loading y error sigue igual)
  // 5. Mostramos diferentes cosas dependiendo del estado
  if (loading) {
    return <div>Cargando inmuebles...</div>;
  }

  if (error) {
    return <div>Error al cargar los inmuebles: {error}</div>;
  }

  // 6. Si todo salió bien, mostramos la lista
  return (
    <div>
      <h1>Inmuebles Disponibles</h1>
      <div className="inmuebles-lista">
        {inmuebles.map(inmueble => (
          // 2. ENVUELVE LA TARJETA CON EL COMPONENTE LINK
          // Usamos "template literals" (backticks ``) para crear la URL dinámica
          <Link
            to={`/inmueble/${inmueble.inmueble_id}`}
            key={inmueble.inmueble_id}
            style={{ textDecoration: 'none', color: 'inherit' }} // <-- Estilo para que no parezca un link feo
          >
            <div style={cardStyle}>
              <h3>{inmueble.titulo}</h3>
              <p>{inmueble.descripcion}</p>
              <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Estilos básicos para las "tarjetas" (opcional)
const cardStyle = {
  border: '1px solid #555',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  textAlign: 'left'
};

export default HomePage;