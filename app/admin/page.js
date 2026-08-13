'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ICON_OPTIONS, ServiceIcon } from '../../components/icons';
import '../globals.css';
import './admin.css';

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'service', label: 'Especialidades' },
  { key: 'process', label: 'Proceso' },
  { key: 'curiosity', label: 'Curiosidades' },
  { key: 'gallery', label: 'Galería' },
];

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="admin-body admin-login">
        <p className="loading-text">Cargando…</p>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="admin-body admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">INCA · Panel</div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={'admin-nav-item' + (activeTab === t.key ? ' active' : '')}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">Ver sitio ↗</a>
          <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="admin-main">
        {activeTab === 'general' && <GeneralEditor />}
        {activeTab === 'service' && <BlockListEditor blockType="service" title="Especialidades" showIcon />}
        {activeTab === 'process' && <BlockListEditor blockType="process" title="Proceso" />}
        {activeTab === 'curiosity' && <BlockListEditor blockType="curiosity" title="Curiosidades" />}
        {activeTab === 'gallery' && <GalleryEditor />}
      </main>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError('Correo o contraseña incorrectos.');
  }

  return (
    <div className="admin-body admin-login">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <h1>Panel INCA</h1>
        <p className="sub">Inicia sesión para editar el sitio.</p>
        {error && <p className="admin-error">{error}</p>}
        <div className="field">
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-sm primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function GeneralEditor() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setForm(data || {}));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setStatus('Guardando…');
    const { id, updated_at, ...rest } = form;
    const { error } = await supabase.from('site_settings').update(rest).eq('id', 1);
    setStatus(error ? 'Error al guardar.' : 'Guardado ✓');
    setTimeout(() => setStatus(''), 2500);
  }

  if (!form) return <p className="loading-text">Cargando…</p>;

  return (
    <div>
      <h2>Datos generales</h2>
      <div className="admin-card">
        <div className="field">
          <label>Nombre de la empresa</label>
          <input type="text" value={form.company_name || ''} onChange={(e) => update('company_name', e.target.value)} />
        </div>
        <div className="field">
          <label>Frase / eslogan</label>
          <input type="text" value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
        </div>
        <div className="field">
          <label>Responsable</label>
          <input type="text" value={form.responsible_name || ''} onChange={(e) => update('responsible_name', e.target.value)} />
        </div>
        <div className="field">
          <label>Teléfono (para mostrar, ej. 722 396 87 75)</label>
          <input type="text" value={form.phone_display || ''} onChange={(e) => update('phone_display', e.target.value)} />
        </div>
        <div className="field">
          <label>WhatsApp (solo números, con código de país. Ej. 527223968775)</label>
          <input type="text" value={form.whatsapp_number || ''} onChange={(e) => update('whatsapp_number', e.target.value)} />
        </div>
        <div className="field">
          <label>Cobertura</label>
          <input type="text" value={form.coverage_text || ''} onChange={(e) => update('coverage_text', e.target.value)} />
        </div>
        <div className="field">
          <label>Título principal (portada)</label>
          <textarea value={form.hero_title || ''} onChange={(e) => update('hero_title', e.target.value)} />
        </div>
        <div className="field">
          <label>Subtítulo (portada)</label>
          <textarea value={form.hero_subtitle || ''} onChange={(e) => update('hero_subtitle', e.target.value)} />
        </div>
        <div className="admin-card-row">
          {status && <span className="admin-ok">{status}</span>}
          <button className="btn-sm primary" onClick={handleSave}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

function BlockListEditor({ blockType, title, showIcon }) {
  const [items, setItems] = useState(null);

  async function load() {
    const { data } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('block_type', blockType)
      .order('sort_order', { ascending: true });
    setItems(data || []);
  }

  useEffect(() => {
    load();
  }, [blockType]);

  function updateLocal(id, field, value) {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  async function handleSaveItem(item) {
    await supabase
      .from('content_blocks')
      .update({ title: item.title, body: item.body, icon_key: item.icon_key || null })
      .eq('id', item.id);
  }

  async function handleAdd() {
    const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    const { data, error } = await supabase
      .from('content_blocks')
      .insert({
        block_type: blockType,
        sort_order: nextOrder,
        title: 'Nuevo',
        body: '',
        icon_key: showIcon ? ICON_OPTIONS[0].key : null,
      })
      .select()
      .single();
    if (!error) setItems((list) => [...list, data]);
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este elemento?')) return;
    await supabase.from('content_blocks').delete().eq('id', id);
    setItems((list) => list.filter((it) => it.id !== id));
  }

  async function handleMove(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    const newItems = [...items];
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setItems(newItems);
    await Promise.all([
      supabase.from('content_blocks').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('content_blocks').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
  }

  if (!items) return <p className="loading-text">Cargando…</p>;

  return (
    <div>
      <h2>{title}</h2>
      {items.map((item, i) => (
        <div className="admin-card" key={item.id}>
          {showIcon && (
            <div className="field">
              <label>Ícono</label>
              <select value={item.icon_key || ''} onChange={(e) => updateLocal(item.id, 'icon_key', e.target.value)}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              <div style={{ width: 26, height: 26, marginTop: '.5rem', color: 'var(--blue)' }}>
                <ServiceIcon iconKey={item.icon_key} />
              </div>
            </div>
          )}
          <div className="field">
            <label>Título</label>
            <input type="text" value={item.title || ''} onChange={(e) => updateLocal(item.id, 'title', e.target.value)} />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea value={item.body || ''} onChange={(e) => updateLocal(item.id, 'body', e.target.value)} />
          </div>
          <div className="admin-card-row">
            <button className="btn-sm" onClick={() => handleMove(i, -1)} disabled={i === 0}>↑ Subir</button>
            <button className="btn-sm" onClick={() => handleMove(i, 1)} disabled={i === items.length - 1}>↓ Bajar</button>
            <button className="btn-sm danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
            <button className="btn-sm primary" onClick={() => handleSaveItem(item)}>Guardar</button>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={handleAdd}>+ Agregar</button>
    </div>
  );
}

function GalleryEditor() {
  const [items, setItems] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('block_type', 'gallery')
      .order('sort_order', { ascending: true });
    setItems(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `img-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file);
    if (uploadError) {
      alert('No se pudo subir la imagen: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(path);
    const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    const { data, error } = await supabase
      .from('content_blocks')
      .insert({
        block_type: 'gallery',
        sort_order: nextOrder,
        title: '',
        image_url: publicUrlData.publicUrl,
      })
      .select()
      .single();
    if (!error) setItems((list) => [...list, data]);
    setUploading(false);
    e.target.value = '';
  }

  function updateCaption(id, value) {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, title: value } : it)));
  }

  async function saveCaption(item) {
    await supabase.from('content_blocks').update({ title: item.title }).eq('id', item.id);
  }

  async function handleDelete(id) {
    if (!confirm('¿Quitar esta foto del sitio?')) return;
    await supabase.from('content_blocks').delete().eq('id', id);
    setItems((list) => list.filter((it) => it.id !== id));
  }

  if (!items) return <p className="loading-text">Cargando…</p>;

  return (
    <div>
      <h2>Galería</h2>
      <div className="admin-card">
        <label className="file-input">
          {uploading ? 'Subiendo…' : 'Subir foto nueva'}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'block', marginTop: '.5rem' }} />
        </label>
        <p className="loading-text" style={{ marginTop: '.6rem' }}>
          En cuanto subas la primera foto, aparece sola una sección de "Trabajos recientes" en el sitio.
        </p>
      </div>
      {items.map((item) => (
        <div className="admin-card" key={item.id}>
          <img className="thumb" src={item.image_url} alt="" />
          <div className="field">
            <label>Descripción (opcional)</label>
            <input type="text" value={item.title || ''} onChange={(e) => updateCaption(item.id, e.target.value)} />
          </div>
          <div className="admin-card-row">
            <button className="btn-sm danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
            <button className="btn-sm primary" onClick={() => saveCaption(item)}>Guardar descripción</button>
          </div>
        </div>
      ))}
    </div>
  );
}
