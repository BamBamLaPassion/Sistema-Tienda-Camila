import React, { useState } from 'react';
import { supabase } from '../../supabase';
import '../../app.css';

export default function RegistroUsuarios() {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    telefono: '',
    direccion: '',
    password: ''
  });

  const [permisos, setPermisos] = useState({
    adm: false, inv: false, com: false, ven: false, dev: false, rep: false
  });

  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    setPermisos({ ...permisos, [e.target.name]: e.target.checked });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Crear el acceso en Supabase Authentication
    // Usamos el nombre de usuario + @tienda.com para cumplir el requisito de email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${formData.usuario.trim().toLowerCase()}@tienda.com`,
      password: formData.password,
    });

    if (authError) {
      alert("Error de Autenticación: " + authError.message);
      setLoading(false);
      return;
    }

    // 2. Guardar los datos extendidos en la tabla 'perfiles' vinculada por el ID
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('perfiles')
        .insert([
          { 
            id: authData.user.id, 
            username: formData.usuario.trim().toLowerCase(),
            full_name: formData.nombre, 
            phone: formData.telefono, 
            address: formData.direccion,
            permisos: permisos
          }
        ]);

      if (dbError) {
        alert("Usuario creado en Auth, pero error en Tabla Perfiles: " + dbError.message);
      } else {
        alert("¡ÉXITO! Usuario [" + formData.usuario + "] registrado oficialmente en el sistema.");
        
        // Limpiar el estado y el formulario
        setFormData({ nombre: '', usuario: '', telefono: '', direccion: '', password: '' });
        setPermisos({ adm: false, inv: false, com: false, ven: false, dev: false, rep: false });
        e.target.reset();
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#F0F4F8', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#102A43', margin: 0 }}>ADM02 - Registro de Personal</h1>
        <p style={{ color: '#627D98' }}>Alta de nuevos colaboradores y asignación de privilegios.</p>
      </header>

      <form onSubmit={crearUsuario} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* SECCIÓN 1: DATOS PERSONALES */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#FF6B00', marginTop: 0 }}>1. Ficha del Empleado</h3>
          
          <div className="input-group">
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Nombre Completo</label>
            <input type="text" className="input-field" placeholder="Ej: Juan Perez" 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          </div>

          <div className="input-group">
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Teléfono / WhatsApp</label>
            <input type="text" className="input-field" placeholder="Celular de contacto" 
              onChange={(e) => setFormData({...formData, telefono: e.target.value})} required />
          </div>

          <div className="input-group">
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Dirección Particular</label>
            <input type="text" className="input-field" placeholder="Domicilio actual" 
              onChange={(e) => setFormData({...formData, direccion: e.target.value})} required />
          </div>
        </div>

        {/* SECCIÓN 2: SEGURIDAD */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#FF6B00', marginTop: 0 }}>2. Credenciales de Acceso</h3>
          
          <div className="input-group">
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>ID de Usuario (Login)</label>
            <input type="text" className="input-field" placeholder="Ej: perez.ventas" 
              onChange={(e) => setFormData({...formData, usuario: e.target.value})} required />
          </div>

          <div className="input-group">
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Contraseña Temporal</label>
            <input type="password" className="input-field" placeholder="Mínimo 6 caracteres" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
        </div>

        {/* SECCIÓN 3: MATRIZ DE PERMISOS */}
        <div style={{ gridColumn: '1 / span 2', background: '#102A43', padding: '30px', borderRadius: '15px', color: 'white' }}>
          <h3 style={{ color: '#FF6B00', marginTop: 0, marginBottom: '20px' }}>3. Matriz de Permisos por Módulos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="adm" checked={permisos.adm} onChange={handleCheck} /> 
              Administración (ADM)
            </label>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="inv" checked={permisos.inv} onChange={handleCheck} /> 
              Inventarios (INV)
            </label>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="com" checked={permisos.com} onChange={handleCheck} /> 
              Compras (COM)
            </label>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="ven" checked={permisos.ven} onChange={handleCheck} /> 
              Ventas / Caja (VEN)
            </label>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="dev" checked={permisos.dev} onChange={handleCheck} /> 
              Devoluciones (DEV)
            </label>
            <label style={checkLabelStyle}>
              <input type="checkbox" name="rep" checked={permisos.rep} onChange={handleCheck} /> 
              Reportes (REP)
            </label>
          </div>
        </div>

        <button type="submit" className="btn-ingresar" style={{ gridColumn: '1 / span 2', height: '60px', fontSize: '18px' }} disabled={loading}>
          {loading ? 'GUARDANDO EN BASE DE DATOS...' : 'FINALIZAR REGISTRO Y ACTIVAR USUARIO'}
        </button>
      </form>
    </div>
  );
}

const checkLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  padding: '12px',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: '8px',
  fontSize: '14px',
  transition: 'background 0.3s'
};