import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import styles from './App.module.css'; // <-- 1. Importa el Módulo de CSS

function App() {
  //OBTÉN el token y la función logout del contexto
  const { token, rol, logout } = useContext(AuthContext);

  // 2. ¡Ya no necesitamos 'navStyle'! Lo borramos.

  return (
    <div className={styles.appContainer}> {/* 3. Usa la clase del contenedor principal */}

      {/* Barra de Navegación */}
      <nav className={styles.navbar}> {/* 4. Usa la clase de la barra */}

        {/* 5. Añadimos un Logo/Título */}
        <Link to="/" className={styles.navLogo}>
          RentApp
        </Link>

        {/* 6. Agrupamos los enlaces */}
        <div className={styles.navLinks}>
          {/* LÓGICA CONDICIONAL */}
          {token ? (
            // --- USUARIO LOGGEADO ---
            <>
              <Link to="/profile">Mi Perfil</Link>
              {/* 2. RENDERIZADO CONDICIONAL POR ROL */}
              {rol === 'arrendador' && (
                <>
                  <Link to="/crear-inmueble">Publicar Inmueble</Link>
                  <Link to="/mis-inmuebles">Mis Inmuebles</Link>
                </>
              )}

              {rol === 'arrendatario' && (
                <Link to="/mis-favoritos">Mis Favoritos</Link>
              )}

              <button onClick={logout}>Logout</button>
            </>
          ) : (
            // --- USUARIO DESCONECTADO ---
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      {/* Contenido de la página actual */}
      <main className={styles.mainContent}> {/* 7. Usa la clase del contenido */}
        <Outlet /> {/* <-- Aquí se renderizarán HomePage, LoginPage, etc. */}
      </main>
    </div>
  );
}

export default App;