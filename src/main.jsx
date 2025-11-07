import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegistrerPage.jsx';
import InmuebleDetailPage from './pages/InmuebleDetailPage.jsx';
import './index.css';
import ProfilePage from './pages/ProfilePage.jsx'; // <-- 1. IMPORTA PÁGINA
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- 2. IMPORTA GUARDIA
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'; // <-- 1. IMPORTA EL NUEVO
import CreateInmueblePage from './pages/CreateInmueblePage.jsx';

// Aquí definimos todas las rutas de nuestra aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El componente principal o "layout"
    children: [
      // ... (rutas públicas: home, login, register, detalle...)

      // --- Rutas para CUALQUIER usuario conectado ---
      {
        index: true, // Esto hace que sea la ruta por defecto (HomePage)
        element: <HomePage />,
      },
      {
        path: '/login', // Cuando el usuario vaya a /login...
        element: <LoginPage />, // ...mostramos el componente LoginPage.
      },

      // Esto es de la rama 'rutas-protegidas'
      {
        element: <ProtectedRoute />, // El guardia envuelve la/s página/s
        children: [
          {
            path: '/profile', // Cuando se pida /profile...
            element: <ProfilePage />, // ...se mostrará esta página (si pasa el guardia)
            // { path: '/mis-favoritos', element: <FavoritesPage /> }
          },
        ]
      },

      // --- Rutas SOLO para 'arrendador' ---
      {
        element: <RoleProtectedRoute allowedRole="arrendador" />, // <-- 2. USA EL NUEVO GUARDIA
        children: [
          {
            path: '/crear-inmueble',
            element: <CreateInmueblePage />,
          }
          // ... (ej: /mis-inmuebles)
        ]
      },

      // Esto es de la rama 'pagina-registro' (que ya está en main)
      {
        path: '/register',
        element: <RegisterPage />,
      },

      // Ruta dinámica para mostrar detalles de un inmueble
      // El ':id' le dice a React Router que esta parte de la URL es una variable
      {
        path: '/inmueble/:id',
        element: <InmuebleDetailPage />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. ENVOLVER LA APP */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);