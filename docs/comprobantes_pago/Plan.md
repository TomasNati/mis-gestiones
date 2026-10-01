# Plan de implementación — comprobantes de pago

> **Estado (2026-09-28):** el **almacenamiento está hecho y en producción**.
> `POST /api/comprobantes` (subir) y `GET /api/comprobantes/descargar`
> (descargar) están commiteados en `../mis-gestiones-backend` (`db30dc8`,
> pusheado a `main` → desplegado en `mis-gestiones-backend.vercel.app`) y
> verificados contra el repo real. Son **por path**, sin base de datos. Falta
> la tabla `finanzas_comprobante_pago` y todo el paso 2 (UI) y 3 (borrar Drive).
> Detalle exacto de qué quedó hecho y qué no, abajo y en cada sección.

Documento derivado de [Design.md](./Design.md). El diseño original proponía hacer
todo desde la app web; la implementación definitiva se reparte así:

| Repo | Rol en esta feature |
|---|---|
| `TomasNati/comprobantes-pago` | Almacenamiento. Repo privado, 3 commits, hoy solo tiene el README |
| `../mis-gestiones-backend` (Python/FastAPI) | **Toda** la lógica: conexión con GitHub, tabla nueva, endpoints, validaciones |
| `mis-gestiones` (este repo, Next.js) | Solo la UI y un proxy delgado hacia el backend (paso 2) |

Motivo: el backend ya es el dueño del storage de comprobantes (hoy Google
Drive), ya tiene la autenticación por `X-API-Key` / `BACKEND_SHARED_SECRET` y
los modelos SQLAlchemy de `finanzas_vencimiento` y `finanzas_subcategoria`.
Además el upload a Drive ya había sido implementado y eliminado por cuota
(`docs/2026-04-20-google-drive-endpoints.md` en el repo del backend), así que
sus decisiones de tamaño, streaming y errores se reutilizan tal cual.

## Contexto técnico

### Del backend (`../mis-gestiones-backend`)

- FastAPI + SQLAlchemy 2.x, schemas `misgestiones` e `inversiones`, deploy en
  Vercel por integración con git sobre `main` (sin CI, sin tests, sin linter:
  **lo que se mergea a `main` es producción**).
- Los modelos SQLAlchemy viven en `structure.py` (raíz); `models/` es solo
  Pydantic DTOs; las queries en `db/gestiones.py`; los routers en
  `api/routers/`. Las tablas de finanzas se nombran `finanzas_<nombre sin
  underscore>` en el schema `misgestiones`.
- `Vencimiento` ya tiene `pagoId`/`pago` → `MovimientoGasto`. "El vencimiento
  está pagado" == `pagoId IS NOT NULL`.
- `Subcategoria.comprobantesPath` (`comprobantes_path`, varchar 256) ya existe en
  la base, en `structure.py` y en el modelo Pydantic, y ya se edita desde
  `mis-gestiones-admin`.
- `httpx` y `python-multipart` ya están en `requirements.txt`. **No hace falta
  PyGithub.**
- No hay migraciones: el DDL se documenta en `docs/*.md` y se aplica a mano.
  Precedente: `docs/inversiones.md`.
- `main.py` ya tiene CORS con el origen de esta web app
  (`https://mis-gestiones-opal-kappa.vercel.app`), `allow_headers=["*"]` y
  `expose_headers=["Content-Disposition"]`: no hace falta tocarlo.
- Auth existente: `require_api_key` (header `X-API-Key`, `hmac.compare_digest`
  contra `BACKEND_SHARED_SECRET`), usada solo por el router de Drive.

### De esta app web

- Server actions de Next.js con body máximo de 1MB: el proxy de subida tiene que
  ser un Route Handler (`src/app/api/**/route.ts`), no un server action.
- El secreto del backend **no** puede ir al browser: nada de
  `NEXT_PUBLIC_BACKEND_SHARED_SECRET`. Por eso el proxy server-side.
- No hay tests; verificación con `yarn lint`, `yarn tsc --noEmit`, `yarn build` y
  prueba manual.

### Restricciones que condicionan la solución

