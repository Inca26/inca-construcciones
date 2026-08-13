# INCA Construcciones — sitio + panel de edición

Mismo diseño que ya viste (el de "hojas de plano"), ahora con:
- Página pública en `app/page.js` que lee todo desde Supabase.
- Panel de edición en `/admin` para cambiar textos, especialidades, curiosidades,
  pasos del proceso y subir fotos — sin tocar código.

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo (gratis).
2. Ve a **SQL Editor** → **New query**, pega todo el contenido de `supabase/schema.sql`
   y dale **Run**. Esto crea las tablas, los permisos y deja el contenido actual ya cargado.
3. Ve a **Authentication → Users → Add user** y crea tu propio usuario (correo + contraseña).
   Ese es el único login que va a existir para `/admin` — no hay registro público.
4. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public` key

## 2. Configurar variables de entorno

Copia `.env.local.example` a `.env.local` y pega ahí la URL y la key del paso anterior:

```
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```

## 3. Probarlo local (igual que hiciste con SUS, desde Termux)

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para ver el sitio público, y
`http://localhost:3000/admin` para entrar al panel con el usuario que creaste.

## 4. Subir a GitHub y desplegar en Vercel

```bash
git init
git add .
git commit -m "Sitio INCA Construcciones"
git remote add origin <tu-repo-en-github>
git push -u origin main
```

En [vercel.com](https://vercel.com):
1. **Add New Project** → importa el repo.
2. En **Environment Variables**, agrega las mismas dos variables de `.env.local`.
3. Deploy. En un par de minutos el sitio está en una URL tipo `inca-construcciones.vercel.app`.

## 5. Dominio propio

1. Compra el dominio donde prefieras (Namecheap, GoDaddy, o directo en Vercel → **Domains**).
   Un `.com` ronda $150–350 MXN al año; un `.com.mx` es un poco más y se registra vía NIC México.
2. En tu proyecto de Vercel → **Settings → Domains** → agrega el dominio.
3. Vercel te da 1–2 registros DNS para poner en tu proveedor del dominio (normalmente un
   registro `A` o `CNAME`). En lo que se propaga (minutos a un par de horas), el sitio
   ya responde en tu dominio con HTTPS automático.

## Cómo está organizado el contenido

Todo vive en dos tablas de Supabase:

- **`site_settings`** — un solo renglón con nombre de empresa, eslogan, responsable,
  teléfono, WhatsApp, título/subtítulo de portada y cobertura.
- **`content_blocks`** — una fila por cada especialidad, curiosidad, paso del proceso
  o foto de galería, con un `block_type` que dice a cuál sección pertenece y un
  `sort_order` que controla el orden. El panel `/admin` es la interfaz visual sobre
  estas dos tablas: no hay que tocar Supabase directamente para el día a día.

La sección "Materiales" (concreto, tabique, azulejo, madera, acero) queda fija en el
código porque son categorías genéricas, no contenido del negocio. Si más adelante
quieres que también sea editable, es un cambio sencillo — avísame.

## Publicidad paga (Meta Ads / Instagram-Facebook)

Esto se da de alta aparte, directo en Meta Business Suite, con tu método de pago.
Cuando quieras armar una campaña, te ayudo con el copy de los anuncios, las imágenes
y a qué público apuntarle — solo dime cuando llegue el momento.
