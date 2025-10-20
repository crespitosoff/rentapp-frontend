import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    primer_nombre: '',
    primer_apellido: '',
    email: '',
    password: '',
    rol: 'arrendatario', // Rol por defecto
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      // Si el registro es exitoso, redirige al login
      navigate('/login');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="primer_nombre" onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="primer_apellido" onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegisterPage;