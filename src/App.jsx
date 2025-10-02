import { Link, Outlet } from 'react-router-dom';

function App() {
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
        <Link to="/login">Login</Link>
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