| Restricción | Consecuencia |
|---|---|
| La Contents API devuelve el contenido en base64: por `GET` el límite por defecto es 1MB (se resuelve con `Accept: application/vnd.github.raw`, hasta 100MB) y por `PUT` acepta hasta 100MB | El tamaño **no** obliga a usar la Git Data API. Lo que sí pesa es la atomicidad: `PUT`/`DELETE` es un commit por archivo, así que una subida múltiple quedan N commits (con rollback manual) y un rename son dos commits con una ventana sin archivo. Por eso la **escritura** va por la Git Data API y la **lectura** usa el media type `raw` |
| Vercel corta el body de las funciones serverless en **4.5MB**, tanto de request como de response (`413 FUNCTION_PAYLOAD_TOO_LARGE`) | El tamaño de upload sale de `MAX_UPLOAD_BYTES`, configurable por env var, con default **2.000.000** (2MB) y tope duro de **4.000.000** (4MB) que se aplica aunque la variable esté miseada. El cap holgado tiene que valer también para la **descarga**, que es una response de la función |
| El repo es privado | La descarga se proxya desde el server con el PAT; nunca una URL `raw.githubusercontent.com` ni el token al browser |
| `comprobantes_path` es `varchar(256)` | Hay que recortar/sanitizar el `subpath` para que `path + subpath` no se pase de límites |
| `main` del backend deploya a producción sin gate | Verificar en local con `uvicorn` antes de mergear |
| Tres nombres candidatos para la tabla nueva | `finanzas_comprobante_pago` (Design.md), `vencimiento_pago_comprobante` (README del repo de comprobantes) y la convención de casa `finanzas_vencimientopagocomprobante`. **Decisión pendiente** |

---

## Paso 1 — GitHub, base de datos y endpoints (todo en `../mis-gestiones-backend`)

> Progreso: **1.1 parcial · 1.2 parcial · 1.3 no · 1.4 parcial · 1.5 hecho · 1.6 parcial · 1.7 parcial · 1.8 parcial**
> Commits: `db30dc8` (endpoint para subir y descargar archivos de github).

### 1.1 Conexión con GitHub

- [x] Fine-grained PAT sobre `TomasNati/comprobantes-pago` con permiso
      `Contents: Read and write` **únicamente** sobre ese repo. **Confirmado en
      producción**: un `GET /descargar` de un path inexistente devuelve 404 (no
      401/403), o sea que el PAT autentica bien desde Vercel.
- [x] Variables de entorno en `.env`, `.env.example` y panel de Vercel:
      `GITHUB_TOKEN`, `GITHUB_REPO_OWNER=TomasNati`,
      `GITHUB_REPO_NAME=comprobantes-pago`, `GITHUB_REPO_BRANCH=main`.
- [x] Identidad de autoría de los commits en el payload del commit, vía
      `GITHUB_COMMIT_AUTHOR_NAME` / `GITHUB_COMMIT_AUTHOR_EMAIL` (el repo no
      tiene `.gitignore` ni identidad configurada y los commits los crea el
      token).
- [x] `MAX_UPLOAD_BYTES` reutiliza la variable que ya existía; cambian el
      default y el clamp, resueltos **una sola vez** al importar `github.py`:
      default **2.000.000**, tope duro de **4.000.000** con warning por log, y
      default también si no parsea o es `<= 0`. `.env` y `.env.example`
      actualizados a `2000000`.
- [x] La UI lee el límite efectivo desde el backend: existe
      `GET /api/comprobantes/limites`. **Pendiente que la UI lo consuma** (paso 2).

> Desvío de la variable en Vercel: hay que agregar `GITHUB_TOKEN`,
> `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `GITHUB_REPO_BRANCH`,
> `GITHUB_COMMIT_AUTHOR_NAME` y `GITHUB_COMMIT_AUTHOR_EMAIL`. Al verificar en
> producción el flujo anduvo, así que ya están cargadas.

### 1.2 Cliente de GitHub

- [x] `github.py` (raíz) con `httpx`, **reemplaza a `drive.py`**. No usa
      import protegido: `httpx` ya es dependencia dura (el backend no arranca sin
      base de datos igual), y el patrón de import protegido de `drive.py` solo
      tenía sentido para las librerías opcionales de Google.
- [x] Operaciones de **escritura** sobre la **Git Data API**, con la rama
      resuelta en cada write (read → tree → commit → ref), para que una subida
      múltiple sea **un solo commit**:
      - [x] `obtener_sha_de_rama()`
      - [x] `crear_blob(contenido: bytes) -> sha` (binario en base64)
      - [x] `crear_arbol(base_tree_sha, entradas) -> sha`
      - [x] `crear_commit(parents, tree) -> sha`
      - [x] `actualizar_ref(sha)`
- [x] Lectura con la Contents API y `Accept: application/vnd.github.raw`: un
      request, bytes directos, sin base64. 404 si el archivo ya no está.
- [x] Funciones de dominio: `escribir_paths(entradas, mensaje)` (**un commit
      para N archivos**) y `leer_archivo(ruta)`.
      - [ ] `borrar_archivo(ruta)` — **no implementada**, falta para el `DELETE`
        de 1.6.
      - [ ] `renombrar_archivo(ruta_anterior, ruta_nueva)` — **no implementada**,
        falta para el `PATCH` de 1.6.
- [x] Las escrituras de un mismo request se ejecutan **en serie**.
- [x] `map_http_error` copiado del patrón de `drive.py` (404 → 404, 403 → 403,
      401 → 502, resto → 502) y log en el borde. **Más** un helper `_check()`
      delante de cada `raise_for_status()`: sin él los status de GitHub se
      escapaban como `httpx.HTTPStatusError` y FastAPI devolvía 500 con stack
      trace. Los errores de transporte (timeout/DNS) los mapea el router.
- [x] Chequeo de tamaño contra el valor resuelto de `MAX_UPLOAD_BYTES`
      **antes** de llegar a memoria: `Content-Length` primero, después conteo
      por chunks de 256KB abortando con 413.
- [x] Límite efectivo expuesto en `GET /api/comprobantes/limites`.
- [x] Smoke test manual contra el repo real: blob de prueba creado, leído,
      renombrado, borrado y **repo verificado sin basura** (queda solo
      `README.md`).

### 1.3 Construcción de rutas

- [ ] `comprobantes.py` (raíz, junto a `drive.py`) con el armado del `subpath`
      según el diseño: `{año}/{mes}{-comentario}.{ext}`, tomado de
      `vencimiento.fecha`.
      **Estado:** la primera tanda no lo incluye. El upload actual **recibe el
      path completo ya armado desde el cliente** (`path` = carpeta destino +
      nombre de archivo), sin knowledge de vencimientos. El armado del subpath
      se hace recién cuando exista la tabla y el endpoint sea por
      `vencimiento_id`.
- [x] Sanitización del path (`normalizar_path`): acepta separadores Windows y
      Unix, descarta barras duplicadas, y **rechaza** `..`, segmentos ocultos
      (` .algo`), `:` y globbing, con tope de 1000 caracteres. Sin esto, un
      `path` con traversal escribiría fuera del repo.
- [x] Allowlist de extensiones (`.pdf`, `.jpg`, `.jpeg`, `.png`, `.heic`) →
      415. La deducción de MIME con `mimetypes.guess_type` quedó solo del lado
      de la **descarga** (`Content-Type` de la respuesta); en la subida no hace
      falta porque no se guarda metadata de tipo.
- [ ] Sufijo numérico ante colisión de nombre dentro del mismo `path`.
      **Reemplazado por decisión de producto:** el upload **rechaza** con 409
      si el path destino ya existe, en vez de inventar un sufijo. Ver
      "Decisiones pendientes" §6.
- [ ] Recorte del subpath para no exceder el `varchar(256)` de
      `comprobantes_path`. **Aplazado**: sin tabla, el path no se persiste.
- [x] `path` completo normalizado sin barras duplicadas.

### 1.4 Base de datos

**DDL hecho; falta el uso de la tabla.**

- [x] Nombre decided: **`finanzas_comprobante_pago`** (la de `Design.md`). Choca
      con la convención de nombres de casa sin underscores, y está bien: es la
      más descriptiva.
- [x] Script `docs/comprobantes.sql` en el backend, idempotente, siguiendo el
      precedente de `docs/inversiones.md`. **Aplicado a la base** y verificado
      contra `information_schema`: columnas e índices (parciales) como pide el
      script.
      - `id UUID PK`, `active BOOLEAN`, `vencimiento_id UUID NOT NULL` → FK a
        `finanzas_vencimiento`, `subpath VARCHAR(256) NOT NULL`.
      - Verificado contra la base: `finanzas_vencimiento.id` es `uuid NOT NULL` y
        `finanzas_subcategoria.comprobantes_path` es `varchar(256)`, así que el
        ancho del `subpath` cierra con el `path`.
      - FK **sin `ON DELETE`**, como las demás de finanzas: nada se borra hard.
      - Índice parcial en `vencimiento_id` (la grilla cuenta por vencimiento en
        un request) y **único parcial** en `(vencimiento_id, subpath)`:
        refleja el 409 por colisión de nombre del upload, y el `WHERE active`
        deja reusar un nombre después de dar de baja el comprobante anterior.
- [x] Modelo `ComprobantePago` en `structure.py` (atributos en camelCase
      `vencimientoId` sobre columnas snake_case, como `pagoId` → `pago`).
- [ ] DTOs Pydantic en `models/comprobantes.py`.
- [ ] Queries en `db/gestiones.py` (o `db/comprobantes.py`): alta, baja lógica,
      rename del `subpath`, y conteo por lote de `vencimiento_ids`.

### 1.5 Autenticación

- [x] `require_api_key` extraído de `api/routers/drive.py` a `api/security.py`,
      y reutilizado desde el router de Drive (que ahora importa, en vez de
      duplicar) y desde el router de comprobantes.

### 1.6 Endpoints

Router `api/routers/comprobantes.py` con
`APIRouter(prefix="/api/comprobantes", tags=["Comprobantes"], dependencies=[Depends(require_api_key)])`,
**sin** repetir el prefijo en los decoradores. Registrado en `main.py`.

- [x] `POST /api/comprobantes` — `multipart/form-data` con `path` (carpeta
      destino) y `files: List[UploadFile]`. Sube a GitHub y devuelve `201` con
      el commit, los archivos y el `max_upload_bytes` efectivo.
      **Desvío del plan:** no valida `vencimiento_id`, `pagoId IS NOT NULL` ni
      `comprobantesPath`, porque no hay tabla todavía. Es la capa de storage
      pura; esas validaciones van en el endpoint por `vencimiento_id`.
      No hace falta que la carpeta exista: en git las carpetas no son objetos y
      la Git Data API las arma sola a partir del path del blob.
- [x] `GET /api/comprobantes/descargar?path=<path completo>` — `def` (no
      `async def`), `StreamingResponse`, `Content-Disposition` con el nombre
      URL-quoteado y `media_type` deducido. 404 si el archivo ya no está en
      GitHub; 413 si el archivo pasa `MAX_UPLOAD_BYTES`.
      **Desvío del plan:** es por path, no por `id`, por lo mismo que arriba.
- [x] `GET /api/comprobantes/limites` — el `max_upload_bytes` efectivo, para que
      la UI valide antes de subir en vez de recibir un 413 seco.
- [ ] `GET /api/comprobantes?vencimiento_ids=a,b,c` — lectura por lote, para que
      la grilla resuelva en un solo request cuántos comprobantes tiene cada
      vencimiento. **Depende de la tabla.**
- [ ] `PATCH /api/comprobantes/{id}` — rename por comentario. **Depende de la
      tabla** y de `renombrar_archivo`.
- [ ] `DELETE /api/comprobantes/{id}` — baja lógica + borrado en GitHub.
      **Depende de la tabla** y de `borrar_archivo`.
- [x] Shape de errores `{ "error": ..., "message": ... }` con
      400/401/404/409/413/415/422/502.

### 1.7 Documentación

- [x] `docs/comprobantes.md` en el repo del backend: contrato de los endpoints,
      variables de entorno, tabla de errores, y los detalles de implementación
      que no hay que romper (escrituras en serie, el JSON de un directorio en la
      descarga, el cap de descarga, la validación del path de subida).
- [x] `docs/ECOSYSTEM_OVERVIEW.md` de este repo actualizado: `comprobantes`
      entre los endpoint groups (y su `X-API-Key`), el repo
      `TomasNati/comprobantes-pago` como quinto repo del ecosistema, la tabla
      nueva en el ER diagram, y la nota de que es backend-only (sin Drizzle).
- [ ] README del repo de comprobantes como spec. **Opcional**: hoy el contrato
      vive en `docs/comprobantes.md` del backend.

### 1.8 Verificación

- [x] `python -c "import main"` y `uvicorn main:app --reload`.
- [x] Matriz con `curl` **en local** contra el repo real: subida simple,
      múltiple (1 commit, verificado), round-trip de bytes con `cmp`, 409 por
      path existente, 413 de subida (por `Content-Length` y por el lector por
      chunks) y de descarga, 404 de path inexistente, 415 de extensión, 400 de
      path vacío/traversal/largo, 401 de key inválida, 422 de header ausente.
- [x] Repo `TomasNati/comprobantes-pago` verificado sin basura de pruebas.
- [x] Commiteado (`db30dc8`) y pusheado a `main` → **desplegado en producción**.
- [x] Verificado en producción: `GET /limites` con key válida devuelve `200` con
      el repo y la rama correctos; `GET /descargar` de un path inexistente
      devuelve `404` (prueba de que el PAT funciona desde Vercel).

#### Bugs encontrados y corregidos durante la verificación

Anotados porque son las trampas del diseño, noobvios al leer el código:

1. **Fuga del PAT en la descarga.** `GET /descargar?path=<carpeta>` devolvía
   `200` con el listado JSON de GitHub, que trae un `download_url` de
   `raw.githubusercontent.com` **con el token embebido**. Ahora `leer_archivo`
   descarta cualquier respuesta `application/json` y responde 404. Ese chequeo
   no es opcional: sin él, el endpoint filtra la credencial.
2. **`path` vacío escribía en la raíz del repo** con `201` en vez de `400`,
   porque `normalizar_path` descarta las barras iniciales. La carpeta destino
   ahora se valida por separado del path completo.
3. **`map_http_error` era código muerto en el path de escritura.** Los seis
   helpers de la Git Data API usaban `raise_for_status()` crudo → 500 con stack
   trace. Se agregaron `_check()` y el mapeo de errores de transporte en el
   router.
4. **Un archivo en medio de una ruta de carpeta daba 500** (GitHub responde 422
   al crear el árbol). Ahora se detecta antes y devuelve `409` con `"ya hay un
   archivo donde va una carpeta"`.


---

## Paso 2 — UI en este repo (solo mención, no se ejecuta en esta tanda)

> Sigue íntegro. Depende de que los endpoints por `vencimiento_id` queden
> congelados (paso 1.4 + 1.6), no de los que hoy están en producción.

- [ ] Proxy server-side en `src/app/api/comprobantes/**/route.ts` que reenvía al
      backend agregando `X-API-Key` desde el server. Route Handler, no server
      action, por el límite de 1MB. El secreto nunca llega al browser.
- [ ] Tipo `ComprobantePago` en `src/lib/definitions.ts`.
- [ ] Columna de comprobantes en `VencimientoGrilla.tsx`: ícono de descarga si
      hay uno solo, ícono de lista si hay varios.
- [ ] `ComprobantesModal` con la lista y la descarga de cada uno.
- [ ] Selector de archivos + validación de tamaño en `CrearPagoModal.tsx`, leyendo
      el límite de `GET /api/comprobantes/limites` (ya existe) y no un número
      hardcodeado.
- [ ] Sección de comprobantes en `AgregarEditarModal.tsx` con descargar, eliminar,
      cambiar el comentario y agregar nuevos.
- [ ] Hooks `src/hooks/useComprobantes.ts`, siguiendo el precedente de
      `src/hooks/inversiones`.

Depende de que los endpoints del paso 1 queden con el contrato congelado.

> Contexto para cuando se implemente: hoy `src/lib/api.ts` (línea 24) usa
> `NEXT_PUBLIC_BACKEND_BASE_URL` y se importa desde componentes `'use client'`,
> o sea que el browser pega **al backend directo** y sin secreto. Por eso el
> proxy server-side no es opcional: es la única forma de que el
> `BACKEND_SHARED_SECRET` no termine en el bundle.

---

## Paso 3 — Limpieza de endpoints que quedan sin uso

- [ ] Confirmar que ningún cliente llama a los endpoints de Drive: revisar
      `mis-gestiones-admin`, `mis-gestiones-mobile` (tiene un
      `docs/google-drive-comprobantes.md`) y este repo.
- [ ] En `../mis-gestiones-backend`: borrar `api/routers/drive.py`, `drive.py`
      (raíz), `models/drive.py` y `docs/2026-04-20-google-drive-endpoints.md`.
- [ ] Quitar `google-api-python-client` y `google-auth` de `requirements.txt`, y
      `GOOGLE_SA_CLIENT_EMAIL`, `GOOGLE_SA_PRIVATE_KEY`, `GOOGLE_DRIVE_FOLDER_ID`
      de `.env`, `.env.example` y de las variables de Vercel.
