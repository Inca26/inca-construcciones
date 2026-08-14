import { supabase } from '../lib/supabaseClient';
import { ServiceIcon } from '../components/icons';
import SiteInteractions from '../components/SiteInteractions';

export const revalidate = 0;

async function getData() {
  const [{ data: settings }, { data: blocks }] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase.from('content_blocks').select('*').order('sort_order', { ascending: true }),
  ]);

  return {
    settings: settings || {},
    services: (blocks || []).filter((b) => b.block_type === 'service'),
    curiosities: (blocks || []).filter((b) => b.block_type === 'curiosity'),
    process: (blocks || []).filter((b) => b.block_type === 'process'),
    gallery: (blocks || []).filter((b) => b.block_type === 'gallery'),
  };
}

export default async function Home() {
  const { settings, services, curiosities, process, gallery } = await getData();
  const waNumber = settings.whatsapp_number || '';
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <>
      <SiteInteractions />

      <header className="sheet-nav">
        <a href="#a00" className="brand">
          <span className="brand-badge">
            <img src="/logo.png" alt="INCA Construcciones" />
          </span>
          <span className="brand-text">
            <span className="name">{settings.company_name || 'INCA Construcciones'}</span>
            <span className="tag">{settings.tagline || 'Edificando tu futuro'}</span>
          </span>
        </a>
        <nav className="tabs">
          <a href="#a00" className="tab active" data-tab>Inicio</a>
          <a href="#a01" className="tab" data-tab>Especialidades</a>
          <a href="#a02" className="tab" data-tab>Materiales</a>
          <a href="#a03" className="tab" data-tab>Proceso</a>
          <a href="#a04" className="tab" data-tab>Notas</a>
          <a href="#a05" className="tab" data-tab>Contacto</a>
        </nav>
      </header>

      {/* A00 — HERO */}
      <section id="a00" className="sheet hero">
        <span className="reg tl"></span><span className="reg tr"></span>
        <span className="reg bl"></span><span className="reg br"></span>
        <div className="container">
          <h1 className="hero-title">
            {settings.hero_title || 'Construimos sobre planos, no sobre supuestos.'}
          </h1>
          <p className="hero-sub">
            {settings.hero_subtitle} A cargo de {settings.responsible_name}.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">
              Cotizar por WhatsApp
            </a>
            <a className="btn btn-ghost" href="#a01">Ver especialidades ↓</a>
          </div>
          <div className="dim-bar" data-reveal>
            <div className="dim-stat">
              <span className="dim-num">Cobertura</span>
              <p className="dim-label">{settings.coverage_text}</p>
            </div>
            <div className="dim-stat">
              <span className="dim-num">Especialidades</span>
              <p className="dim-label">{services.length} áreas de trabajo</p>
            </div>
            <div className="dim-stat">
              <span className="dim-num">Antes de construir</span>
              <p className="dim-label">Plano arquitectónico y 3D</p>
            </div>
          </div>
        </div>
      </section>

      {/* A01 — SERVICIOS */}
      <section id="a01" className="sheet servicios">
        <div className="container">
          <p className="eyebrow">Especialidades</p>
          <h2 className="sheet-title" data-reveal>Lo que hacemos</h2>
          <div className="grid-services" data-reveal>
            {services.map((s) => (
              <article className="card-service" key={s.id}>
                <ServiceIcon iconKey={s.icon_key} />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* A02 — MATERIALES */}
      <section id="a02" className="sheet materiales">
        <div className="container">
          <p className="eyebrow">Materiales</p>
          <h2 className="sheet-title" data-reveal>Con lo que trabajamos</h2>
          <p className="materials-intro" data-reveal>
            {gallery.length > 0
              ? 'Así son algunos de nuestros trabajos, y los materiales y acabados que dominamos en cada obra.'
              : 'Estamos preparando la galería de proyectos terminados. Mientras tanto, así son los materiales y acabados que dominamos en cada obra.'}
          </p>
          <div className="grid-materials" data-reveal>
            <div className="swatch"><img className="swatch-photo" src="/materials/concreto.jpg" alt="Concreto en obra" /><div className="swatch-label">Concreto</div></div>
            <div className="swatch"><img className="swatch-photo" src="/materials/tabique.jpg" alt="Muro de tabique en construcción" /><div className="swatch-label">Tabique</div></div>
            <div className="swatch"><img className="swatch-photo" src="/materials/azulejo.jpg" alt="Colocación de azulejo" /><div className="swatch-label">Azulejo</div></div>
            <div className="swatch"><img className="swatch-photo" src="/materials/madera.jpg" alt="Trabajo en madera" /><div className="swatch-label">Madera</div></div>
            <div className="swatch"><img className="swatch-photo" src="/materials/acero.jpg" alt="Herramientas de construcción" /><div className="swatch-label">Acero</div></div>
          </div>
        </div>
      </section>

      {/* GALERÍA — solo aparece cuando hay fotos cargadas desde /admin */}
      {gallery.length > 0 && (
        <section id="galeria" className="sheet galeria">
          <div className="container">
            <p className="eyebrow">Trabajos recientes</p>
            <h2 className="sheet-title" data-reveal>Galería</h2>
            <div className="grid-gallery" data-reveal>
              {gallery.map((g) => (
                <div className="gallery-item" key={g.id}>
                  <img src={g.image_url} alt={g.title || 'Trabajo de INCA Construcciones'} />
                  {g.title && <div className="gallery-caption">{g.title}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* A03 — PROCESO */}
      <section id="a03" className="sheet proceso dark">
        <span className="reg tl"></span><span className="reg tr"></span>
        <div className="container">
          <p className="eyebrow">Proceso</p>
          <h2 className="sheet-title" data-reveal>Cómo trabajamos</h2>
          <div className="process-line" data-reveal>
            {process.map((p, i) => (
              <div className="process-step" key={p.id}>
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A04 — CURIOSIDADES */}
      <section id="a04" className="sheet curiosidades">
        <div className="container">
          <p className="eyebrow">Notas al margen</p>
          <h2 className="sheet-title" data-reveal>Curiosidades de construcción</h2>
          <div className="notes-grid" data-reveal>
            {curiosities.map((c, i) => (
              <div className="note" key={c.id}>
                <span className="note-tag">{String(i + 1).padStart(2, '0')}</span>
                <p><strong>{c.title}</strong> {c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A05 — CONTACTO */}
      <section id="a05" className="sheet contacto">
        <span className="reg tl"></span><span className="reg tr"></span>
        <span className="reg bl"></span><span className="reg br"></span>
        <div className="container">
          <p className="eyebrow">Contacto</p>
          <h2 className="sheet-title">Hablemos de tu proyecto</h2>
          <p className="contacto-sub">
            Cuéntanos qué necesitas construir, remodelar o reparar y te respondemos por WhatsApp.
          </p>
          <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </a>
          <p className="phone-line"><a href={`tel:+${waNumber}`}>{settings.phone_display}</a></p>
        </div>
      </section>

      <footer className="title-block">
        <div className="tb-grid">
          <div className="tb-cell"><span className="tb-k">Empresa</span><span className="tb-v">{settings.company_name}</span></div>
          <div className="tb-cell"><span className="tb-k">Responsable</span><span className="tb-v">{settings.responsible_name}</span></div>
          <div className="tb-cell"><span className="tb-k">Especialidad</span><span className="tb-v">Construcción · Remodelación · Mantenimiento</span></div>
          <div className="tb-cell"><span className="tb-k">Cobertura</span><span className="tb-v">{settings.coverage_text}</span></div>
        </div>
        <p className="tb-foot">
          {(settings.company_name || '').toUpperCase()} — {(settings.tagline || '').toUpperCase()}
        </p>
      </footer>
    </>
  );
}
