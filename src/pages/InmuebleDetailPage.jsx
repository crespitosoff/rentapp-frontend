import { useState, useEffect, useContext } from 'react'; // Importa useContext
import { useParams } from 'react-router-dom'; // <-- Importante: Hook para leer parámetros de la URL
import { AuthContext } from '../context/AuthContext'; // <-- Importa AuthContext

function InmuebleDetailPage() {
  // 1. useParams() nos da un objeto con los parámetros de la URL.
  //    Lo llamamos { id } porque en la ruta lo llamaremos ':id'
  const { id } = useParams();
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, rol } = useContext(AuthContext); // <-- Obtén token y rol

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/inmuebles/${id}`);
        if (!response.ok) { throw new Error('Inmueble no encontrado'); }
        const data = await response.json();
        setInmueble(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };

    fetchInmueble();
  }, [id]); // <-- Se ejecuta cada vez que el 'id' de la URL cambie

  // --- NUEVA FUNCIÓN PARA GUARDAR FAVORITO ---
  const handleSaveFavorite = async () => {
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
        body: JSON.stringify({ inmueble_id: id })
      });
      if (!response.ok) { throw new Error('No se pudo guardar el favorito'); }
      alert('¡Guardado en favoritos!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!inmueble) {
    return <div>Inmueble no encontrado.</div>;
  }

  // Mostramos los detalles del inmueble
  return (
    <div>
      <h1>{inmueble.titulo}</h1>

      {/* --- BOTÓN DE GUARDAR --- */}
      {/* Solo mostramos el botón si es 'arrendatario' */}
      {rol === 'arrendatario' && (
        <button onClick={handleSaveFavorite} style={{ marginBottom: '1rem' }}>
          Guardar en Favoritos
        </button>
      )}

      {/* --- ARREGLO DE CAMPOS --- */}
      {/* Eliminamos 'descripcion_larga' (no existe), 'num_habitaciones' y 'num_baños' */}
      <p>{inmueble.descripcion}</p>
      <p><strong>Dirección:</strong> {inmueble.direccion}</p>
      <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
      <p><strong>Estado:</strong> {inmueble.disponible ? 'Disponible' : 'Alquilado'}</p>
    </div>
  );
}

export default InmuebleDetailPage;