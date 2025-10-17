import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  //OBTÉN el token y la función logout del contexto
  const { token, logout } = useContext(AuthContext);

  // Estilos en línea simples para la barra de navegación
  const navStyle = {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    paddingBottom: '2rem',
    borderBottom: '1px solid #555',
    marginBottom: '2rem',
  };

  return (
    <div>
      {/* Barra de Navegación */}
      <nav style={navStyle}>
        <Link to="/">Inicio</Link>
        {/* LÓGICA CONDICIONAL */}
        {token ? (
          // Si hay un token (usuario ha iniciado sesión)...
          <button onClick={logout}>Logout</button>
        ) : (
          // Si NO hay un token...
          <Link to="/login">Login</Link>
        )}
        {/* Aquí añadiremos más enlaces después */}
      </nav>

      {/* Contenido de la página actual */}
      <main>
        <Outlet /> {/* <-- Aquí se renderizarán HomePage, LoginPage, etc. */}
      </main>
    </div>
  );
}

export default App;