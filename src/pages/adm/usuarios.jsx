import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import '../../app.css';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    username: '', 
    full_name: '',
    email: '',
    phone1: '',
    phone2: '',
    address: '',
    password: '', 
    referencias: [
      { name: '', phone: '', address: '' },
      { name: '', phone: '', address: '' }
    ]
  };

  const [form, setForm] = useState(emptyForm);
  const [permisos, setPermisos] = useState({ adm: false, inv: false, com: false, ven: false, dev: false, rep: false });

  const modules = [
    { key: 'adm', label: 'Administración' },
    { key: 'inv', label: 'Inventarios' },
    { key: 'com', label: 'Compras' },
    { key: 'ven', label: 'Ventas / Caja' },
    { key: 'dev', label: 'Devoluciones' },
    { key: 'rep', label: 'Reportes' }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, username, email, full_name, phone1, phone2, address, referencias, permisos, active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al leer perfiles:', error);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel('realtime-perfiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'perfiles' }, () => {
        fetchUsers();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const handlePermChange = (key, checked) => {
    setPermisos({ ...permisos, [key]: checked });
  };

  const handleFormChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRefChange = (index, field, value) => {
    const refs = [...form.referencias];
    refs[index] = { ...refs[index], [field]: value };
    setForm({ ...form, referencias: refs });
  };

  const validateForm = () => {
    if (!form.full_name.trim()) return 'El nombre completo es obligatorio.';
    if (!form.username.trim()) return 'El nombre de usuario es obligatorio.';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Email no válido.';
    if (!form.phone1.trim()) return 'Teléfono 1 es obligatorio.';
    return null;
  };

  const handleCreateOrUpdate = async (e) => {
    e && e.preventDefault();
    const err = validateForm();
    if (err) return alert(err);

    setSaving(true);
    try {
      if (!editingId) {
        // Crear nuevo
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: form.email.toLowerCase().trim(),
          password: form.password || 'Temporal123!'
        });

        if (authError) throw authError;

        const { error: insError } = await supabase.from('perfiles').insert([{
          id: authData.user.id,
          username: form.username.trim().toLowerCase(),
          email: form.email.toLowerCase().trim(),
          full_name: form.full_name,
          phone1: form.phone1,
          phone2: form.phone2,
          address: form.address,
          referencias: form.referencias,
          permisos: permisos,
          active: true
        }]);
        if (insError) throw insError;
        alert('Usuario creado correctamente');
      } else {
        // Actualizar existente
        const { error: upError } = await supabase
          .from('perfiles')
          .update({
            username: form.username.trim().toLowerCase(),
            full_name: form.full_name,
            phone1: form.phone1,
            phone2: form.phone2,
            address: form.address,
            referencias: form.referencias,
            permisos: permisos,
            email: form.email
          })
          .eq('id', editingId);
        if (upError) throw upError;
        alert('Perfil actualizado');
      }
      setEditingId(null);
      setForm(emptyForm);
      setPermisos({ adm: false, inv: false, com: false, ven: false, dev: false, rep: false });
      fetchUsers();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      username: user.username || '',
      full_name: user.full_name || '',
      email: user.email || '',
      phone1: user.phone1 || '',
      phone2: user.phone2 || '',
      address: user.address || '',
      password: '',
      referencias: user.referencias || emptyForm.referencias
    });
    setPermisos(user.permisos || { adm: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#102A43' }}>{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
          <form onSubmit={handleCreateOrUpdate}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div>
                <label className="label">Usuario (Username)</label>
                <input className="input-field" value={form.username} onChange={(e) => handleFormChange('username', e.target.value)} required />
              </div>
              <div>
                <label className="label">Nombre completo</label>
                <input className="input-field" value={form.full_name} onChange={(e) => handleFormChange('full_name', e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} required />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <input type="text" className="input-field" value={form.password} onChange={(e) => handleFormChange('password', e.target.value)} placeholder="Solo nuevos" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <div>
                <label className="label">Teléfono 1</label>
                <input className="input-field" value={form.phone1} onChange={(e) => handleFormChange('phone1', e.target.value)} required />
              </div>
              <div>
                <label className="label">Teléfono 2</label>
                <input className="input-field" value={form.phone2} onChange={(e) => handleFormChange('phone2', e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="label">Dirección</label>
              <input className="input-field" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} />
            </div>

            <div style={{ marginTop: 16 }}>
              <h4>Permisos</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {modules.map(m => (
                  <label key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={permisos[m.key]} onChange={(e) => handlePermChange(m.key, e.target.checked)} /> {m.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-ingresar" style={{ marginTop: 20 }} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Datos'}
            </button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setForm(emptyForm);}} style={{ marginLeft: 10 }}>Cancelar</button>}
          </form>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8, height: '600px', overflowY: 'auto' }}>
          <h3>Lista de Usuarios</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: '12px', borderBottom: '2px solid #eee' }}>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 0', fontSize: '13px' }}>{u.username}</td>
                  <td style={{ fontSize: '13px' }}>{u.full_name}</td>
                  <td>
                    <button className="btn-link" onClick={() => handleEdit(u)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}