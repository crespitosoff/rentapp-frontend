// src/pages/InmuebleDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- Importante: Hook para leer parámetros de la URL

function InmuebleDetailPage() {
  // 1. useParams() nos da un objeto con los parámetros de la URL.
  //    Lo llamamos { id } porque en la ruta lo llamaremos ':id'
  const { id } = useParams(); 
  
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        // 2. Hacemos fetch usando el 'id' de la URL
        const response = await fetch(`http://localhost:3000/api/inmuebles/${id}`);
        
        if (!response.ok) {
          throw new Error('Inmueble no encontrado');
        }

        const data = await response.json();
        setInmueble(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInmueble();
  }, [id]); // <-- Se ejecuta cada vez que el 'id' de la URL cambie

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!inmueble) {
    return <div>Inmueble no encontrado.</div>;
  }

  // 3. Mostramos los detalles del inmueble
  return (
    <div>
      <h1>{inmueble.titulo}</h1>
      <p>{inmueble.descripcion_larga}</p> {/* Asumiendo que tienes este campo */}
      <p><strong>Dirección:</strong> {inmueble.direccion}</p>
      <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
      <p><strong>Habitaciones:</strong> {inmueble.num_habitaciones}</p>
      <p><strong>Baños:</strong> {inmueble.num_baños}</p>
    </div>
  );
}

export default InmuebleDetailPage;