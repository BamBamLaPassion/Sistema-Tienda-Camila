import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import '../../app.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Limpiamos el nombre de usuario (quita espacios y pone minúsculas)
    const userTrimmed = username.trim().toLowerCase();
    
    // 2. Si no escribiste un correo, le agregamos el dominio de tu tienda automáticamente
    const emailLogin = userTrimmed.includes('@') 
      ? userTrimmed 
      : `${userTrimmed}@tiendacamila.com`;

    console.log("Intentando conectar con:", emailLogin);

    try {
      // 3. Intento de conexión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: emailLogin, 
        password: password 
      });

      if (error) {
        // Mostrar el objeto de error completo en consola para depurar
        console.error("Error de Supabase:", error);
        // Mensajes más precisos según el código de error
        if (error.status === 400) {
          alert("Acceso denegado: Usuario o contraseña incorrectos.");
        } else {
          alert(`Error de conexión: ${error.message || 'revisa la consola'}`);
        }
        setLoading(false);
        return;
      } else {
        // --- AQUÍ SE GUARDA EL NOMBRE PARA EL HEADER ---
        // Guardamos el nombre que escribiste en el cuadro de "Usuario"
        localStorage.setItem('userName', userTrimmed);
        
        // Si todo sale bien, vamos al dashboard
        console.log("¡Ingreso exitoso!", data);
        setLoading(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error inesperado en el sistema:", err);
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* SECCIÓN IZQUIERDA: Identidad Visual */}
      <div className="login-branding">
        <div className="logo-circle">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="logo-img" 
            onError={(e) => e.target.src='https://via.placeholder.com/120?text=LOGO'} 
          />
        </div>
        <h1>Sistema Camila</h1>
        <p>Gestión y Seguridad Comercial</p>
      </div>

      {/* SECCIÓN DERECHA: Formulario de Entrada */}
      <div className="login-form-area">
        <form onSubmit={handleLogin} className="login-form">
          <h2 style={{ color: '#102A43', marginBottom: '30px', textAlign: 'center' }}>Control de Acceso</h2>
          
          <div className="input-group">
            <label>Usuario</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-ingresar" disabled={loading}>
            {loading ? 'VERIFICANDO...' : 'INGRESAR AL SISTEMA'}
          </button>
          
          <p className="footer-text">
            © 2025 Tienda Comercial Camila<br/>
            Área restringida para personal autorizado.
          </p>
        </form>
      </div>
    </div>
  );
}