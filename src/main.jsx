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
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- IMPORTA GUARDIA
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';
import CreateInmueblePage from './pages/CreateInmueblePage.jsx';
import MyInmueblesPage from './pages/MyInmueblesPage.jsx';
import EditInmueblePage from './pages/EditInmueblePage.jsx';
import MyFavoritesPage from './pages/MyFavoritesPage.jsx';

// Aquí definimos todas las rutas de nuestra aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El componente principal o "layout"
    children: [
      { index: true, element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/inmueble/:id', element: <InmuebleDetailPage /> },

      // --- Rutas para CUALQUIER usuario conectado ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          // --- 2. AÑADE LA RUTA DE FAVORITOS (PROTEGIDA) ---
          // La ponemos aquí porque el 'arrendatario' también pasa por 'ProtectedRoute'
          { path: '/mis-favoritos', element: <MyFavoritesPage /> }
          // (Nota: RoleProtectedRoute no es necesario si ProtectedRoute ya cubre arrendatarios)
          // (Para ser más estrictos, la moveremos)
        ]
      },

      // --- Rutas SOLO para 'arrendatario' ---
      // (¡Es mejor mover 'mis-favoritos' aquí para ser explícitos!)
      {
        element: <RoleProtectedRoute allowedRole="arrendatario" />,
        children: [
          { path: '/mis-favoritos', element: <MyFavoritesPage /> }
        ]
      },

      // --- Rutas SOLO para 'arrendador' ---
      {
        element: <RoleProtectedRoute allowedRole="arrendador" />,
        children: [
          { path: '/crear-inmueble', element: <CreateInmueblePage /> },
          { path: '/mis-inmuebles', element: <MyInmueblesPage /> },
          { path: '/mis-inmuebles/editar/:id', element: <EditInmueblePage /> }
        ]
      },

    ],
  },
]);

// ... (tu ReactDOM.createRoot sin cambios)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);