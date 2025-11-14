import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { AuthContext } from '../context/AuthContext';

function InmuebleDetailPage() {
  // 1. useParams() nos da un objeto con los parámetros de la URL.
  //    Lo llamamos { id } porque en la ruta lo llamaremos ':id'
  const { id } = useParams();
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Obtenemos todo lo del contexto
  const { token, rol, favoritos, addFavorito, removeFavorito } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ... (tu fetchInmueble no cambia)
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

  // 3. ¡ELIMINAMOS handleSaveFavorite! Ya no se necesita.

  if (loading) {
    return <div>Cargando inmueble...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!inmueble) {
    return <div>Inmueble no encontrado.</div>;
  }

  // 4. LÓGICA DEL BOTÓN INTELIGENTE
  const isFavorito = favoritos.find(fav => fav.inmueble_id === inmueble.inmueble_id);

  const handleFavClick = () => {
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

  // Mostramos los detalles del inmueble
  return (
    <div>
      <h1>{inmueble.titulo}</h1>

      {/* --- 5. LÓGICA DE MOSTRAR BOTÓN --- */}
      {rol !== 'arrendador' && (
        <button
          onClick={handleFavClick}
          style={{
            marginBottom: '1rem',
            backgroundColor: isFavorito ? '#aa2a2a' : ''
          }}
        >
          {isFavorito ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
        </button>
      )}

      {/* --- ARREGLO DE CAMPOS (sin cambios) --- */}
      <p>{inmueble.descripcion}</p>
      <p><strong>Dirección:</strong> {inmueble.direccion}</p>
      <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
      <p><strong>Estado:</strong> {inmueble.disponible ? 'Disponible' : 'Alquilado'}</p>
    </div>
  );
}

export default InmuebleDetailPage;