// src/pages/CreateInmueblePage.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function CreateInmueblePage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Estado para los campos de TEXTO
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    precio_mensual: '',
  });
  // 2. Estado SEPARADO para el ARCHIVO
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');

  // 3. Manejador para los campos de TEXTO
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Manejador para el campo de ARCHIVO
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // 5. handleSubmit totalmente REESCRITO para FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imagen) {
      setError('Debes seleccionar una imagen para el inmueble.');
      return;
    }

    // 6. Creamos un objeto FormData
    const dataToSend = new FormData();

    // 7. Añadimos todos los campos de texto
    dataToSend.append('titulo', formData.titulo);
    dataToSend.append('descripcion', formData.descripcion);
    dataToSend.append('direccion', formData.direccion);
    dataToSend.append('precio_mensual', formData.precio_mensual);

    // 8. Añadimos el archivo. 'imagen' debe coincidir con upload.single('imagen') en la ruta
    dataToSend.append('imagen', imagen);

    try {
      // 9. Hacemos el fetch con FormData
      const response = await fetch('http://localhost:3000/api/inmuebles', {
        method: 'POST',
        headers: {
          // NO pongas 'Content-Type': 'application/json'
          // El navegador lo pondrá como 'multipart/form-data' automáticamente
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend, // Enviamos el objeto FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el inmueble');
      }

      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  // 10. El formulario AHORA incluye un input type="file"
  return (
    <div>
      <h2>Publicar un Nuevo Inmueble</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input type="text" name="titulo" onChange={handleChange} required />
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
        {/* --- NUEVO CAMPO DE IMAGEN --- */}
        <div>
          <label>Imagen Principal:</label>
          <input type="file" name="imagen" onChange={handleImageChange} accept="image/*" required />
        </div>

        <button type="submit">Publicar Inmueble</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateInmueblePage;