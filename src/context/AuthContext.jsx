import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext(null);

// 2. Creamos el "proveedor" del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // <-- AÑADE ESTADO PARA EL TOKEN
  const [rol, setRol] = useState(null); // <-- AÑADE ESTADO PARA EL ROL

  // ESTADO DE "CARGANDO"
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para cargar el token desde localStorage al iniciar la app
  useEffect(() => {
    // 2. Al cargar, lee AMBOS datos de localStorage
    const storedToken = localStorage.getItem('authToken');
    const storedRol = localStorage.getItem('authRol'); // <-- LEE EL ROL
    
    try {
      if (storedToken && storedRol) {
        setToken(storedToken);
        setRol(storedRol); // <-- ESTABLECE EL ROL
      }
    } catch (error) {
      console.error("Error al leer localStorage", error);
    }
    setIsLoading(false);
  }, []);

// 3. Actualiza el LOGIN para aceptar y guardar el rol
  const login = (newToken, newRol) => {
    setToken(newToken);
    setRol(newRol);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authRol', newRol); // <-- GUARDA EL ROL
  };

  // 4. Actualiza el LOGOUT para limpiar el rol
  const logout = () => {
    setToken(null);
    setRol(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRol'); // <-- LIMPIA EL ROL
  };

  // 5. Expone el ROL al resto de la app
  return (
    <AuthContext.Provider value={{ token, rol, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};