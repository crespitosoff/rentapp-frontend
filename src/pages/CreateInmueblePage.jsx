// src/pages/CreateInmueblePage.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // <-- 1. Importa el contexto

function CreateInmueblePage() {
  // 2. Trae el 'token' de tu contexto de autenticación
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. Estado para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    precio_mensual: '',
    num_habitaciones: '',
    num_baños: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ¡LA LLAMADA SEGURA A LA API!
      const response = await fetch('http://localhost:3000/api/inmuebles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Enviamos el token para la autenticación
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // El backend nos enviará un 403 (Prohibido) si el token es de un 'arrendatario'
        throw new Error(data.message || 'Error al crear el inmueble');
      }

      // 5. Si todo sale bien, redirige a la página de inicio (o a la del nuevo inmueble)
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  // 6. El formulario (puedes añadir más campos)
  return (
    <div>
      <h2>Publicar un Nuevo Inmueble</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input type-="text" name="titulo" onChange={handleChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="descripcion" onChange={handleChange}></textarea>
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" name="direccion" onChange={handleChange} required />
        </div>
        <div>
          <label>Precio Mensual (COP):</label>
          <input type="number" name="precio_mensual" onChange={handleChange} required />
        </div>

        <button type="submit">Publicar Inmueble</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateInmueblePage;