import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './app.css'; 
import Login from './pages/adm/login';
import Usuarios from './pages/adm/usuarios';

// --- COMPONENTE RELOJ Y USUARIO ---
const UserHeader = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const userName = localStorage.getItem('userName') || "Admin";

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      padding: '10px 25px', 
      background: '#fff', 
      borderBottom: '1px solid #D1D9E0',
      gap: '20px',
      fontSize: '14px',
      color: '#102A43'
    }}>
      <span style={{ fontWeight: 'bold' }}>👤 Usuario: <span style={{ color: '#FF6B00' }}>{userName}</span></span>
      <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '20px', color: '#627D98' }}>📅 {dateTime.toLocaleDateString()}</span>
      <span style={{ fontWeight: 'bold' }}>🕒 {dateTime.toLocaleTimeString()}</span>
    </div>
  );
};

// --- DISEÑO DEL SISTEMA (Sidebar con Filtro de Permisos y Supervison de Admin) ---
const AppLayout = ({ children }) => {
  const userName = localStorage.getItem('userName') || "";
  const permisosRaw = localStorage.getItem('userPermisos');
  const permisos = permisosRaw ? JSON.parse(permisosRaw) : {};

  // REGLA DE ORO: Si el usuario se llama "admin", tiene acceso a todo.
  const esAdmin = userName.toLowerCase() === 'admin';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ width: '280px', background: '#102A43', color: 'white', overflowY: 'auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
           <h2 style={{ color: '#FF6B00', margin: 0, fontSize: '22px' }}>Tienda Camila</h2>
           <small style={{ opacity: 0.7 }}>{esAdmin ? 'Panel de Control Admin' : 'Panel de Control'}</small>
        </div>
        
        <nav>
          {/* SECCIÓN ADMINISTRACIÓN - Visible si es admin o tiene permiso 'adm' */}
          {(esAdmin || permisos.adm) && (
            <>
              <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', marginBottom: '10px', marginTop: '20px' }}>ADMINISTRACIÓN</p>
              <Link to="/adm02" className="nav-link-custom">adm02 - Usuarios y Permisos</Link>
              <Link to="/adm03" className="nav-link-custom">adm03 - Clientes</Link>
            </>
          )}

          {/* SECCIÓN INVENTARIOS - Visible si es admin o tiene permiso 'inv' */}
          {(esAdmin || permisos.inv) && (
            <>
              <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', marginBottom: '10px', marginTop: '20px' }}>INVENTARIOS</p>
              <Link to="/inv01" className="nav-link-custom">inv01 - Productos / Stock</Link>
              <Link to="/inv02" className="nav-link-custom">inv02 - Movimientos</Link>
            </>
          )}

          {/* SECCIÓN COMPRAS - Visible si es admin o tiene permiso 'com' */}
          {(esAdmin || permisos.com) && (
            <>
              <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', marginBottom: '10px', marginTop: '20px' }}>COMPRAS</p>
              <Link to="/com01" className="nav-link-custom">com01 - Nueva Compra</Link>
            </>
          )}

          {/* SECCIÓN VENTAS - Visible si es admin o tiene permiso 'ven' */}
          {(esAdmin || permisos.ven) && (
            <>
              <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', marginBottom: '10px', marginTop: '20px' }}>VENTAS Y CAJA</p>
              <Link to="/ven01" className="nav-link-custom">ven01 - Realizar Venta</Link>
              <Link to="/ven02" className="nav-link-custom">ven02 - Historial de Caja</Link>
            </>
          )}

          {/* SECCIÓN REPORTES Y DEVOLUCIONES - Visible si es admin o tiene 'dev' o 'rep' */}
          {(esAdmin || permisos.dev || permisos.rep) && (
            <>
              <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', marginBottom: '10px', marginTop: '20px' }}>REPORTES Y DEVOLUCIONES</p>
              {(esAdmin || permisos.dev) && <Link to="/dev01" className="nav-link-custom">dev01 - Devoluciones</Link>}
              {(esAdmin || permisos.rep) && <Link to="/rep01" className="nav-link-custom">rep01 - Reportes Generales</Link>}
            </>
          )}
          
          {/* BOTÓN CERRAR SESIÓN */}
          <div style={{ marginTop: '40px', borderTop: '1px solid #243B53', paddingTop: '20px' }}>
            <Link to="/" onClick={() => localStorage.clear()} style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 'bold' }}>CERRAR SESIÓN</Link>
          </div>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <UserHeader />
        <main style={{ flex: 1, background: '#F0F4F8', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Componente provisional para módulos que todavía no tienen archivo .jsx
const EnDesarrollo = ({ nombre }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2 style={{ color: '#102A43' }}>Módulo: {nombre}</h2>
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', display: 'inline-block' }}>
      <p style={{ color: '#627D98' }}>👷 El archivo para este módulo aún no ha sido creado.</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={
          <AppLayout>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h1 style={{ color: '#102A43' }}>Bienvenido al Sistema</h1>
              <p>Usa el menú lateral para navegar por las áreas permitidas.</p>
            </div>
          </AppLayout>
        } />

        <Route path="/adm02" element={<AppLayout><Usuarios /></AppLayout>} />
        <Route path="/adm03" element={<AppLayout><EnDesarrollo nombre="Clientes" /></AppLayout>} />
        <Route path="/inv01" element={<AppLayout><EnDesarrollo nombre="Productos" /></AppLayout>} />
        <Route path="/inv02" element={<AppLayout><EnDesarrollo nombre="Movimientos" /></AppLayout>} />
        <Route path="/com01" element={<AppLayout><EnDesarrollo nombre="Compras" /></AppLayout>} />
        <Route path="/ven01" element={<AppLayout><EnDesarrollo nombre="Ventas" /></AppLayout>} />
        <Route path="/ven02" element={<AppLayout><EnDesarrollo nombre="Caja" /></AppLayout>} />
        <Route path="/dev01" element={<AppLayout><EnDesarrollo nombre="Devoluciones" /></AppLayout>} />
        <Route path="/rep01" element={<AppLayout><EnDesarrollo nombre="Reportes" /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
