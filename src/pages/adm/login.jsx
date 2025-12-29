import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import '../../app.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInputRef = useRef(null);

  useEffect(() => {
    if (userInputRef.current) {
      userInputRef.current.focus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userTrimmed = username.trim().toLowerCase();
    const emailLogin = userTrimmed.includes('@') ? userTrimmed : `${userTrimmed}@tiendacamila.com`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: emailLogin, 
        password: password 
      });

      if (error) {
        alert("Acceso denegado: Usuario o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('username, permisos')
        .eq('id', data.user.id)
        .single();

      if (perfilError) {
        alert("Error al cargar los permisos.");
        setLoading(false);
        return;
      }

      localStorage.setItem('userName', perfil.username || userTrimmed);
      localStorage.setItem('userPermisos', JSON.stringify(perfil.permisos || {}));
      
      setLoading(false);
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-branding">
        <div className="logo-circle">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="logo-img" 
            onError={(e) => e.target.src='https://via.placeholder.com/120?text=LOGO'} 
          />
        </div>
        <h1>Tienda Camila</h1>
        <p>Ahorro y Variedad</p>
      </div>

      <div className="login-form-area">
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <input type="text" name="username" autoComplete="username" tabIndex="-1" />
          <input type="password" name="password" autoComplete="current-password" tabIndex="-1" />
        </div>

        <form 
          onSubmit={handleLogin} 
          className="login-form" 
          id="form_acceso" 
          autoComplete="off"
        >
          <h2 style={{ color: '#102A43', marginBottom: '30px', textAlign: 'center' }}>Control de Acceso</h2>
          
          <div className="input-group">
            <label>Usuario</label>
            <input 
              ref={userInputRef}
              type="text"
              inputMode="text"
              name="field_user_login"
              className="input-field"
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="off"
              enterKeyHint="go"
              required 
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password"
              name="field_pass_login"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-ingresar" 
            disabled={loading}
          >
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