import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function InmuebleDetailPage() {
  const { id } = useParams();
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, rol, favoritos, addFavorito, removeFavorito } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        // Esta ruta ahora devuelve el inmueble con un array 'fotos'
        const response = await fetch(`http://localhost:3000/api/inmuebles/${id}`);
        if (!response.ok) { throw new Error('Inmueble no encontrado'); }
        const data = await response.json();
        setInmueble(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };

    fetchInmueble();
  }, [id]);

  if (loading) { return <div>Cargando inmueble...</div>; }
  if (error) { return <div>Error: {error}</div>; }
  if (!inmueble) { return <div>Inmueble no encontrado.</div>; }

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
      {/* --- NUEVA SECCIÓN DE IMAGEN --- */}
      {inmueble.fotos && inmueble.fotos.length > 0 && (
        <div className="inmueble-images">
          {/* Por ahora solo mostramos la primera foto */}
          <img
            src={inmueble.fotos[0].url_imagen}
            alt={inmueble.titulo}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          {/* (En el futuro, aquí podríamos mapear 'inmueble.fotos' para crear una galería) */}
        </div>
      )}

      <h1>{inmueble.titulo}</h1>

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

      <p>{inmueble.descripcion}</p>
      <p><strong>Dirección:</strong> {inmueble.direccion}</p>
      <p><strong>Precio:</strong> ${inmueble.precio_mensual} / mes</p>
      <p><strong>Estado:</strong> {inmueble.disponible ? 'Disponible' : 'Alquilado'}</p>
    </div>
  );
}

export default InmuebleDetailPage;