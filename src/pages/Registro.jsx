import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const navigate = useNavigate();

  const registrarUsuario = async (e) => {
    e.preventDefault();
    
    // Insertamos en la tabla de Supabase
    const { error } = await supabase
      .from('usuarios')
      .insert([{ usuario: nuevoUsuario, contraseña: nuevaClave }]);

    if (error) {
      alert("Hubo un error: " + error.message);
    } else {
      alert("¡Usuario registrado correctamente!");
      navigate('/'); // Nos regresa al Login automáticamente
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>Configuración de Usuarios</h2>
      <p>Ingresa los datos del nuevo empleado o administrador</p>

      <form onSubmit={registrarUsuario} style={{ display: 'inline-block', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
        <label>Nombre de Usuario:</label><br/>
        <input 
          type="text" 
          value={nuevoUsuario}
          onChange={(e) => setNuevoUsuario(e.target.value)} 
          style={{ padding: '10px', marginBottom: '15px', width: '250px' }}
          required
        /><br />

        <label>Contraseña:</label><br/>
        <input 
          type="password" 
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)} 
          style={{ padding: '10px', marginBottom: '20px', width: '250px' }}
          required
        /><br />

        {/* CONTENEDOR DE BOTONES */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Guardar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registro;