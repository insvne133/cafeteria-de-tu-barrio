# Café Esquina · landing de cafetería de barrio

Landing de práctica para una cafetería ficticia: portada, carta con precios, horario,
ubicación y formulario de contacto. Hecha con Lovable (TanStack Start, React, Tailwind) y
copiada a este repositorio con «Download codebase».

- Web original en Lovable: https://neighborhood-cafe-first-brew.lovable.app
- Versión de este repositorio (GitHub Pages): https://insvne133.github.io/cafeteria-de-tu-barrio/

## Arrancar en local

```sh
cp .env.example .env   # y rellena las variables de Supabase
bun install            # o npm install
bun run dev
```

Comprobaciones: `bun run lint`, `bunx tsc --noEmit`, `bun run test`, `bun run build`.

## Mapa del proyecto

- `src/routes/index.tsx`: la landing completa (carta, horario y formulario).
- `src/routes/__root.tsx`: estructura HTML, metadatos y páginas de error.
- `src/styles.css`: colores y tipografías (Fraunces + Inter).
- `src/integrations/supabase/`: cliente de Supabase (generado por Lovable, no se edita a mano).
- `drizzle/migrations/`: tabla `contact_submissions` y su política RLS.
- `.github/workflows/ci.yml`: lint, tipos, tests y build en cada cambio; publica en GitHub Pages desde `main`.

## Qué hace y qué no

- El formulario valida cada campo, muestra el error debajo del campo y lleva el foco al
  primero con error. Si falla el envío (por ejemplo, sin conexión) avisa y se puede reintentar.
- Los mensajes se guardan en la tabla `contact_submissions` de Supabase (Lovable Cloud).
  La política RLS solo permite insertar; nadie puede leerlos con la clave pública.
  Se consultan en Lovable → More → Database.
- No envía emails ni avisos: nadie recibe una notificación automática.
- Nombre, dirección, horario y precios son inventados.

## Mantenimiento

- Este repositorio **no está enlazado** a Lovable (el proyecto está en un espacio sin GitHub).
  Un cambio aquí no cambia la web de lovable.app, y al revés.
- La versión de GitHub Pages se genera con `GITHUB_PAGES=1` (HTML prerenderizado bajo
  `/cafeteria-de-tu-barrio/`). Sin esa variable, la build es la de Lovable.
- Las claves van en `.env`, que nunca se sube. En el workflow solo está la clave
  **publicable** de Supabase, que es pública por diseño.
- La sincronización con GitHub de Lovable se explica en [docs/github-sync.md](docs/github-sync.md).
