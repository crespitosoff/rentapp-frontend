import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext(null);

// --- FUNCIÓN HELPER PARA EVITAR LLAMADAS MÚLTIPLES ---
// (La definimos fuera para que no se re-cree)
const fetchUserFavorites = async (token) => {
  try {
    const response = await fetch('http://localhost:3000/api/favoritos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      // Si el token es inválido o expiró, el backend dará error
      // Devolvemos un array vacío en lugar de crashear
      console.error('No se pudo cargar favoritos, token inválido o expirado.');
      return [];
    }
    const data = await response.json();
    return data; // Devuelve la lista de objetos de inmuebles favoritos
  } catch (error) {
    console.error('Error en fetchUserFavorites:', error);
    return [];
  }
};

// 2. Creamos el "proveedor" del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // --- NUEVO ESTADO PARA FAVORITOS ---
  const [favoritos, setFavoritos] = useState([]); // Guardará la lista de inmuebles

  // Efecto para cargar el token desde localStorage al iniciar la app
  useEffect(() => {
    const loadAppData = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedRol = localStorage.getItem('authRol');

      try {
        if (storedToken && storedRol) {
          setToken(storedToken);
          setRol(storedRol);
          // ¡Si tenemos token, cargamos los favoritos!
          if (storedRol === 'arrendatario') {
            const userFavs = await fetchUserFavorites(storedToken);
            setFavoritos(userFavs);
          }
        }
      } catch (error) {
        console.error("Error al leer localStorage", error);
      }
      setIsLoading(false);
    };
    loadAppData();
  }, []); // Se ejecuta solo una vez al inicio

  // 3. Actualiza el LOGIN para aceptar y guardar el rol Y CARGAR FAVORITOS
  const login = async (newToken, newRol) => {
    setToken(newToken);
    setRol(newRol);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authRol', newRol);

    // Después de loguear, carga los favoritos
    if (newRol === 'arrendatario') {
      const userFavs = await fetchUserFavorites(newToken);
      setFavoritos(userFavs);
    }
  };

  // 4. Actualiza el LOGOUT para limpiar el rol Y LOS FAVORITOS
  const logout = () => {
    setToken(null);
    setRol(null);
    setFavoritos([]); // <-- LIMPIA LOS FAVORITOS
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRol');
  };

  // --- NUEVAS FUNCIONES DE GESTIÓN DE FAVORITOS ---
  const addFavorito = async (inmueble) => {
    if (!token) return; // Doble chequeo
    try {
      const response = await fetch('http://localhost:3000/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inmueble_id: inmueble.inmueble_id })
      });
      if (!response.ok) throw new Error('Error en el servidor');

      // Actualiza el estado local INMEDIATAMENTE
      setFavoritos(prevFavoritos => [...prevFavoritos, inmueble]);
    } catch (err) {
      console.error("Error al añadir favorito:", err);
    }
  };

  const removeFavorito = async (inmuebleId) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:3000/api/favoritos/${inmuebleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error en el servidor');

      // Actualiza el estado local INMEDIATAMENTE
      setFavoritos(prevFavoritos =>
        prevFavoritos.filter(inm => inm.inmueble_id !== inmuebleId)
      );
    } catch (err) {
      console.error("Error al quitar favorito:", err);
    }
  };
  // --- FIN DE NUEVAS FUNCIONES ---

  // 5. Expone TODO al resto de la app
  return (
    <AuthContext.Provider value={{
      token,
      rol,
      login,
      logout,
      isLoading,
      favoritos,
      addFavorito,
      removeFavorito
    }}>
      {children}
    </AuthContext.Provider>
  );
};