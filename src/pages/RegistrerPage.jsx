// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importa los nuevos estilos
import styles from '../styles/Forms.module.css';

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

  // Esta función ya es perfecta, maneja todos los campos
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Esta función ya es perfecta, envía todo el 'formData'
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

  // 2. Aplicamos los estilos al JSX
  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nombre:</label>
          <input type="text" name="primer_nombre" onChange={handleChange} className={styles.formInput} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Apellido:</label>
          <input type="text" name="primer_apellido" onChange={handleChange} className={styles.formInput} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email:</label>
          <input type="email" name="email" onChange={handleChange} className={styles.formInput} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Contraseña:</label>
          <input type="password" name="password" onChange={handleChange} className={styles.formInput} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Quiero registrarme como:</label>
          <select name="rol" value={formData.rol} onChange={handleChange} className={styles.formInput}>
            <option value="arrendatario">Inquilino (Busco arriendo)</option>
            <option value="arrendador">Propietario (Ofrezco arriendo)</option>
          </select>
        </div>

        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.formButton}>Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;