- [ ] Conservar `BACKEND_SHARED_SECRET`: pasa a ser la credencial del router de
      comprobantes (ver 1.5). `MAX_UPLOAD_BYTES` también se conserva.
- [ ] Actualizar la documentación del ecosistema en este repo y el
      `.github/copilot-instructions.md` del backend si quedaron referencias a Drive.
- [ ] Desplegar el backend y comprobar que `finanzas`, `inversiones`,
      `cotizaciones` y `comprobantes` responden.

---

## Decisiones pendientes

1. **Tamaño máximo — resuelto.** `MAX_UPLOAD_BYTES`, default **2MB**
   (2.000.000 bytes) y tope duro de **4MB** (4.000.000) aplicado aunque la
   variable esté miseada, porque el body de una función de Vercel no puede
   pasar de 4.5MB. El mismo cap vale para la descarga, que es una response.
   Los 5MB del diseño original quedan reemplazados por este valor configurable.
   **Implementado** en `github.py`, verificado con 413 en subida y en descarga.
2. **Nombre de la tabla — resuelto.** `misgestiones.finanzas_comprobante_pago`
   (la de `Design.md`). Choca con la convención de nombres de casa sin
   underscores, y se aceptó igual por ser la más descriptiva. DDL en
   `docs/comprobantes.sql` del backend.
3. **Origen de `{año}/{mes}` — sigue pendiente.** `vencimiento.fecha` o
   `pago.fecha`: difieren cuando una factura se paga con atraso. El plan asume
   `vencimiento.fecha`.
4. **Repo y PAT — resuelto.** `TomasNati/comprobantes-pago`, privado, con PAT
   fine-grained de `Contents: Read and write` solo sobre ese repo. Verificado
   funcionando desde producción.
5. **Paso 3 — sigue pendiente.** Interpretado como la limpieza de los endpoints
   de Drive. Confirmar que ese era el alcance buscado.
6. **Colisión de nombres en el upload — resuelto por decisión de producto.**
   El plan(original) pedía "sufijo numérico ante colisión de nombre"; lo
   implementado **rechaza con 409** si el path destino ya existe, sin inventar
   nombres. Razón: un comprobante con nombre inventado es indistinguible del
   real en el repo, y el 409 obliga a decidir el nombre a propósito. Si más
   adelante se quiere el overwrite o el sufijo, es un parámetro nuevo.
7. **Contrato por path vs. por `vencimiento_id` — desvío consciente.** La
   primera tanda expone upload y download **por path crudo**, sin base de
   datos, para validar el repo y el HTTP antes de meter el DDL. Consecuencias a
   tener en cuenta al seguir:
   - La validación de `pagoId IS NOT NULL` **ya no aplica**: se decidió permitir
     comprobantes en vencimientos impagos. Lo que sigue sin estar es el check de
     `comprobantesPath` no vacío (el path lo sigue eligiendo el cliente).
   - El path lo decide el cliente. Esa es la superficie a cerrar después; hoy
     la única defensa es el `X-API-Key` compartido más la sanitización del path.
   - Un 404 de descarga no distingue "no existe" de "existe pero inactivo": no
     hay tabla que filtrar por `active`.
8. **Auth: el `X-API-Key` es un secreto compartido, no autenticación.** No hay
   usuarios ni scopes. Como el secreto no puede ir al browser, el proxy
   server-side del paso 2 es lo que termina gating el acceso de la web app, y
   el `X-API-Key` realmente bloquea los golpes directos contra
   `mis-gestiones-backend.vercel.app`. **Contexto relevante que excede esta
   feature:** los routers `finanzas`, `inversiones` y `cotizaciones` del backend
   **no tienen ninguna auth** (verificado en producción: `GET /api/categorias`
   devuelve 200 sin credencial, e incluso hay `DELETE` sin protección). Cerrar
   eso es una tarea aparte que rompe la web app y el móvil, y no es un cambio de
   una línea.
