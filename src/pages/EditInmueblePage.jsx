// src/pages/EditInmueblePage.jsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditInmueblePage() {
    // 1. Hooks necesarios
    const { id } = useParams(); // Obtiene el ID del inmueble desde la URL
    const { token } = useContext(AuthContext); // Token para la autenticación
    const navigate = useNavigate(); // Para redirigir después de editar

    // 2. Estado para el formulario, carga y errores
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio_mensual: '',
        direccion: '',
        disponible: true // Asumimos un valor por defecto
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 3. useEffect para CARGAR los datos del inmueble
    useEffect(() => {
        const fetchInmueble = async () => {
            try {
                // Hacemos un fetch a la ruta PÚBLICA para obtener los datos
                const response = await fetch(`http://localhost:3000/api/inmuebles/${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar la información del inmueble.');
                }
                const data = await response.json();

                // Rellenamos el formulario con los datos existentes
                setFormData({
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    precio_mensual: data.precio_mensual,
                    direccion: data.direccion,
                    disponible: data.disponible // ¡Este campo lo vimos en tu controller!
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInmueble();
    }, [id]); // Se ejecuta cada vez que el ID de la URL cambia

    // 4. Manejador de cambios del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            // Manejo especial para checkboxes
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // 5. Manejador para ENVIAR la actualización (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/api/inmuebles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ¡Autenticación necesaria!
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json();
                // El backend ya valida que solo el propietario puede editar
                throw new Error(errData.message || 'Error al actualizar el inmueble');
            }

            // ¡Éxito! Redirigimos de vuelta a la lista
            navigate('/mis-inmuebles');

        } catch (err) {
            setError(err.message);
        }
    };

    // --- Renderizado ---
    if (loading) {
        return <div>Cargando datos del inmueble...</div>;
    }

    return (
        <div>
            <h2>Editar Inmueble</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>
                <div>
                    <label>Precio Mensual (COP):</label>
                    <input type="number" name="precio_mensual" value={formData.precio_mensual} onChange={handleChange} required />
                </div>
                <div>
                    <label>Estado:</label>
                    <select name="disponible" value={formData.disponible} onChange={handleChange}>
                        <option value="true">Disponible</option>
                        <option value="false">Alquilado (No Disponible)</option>
                    </select>
                </div>

                <button type="submit">Actualizar Inmueble</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default EditInmueblePage;