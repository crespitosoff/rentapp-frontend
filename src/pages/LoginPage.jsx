import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// 1. Importa los nuevos estilos
import styles from '../styles/Forms.module.css';

function LoginPage() {
  // 1. Creamos estados para guardar el email y la contraseña que el usuario escribe.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Un estado para guardar mensajes de error.

  const { login } = useContext(AuthContext); // <-- 4. Obtenemos la función login del contexto
  const navigate = useNavigate();// <-- 5. Hook para redirigir

  // 2. Esta función se ejecutará cuando el usuario envíe el formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 3. Hacemos la petición POST a nuestro endpoint de login en el backend.
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 4. Verificamos si la respuesta del backend fue exitosa.
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // 6. Usamos nuestras nuevas funciones
      // ¡Añadimos 'await' para esperar que el login (y el fetch de favoritos) termine!
      await login(data.token, data.rol);
      navigate('/'); // Redirigimos al usuario a la página de inicio

    } catch (err) {
      // Si hay un error, lo guardamos en el estado para mostrarlo al usuario.
      setError(err.message);
    }
  };

  // 2. Aplicamos los estilos al JSX
  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>
        {/* Mostramos el mensaje de error si existe */}
        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.formButton}>Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;