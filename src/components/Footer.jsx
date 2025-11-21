import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#2c3e50', // Un gris oscuro elegante
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    marginTop: 'auto', // Esto empuja el footer al fondo si hay poco contenido
    width: '100%'
  };

  return (
    <footer style={footerStyle}>
      <div>
        <h3>RentApp</h3>
        <p>Encuentra tu espacio, vive tu vida.</p>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
        &copy; {new Date().getFullYear()} RentApp. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;