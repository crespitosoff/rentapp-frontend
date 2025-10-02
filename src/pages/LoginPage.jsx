import { useState } from 'react';

function LoginPage() {
  // 1. Creamos estados para guardar el email y la contraseña que el usuario escribe.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Un estado para guardar mensajes de error.

  // 2. Esta función se ejecutará cuando el usuario envíe el formulario.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario.
    setError(''); // Limpiamos cualquier error anterior.

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
      
      // Si el login es exitoso, recibimos el token.
      console.log('Login exitoso, token:', data.token);
      // Por ahora, solo lo mostramos en la consola. Más adelante lo guardaremos.

    } catch (err) {
      // Si hay un error, lo guardamos en el estado para mostrarlo al usuario.
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {/* 5. Estructura del formulario en JSX */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {/* Mostramos el mensaje de error si existe */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;