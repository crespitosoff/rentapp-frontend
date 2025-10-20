import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegistrerPage.jsx';
import './index.css';

// Aquí definimos todas las rutas de nuestra aplicación
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El componente principal o "layout"
    children: [
      // ... (rutas de home y login)
      {
        index: true, // Esto hace que sea la ruta por defecto (HomePage)
        element: <HomePage />,
      },
      {
        path: '/login', // Cuando el usuario vaya a /login...
        element: <LoginPage />, // ...mostramos el componente LoginPage.
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
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