import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './app.css'; // IMPORTANTE: Conexión con tus estilos naranja/azul
import Login from './pages/adm/login';

// --- COMPONENTE PARA VISTA DE MÓDULOS ---
const ModuleView = ({ id, title, process, details }) => (
  <div style={{ padding: '25px' }}>
    <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <header style={{ borderBottom: '2px solid #f0f4f8', marginBottom: '20px', paddingBottom: '10px' }}>
        <span style={{ background: '#FF6B00', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{id}</span>
        <h1 style={{ margin: '15px 0', color: '#102A43' }}>{title}</h1>
      </header>
      <p style={{ color: '#334E68', fontSize: '16px' }}><strong>Descripción:</strong> {process}</p>
      <div style={{ background: '#F0F4F8', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
        <strong style={{ color: '#102A43' }}>Elementos de Escalabilidad:</strong>
        <p style={{ fontStyle: 'italic', color: '#627D98', marginTop: '5px' }}>{details}</p>
      </div>
      <div style={{ marginTop: '25px', color: '#FF6B00', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '10px', height: '10px', background: '#FF6B00', borderRadius: '50%', marginRight: '10px' }}></span>
        Estado: DESARROLLO PENDIENTE
      </div>
    </div>
  </div>
);

// --- DISEÑO DEL SISTEMA (Layout con colores Naranja/Azul) ---
const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    {/* SIDEBAR PROFESIONAL */}
    <aside style={{ width: '280px', background: '#102A43', color: 'white', overflowY: 'auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
         <h2 style={{ color: '#FF6B00', margin: 0, fontSize: '22px' }}>Tienda Camila</h2>
         <small style={{ opacity: 0.7 }}>Panel de Control</small>
      </div>
      <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', marginBottom: '20px' }} />
      
      <nav>
        <ModuleGroup title="ADMINISTRACIÓN (madm01)">
          <MenuLink to="/adm02" label="adm02 - Permisos" />
          <MenuLink to="/adm03" label="adm03 - Clientes" />
        </ModuleGroup>

        <ModuleGroup title="INVENTARIO (minv02)">
          <MenuLink to="/inv01" label="inv01 - Ubicaciones" />
          <MenuLink to="/inv02" label="inv02 - Productos" />
          <MenuLink to="/inv03" label="inv03 - Mov. Stock" />
        </ModuleGroup>

        <ModuleGroup title="COMPRAS (mcom03)">
          <MenuLink to="/com01" label="com01 - Proveedores" />
          <MenuLink to="/com02" label="com02 - Registro Compra" />
          <MenuLink to="/com03" label="com03 - Pagos Prov." />
        </ModuleGroup>

        <ModuleGroup title="VENTAS (mven04)">
          <MenuLink to="/ven01" label="ven01 - Caja" />
          <MenuLink to="/ven02" label="ven02 - TPV" />
          <MenuLink to="/ven03" label="ven03 - Créditos" />
        </ModuleGroup>

        <ModuleGroup title="DEVOLUCIONES (mdev05)">
          <MenuLink to="/dev01" label="dev01 - Devoluciones" />
        </ModuleGroup>

        <ModuleGroup title="REPORTES (mrep06)">
          <MenuLink to="/rep01" label="rep01 - Ventas" />
          <MenuLink to="/rep02" label="rep02 - Stock Mínimo" />
          <MenuLink to="/rep03" label="rep03 - Auditoría" />
          <MenuLink to="/rep04" label="rep04 - Cuentas x Cobrar" />
          <MenuLink to="/rep05" label="rep05 - Cuentas x Pagar" />
        </ModuleGroup>
      </nav>

      <div style={{ marginTop: '40px', padding: '10px', background: 'rgba(255,107,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>CERRAR SESIÓN</Link>
      </div>
    </aside>

    {/* ÁREA DE CONTENIDO */}
    <main style={{ flex: 1, background: '#F0F4F8', overflowY: 'auto' }}>
      {children}
    </main>
  </div>
);

// --- COMPONENTES AUXILIARES DE NAVEGACIÓN ---
const ModuleGroup = ({ title, children }) => (
  <div style={{ marginBottom: '25px' }}>
    <p style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px', marginBottom: '10px' }}>{title}</p>
    {children}
  </div>
);

const MenuLink = ({ to, label }) => (
  <Link to={to} className="nav-link-custom">
    {label}
  </Link>
);

// --- RENDERIZADO DE RUTAS ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta inicial: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Dashboard Principal */}
        <Route path="/dashboard" element={<AppLayout>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1 style={{ color: '#102A43' }}>Bienvenida, Camila</h1>
            <p style={{ color: '#627D98' }}>Selecciona un módulo en el menú lateral para comenzar.</p>
          </div>
        </AppLayout>} />

        {/* --- RUTAS AUTOMATIZADAS --- */}
        <Route path="/adm02" element={<AppLayout><ModuleView id="adm02" title="Crear Login / Permisos" process="Creación, gestión de usuarios, roles y sucursales." details="Matriz detallada de Permisos por usuario." /></AppLayout>} />
        <Route path="/adm03" element={<AppLayout><ModuleView id="adm03" title="Gestión de Clientes" process="Registro de datos de clientes y saldos pendientes." details="Historial de compras ligado al CRM." /></AppLayout>} />
        
        <Route path="/inv01" element={<AppLayout><ModuleView id="inv01" title="Registro de Ubicaciones" process="Definir stock físico (Depósito, Sala Ventas, Almacén B)." details="Diferenciación de stock por sucursal física." /></AppLayout>} />
        <Route path="/inv02" element={<AppLayout><ModuleView id="inv02" title="Registro de Productos" process="Formulario de datos, precios y codificación interna." details="Control estricto de Lotes (FIFO)." /></AppLayout>} />
        <Route path="/inv03" element={<AppLayout><ModuleView id="inv03" title="Movimiento de Stock" process="Mover unidades entre ubicaciones o sucursales." details="Auditoría automática de movimientos." /></AppLayout>} />

        <Route path="/com01" element={<AppLayout><ModuleView id="com01" title="Gestión de Proveedores" process="Base de datos de proveedores y condiciones de crédito." details="Centralización de contactos comerciales." /></AppLayout>} />
        <Route path="/com02" element={<AppLayout><ModuleView id="com02" title="Registro de Compra" process="Ingreso de facturas de compra, costos e impuestos." details="Incremento automático de stock y lotes." /></AppLayout>} />
        <Route path="/com03" element={<AppLayout><ModuleView id="com03" title="Gestión de Pagos" process="Rastreo y registro de pagos realizados a proveedores." details="Control de cuentas por pagar." /></AppLayout>} />

        <Route path="/ven01" element={<AppLayout><ModuleView id="ven01" title="Caja" process="Apertura, cierre y arqueo diario de efectivo." details="Reporte de diferencias ligado al cajero de turno." /></AppLayout>} />
        <Route path="/ven02" element={<AppLayout><ModuleView id="ven02" title="TPV" process="Punto de venta: escaneo de productos, descuentos y tickets." details="Venta rápida con lógica de stock FIFO." /></AppLayout>} />
        <Route path="/ven03" element={<AppLayout><ModuleView id="ven03" title="Créditos" process="Gestión de deuda de clientes (Cuentas por Cobrar)." details="Control de plazos de pago." /></AppLayout>} />

        <Route path="/dev01" element={<AppLayout><ModuleView id="dev01" title="Devoluciones" process="Registro de retorno de mercancía de clientes o a proveedores." details="Ajuste automático de inventario y notas de crédito." /></AppLayout>} />

        <Route path="/rep01" element={<AppLayout><ModuleView id="rep01" title="Reporte Ventas" process="Resumen de ingresos filtrado por fecha, vendedor o sucursal." details="Cálculo de margen de ganancia real." /></AppLayout>} />
        <Route path="/rep02" element={<AppLayout><ModuleView id="rep02" title="Stock Mínimo" process="Listado de productos bajo el umbral de seguridad." details="Sugerencia de pedido automático." /></AppLayout>} />
        <Route path="/rep03" element={<AppLayout><ModuleView id="rep03" title="Auditoría" process="Registro inmutable de acciones críticas en el sistema." details="Seguridad de datos ante fraudes." /></AppLayout>} />
        <Route path="/rep04" element={<AppLayout><ModuleView id="rep04" title="Cuentas x Cobrar" process="Reporte detallado de deudas de clientes." details="Alertas de mora y antigüedad." /></AppLayout>} />
        <Route path="/rep05" element={<AppLayout><ModuleView id="rep05" title="Cuentas x Pagar" process="Reporte de compromisos financieros con proveedores." details="Proyección de flujo de caja." /></AppLayout>} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);