-- =====================================================================
-- INCA Construcciones — esquema de Supabase
-- Copia y pega todo este archivo en Supabase > SQL Editor > New query
-- y dale "Run" una sola vez.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Tablas ----------

create table if not exists site_settings (
  id int primary key default 1,
  company_name text,
  tagline text,
  responsible_name text,
  phone_display text,
  whatsapp_number text,
  hero_title text,
  hero_subtitle text,
  coverage_text text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists content_blocks (
  id uuid primary key default gen_random_uuid(),
  block_type text not null check (block_type in ('service','curiosity','process','gallery')),
  sort_order int not null default 0,
  title text,
  body text,
  icon_key text,
  image_url text,
  created_at timestamptz default now()
);

-- ---------- Seguridad (RLS) ----------
-- Cualquiera puede LEER (para que el sitio público funcione sin login).
-- Solo un usuario autenticado (tú, desde /admin) puede escribir.

alter table site_settings enable row level security;
alter table content_blocks enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);

drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read content" on content_blocks;
create policy "public read content" on content_blocks for select using (true);

drop policy if exists "admin write content" on content_blocks;
create policy "admin write content" on content_blocks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Storage (fotos de la galería) ----------

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "public read gallery photos" on storage.objects;
create policy "public read gallery photos" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "admin upload gallery photos" on storage.objects;
create policy "admin upload gallery photos" on storage.objects
  for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

drop policy if exists "admin delete gallery photos" on storage.objects;
create policy "admin delete gallery photos" on storage.objects
  for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ---------- Contenido inicial ----------
-- Deja el sitio ya cargado con lo que armamos, listo para editar desde /admin.

insert into site_settings (id, company_name, tagline, responsible_name, phone_display, whatsapp_number, hero_title, hero_subtitle, coverage_text)
values (
  1,
  'INCA Construcciones',
  'Edificando tu futuro',
  'Cain Francisco Sánchez Aguirre',
  '722 396 87 75',
  '527223968775',
  'Construimos sobre planos, no sobre supuestos.',
  'Construcción, remodelación y mantenimiento residencial, comercial e industrial.',
  'Residencial · Comercial · Industrial'
)
on conflict (id) do nothing;

insert into content_blocks (block_type, sort_order, title, body, icon_key) values
  ('service', 1, 'Albañilería', 'Muros, firmes, aplanados e impermeabilización.', 'masonry'),
  ('service', 2, 'Electricidad', 'Instalaciones nuevas, centros de carga y reparaciones.', 'bolt'),
  ('service', 3, 'Plomería', 'Tubería, fugas, baños completos e instalación de muebles.', 'plumbing'),
  ('service', 4, 'Azulejos y acabados', 'Pisos, muros, resanes y pintura de interior y exterior.', 'tile'),
  ('service', 5, 'Construcción y remodelación', 'Obra nueva y renovaciones de principio a fin.', 'build'),
  ('service', 6, 'Mantenimiento general', 'Residencial, comercial e industrial, bajo demanda.', 'maintenance'),
  ('service', 7, 'Planos arquitectónicos y 3D', 'Diseño y visualización de tu proyecto antes de construirlo.', 'plans');

insert into content_blocks (block_type, sort_order, title, body) values
  ('curiosity', 1, 'El concreto no se "seca", se cura.', 'Sigue ganando resistencia hasta 28 días después del vaciado.'),
  ('curiosity', 2, 'El corrugado de las varillas no es casualidad.', 'Existe para que el concreto se adhiera mejor al acero.'),
  ('curiosity', 3, 'La plomada se usa desde el Antiguo Egipto.', 'Encuentra la vertical perfecta con solo un hilo y un peso.'),
  ('curiosity', 4, 'Cambiar una idea en el plano toma minutos.', 'Cambiarla ya construida, paredes completas.'),
  ('curiosity', 5, 'El nivel de burbuja usa una curvatura casi invisible en el vidrio.', 'La burbuja siempre sube al punto más alto.');

insert into content_blocks (block_type, sort_order, title, body) values
  ('process', 1, 'Visita y diagnóstico', 'Revisamos el espacio y escuchamos qué necesitas resolver.'),
  ('process', 2, 'Plano y presupuesto', 'Si el proyecto lo requiere, lo dibujamos antes de tocar un ladrillo.'),
  ('process', 3, 'Ejecución', 'Trabajo por etapas, con avances que puedes revisar.'),
  ('process', 4, 'Entrega', 'Limpieza final y revisión contigo antes de dar por terminado.');
