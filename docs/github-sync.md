# Guía: conectar y verificar la sincronización con GitHub

Esta guía sirve para dos cosas: confirmar que el proyecto está enlazado de
hecho a GitHub y resolver los avisos de sincronización que aparecen en
**Project settings → Git**.

Todo lo de conexión se hace en la interfaz de Lovable. Ninguna herramienta
automática puede conectar el repositorio, leer su estado ni cambiar la rama
sincronizada.

---

## 1. Verificar que la conexión existe

Ruta de acceso:

- **Escritorio:** nombre/logo del proyecto arriba a la izquierda → **Settings**
  (atajo `Cmd+.` en Mac, `Ctrl+.` en Windows/Linux) → pestaña **Git**.
  Alternativa: botón **(+)** junto al cuadro de chat → **Project** → **GitHub**.
- **Móvil:** modo chat → **`...`** abajo a la derecha → **Settings** → **Git**.
  También: **More** → grupo **Settings** → **Git**.

Qué tiene que mostrar la pantalla:

1. Un repositorio enlazado, con nombre de cuenta/organización y nombre del repo.
2. La **rama sincronizada** (suele ser `main`).
3. Un estado tipo "al día", o bien un aviso del tipo *"el proveedor está N
   commits por delante"* / *"Lovable y GitHub han divergido"*.

Si en vez de eso aparece el botón para conectar GitHub, el proyecto todavía no
tiene repositorio.

> **No uses `git remote -v` dentro del editor de Lovable para comprobarlo.**
> Ahí los remotos que ves son los internos de Lovable, no GitHub. La única
> fuente fiable es la pantalla **Settings → Git**.

Permisos: conectar o desconectar necesita ser owner o admin del workspace o del
proyecto; los editores pueden ver el estado y cambiar o crear ramas. Aparte,
para que los commits lleguen hace falta tener acceso de escritura al
repositorio en GitHub.

## 2. Verificar que el trabajo realmente llegó

1. Abrí el repositorio en GitHub y mirá la rama sincronizada.
2. Los últimos commits de Lovable tienen que estar ahí, con el orden y los
   mensajes que se ven en el historial de Lovable.
3. Si el repo está vacío o muy atrás, la sincronización no está corriendo:
   volvé a **Settings → Git** y mirá el aviso que muestra.

## 3. Errores habituales y cómo resolverlos

### "Lovable y GitHub han divergido"

Cada lado tiene commits que el otro no tiene. Lovable empuja su trabajo a una
rama `lovable-sync` (si esa rama está protegida, ocupada o rechazada, crea una
`lovable-sync-<marca-de-tiempo>`).

Qué hacer:

1. Entrar a **Settings → Git** y fijarse en la rama `lovable-sync*` más nueva.
2. Unir esa rama en la rama sincronizada desde GitHub (pull request o merge).
3. Volver a **Settings → Git** y rechequear el estado.

Hasta que no se una, el próximo push a la rama sincronizada reemplaza la versión
de Lovable por la del repositorio.

### "Un push del repositorio reemplazó tu trabajo en Lovable"

Aparece un aviso durante 24 horas. Si el proyecto está en el sistema de backups
de recuperación, el dueño puede restaurar desde ese aviso o desde
**Settings → Git → Check for saved Lovable work**. Si esos controles no
aparecen, el trabajo reemplazado queda solo en la rama `lovable-sync*` más
nueva, si es que Lovable logró empujarla.

### "El proveedor está N commits por delante" y no se actualiza

**Reconnect** y **Re-check** no tiran de los commits que faltan. La solución es
empujar un commit nuevo a la rama sincronizada desde el checkout local, para
que GitHub avise otra vez.

### La rama sincronizada está protegida, o se hizo force push / rebase / squash

Lovable manda sus commits a `lovable-sync` en vez de a la rama sincronizada, y
el reescrito de historia dispara el reemplazo de la versión de Lovable.
Evitalo: no reescribas la historia de la rama sincronizada.

### Rama `lovable-fallback`

Alguien borró la rama sincronizada. Lovable pasó a una rama propia para que se
pueda seguir editando. Hay que elegir o volver a crear una rama en
**Settings → Git**.

### El push queda bloqueado por un archivo grande

GitHub rechaza archivos de más de 100 MB y el bloqueo sigue aunque el archivo se
borre, porque el commit que lo agregó sigue en el historial. La lista de esos
archivos sale en **Settings → Git**; si ofrece una limpieza de historial,
ejecutala. Si no, hay que pedir ayuda.

Ojo aparte: Lovable no escribe archivos de más de 10 MB, así que una edición que
toque un archivo así falla aunque el archivo haya entrado desde el repositorio.

### GitHub bloquea el push por "secret push protection"

GitHub detectó algo que parece una clave privada. No se sube ni se copia el
valor: se saca del código y se guarda en **Settings → Secrets**.

### Se borró el repositorio

La sincronización se corta. Desconectar y volver a conectar **crea un
repositorio privado nuevo**: no se puede re-enlazar el anterior ni enlazar uno
que ya existía.

### Se cambiaron funciones o migraciones desde el repositorio

- Los cambios en `supabase/functions/` solo redeployan funciones en proyectos
  enlazados a un backend propio del usuario, y de forma poco fiable. En Lovable
  Cloud la sincronización nunca despliega funciones: se despliegan desde el chat.
- Las migraciones **nunca** se aplican con la sincronización. Se aplican desde
  el chat cuando hace falta.

### Se trabajó en otra rama

Solo se sincroniza una rama a la vez. Los commits de cualquier otra rama no
llegan a Lovable hasta que se unan en la rama sincronizada, o hasta que Lovable
cambie a esa rama en el selector de ramas.

## 4. Reglas para que no vuelva a pasar

- No force push, rebase, amend ni squash sobre commits ya empujados a la rama
  sincronizada.
- Una sola rama de trabajo: todo a la rama sincronizada.
- Antes de editar el repo a mano, mirar el estado en **Settings → Git**.
- Claves privadas a **Settings → Secrets**, nunca al código.
- Nada de archivos de más de 100 MB en el repositorio.

## 5. Si no querés GitHub

- Bajar el código: **Settings → Git → Download codebase**, o lo último del árbol
  de archivos en el editor de código (planes de pago).
- Bajar los datos de la base: **More → Database → Manage → Settings → Export
  data**.
