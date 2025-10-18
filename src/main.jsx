import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import './index.css';
import ProfilePage from './pages/ProfilePage.jsx'; // <-- 1. IMPORTA PÁGINA
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- 2. IMPORTA GUARDIA

// Aquí definimos todas las rutas de nuestra aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El componente principal o "layout"
    children: [
      {
        index: true, // Esto hace que sea la ruta por defecto (HomePage)
        element: <HomePage />,
      },
      {
        path: '/login', // Cuando el usuario vaya a /login...
        element: <LoginPage />, // ...mostramos el componente LoginPage.
      },
      // Que no se me olvide añadir la ruta de registro aquí cuando la fusiones
      {
        element: <ProtectedRoute />, // El guardia envuelve la/s página/s
        children: [
          {
            path: '/profile', // Cuando se pida /profile...
            element: <ProfilePage />, // ...se mostrará esta página (si pasa el guardia)
          }
        ]
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