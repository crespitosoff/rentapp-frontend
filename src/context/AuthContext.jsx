// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext(null);

// 2. Creamos el "proveedor" del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // ESTADO DE "CARGANDO"
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para cargar el token desde localStorage al iniciar la app
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.log("Error al leer localStorage", error);
    }
    // UNA VEZ QUE TERMINAMOS DE REVISAR, DEJAMOS DE CARGAR
    setIsLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  // Proveemos el valor (token y funciones) a los componentes hijos
  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};