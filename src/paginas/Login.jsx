import React, { useState } from 'react';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');

  const manejarIngreso = (e) => {
    e.preventDefault();
    console.log("Intentando entrar con:", usuario);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Tienda Camila</h1>
      <h2>Ingreso al Sistema (adm01)</h2>
      <form onSubmit={manejarIngreso}>
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          onChange={(e) => setUsuario(e.target.value)} 
        /><br /><br />
        <input 
          type="password" 
          placeholder="Contraseña" 
          onChange={(e) => setClave(e.target.value)} 
        /><br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;