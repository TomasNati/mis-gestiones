# Plan de implementación — comprobantes de pago

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

### 1.1 Conexión con GitHub

- [ ] Crear un fine-grained PAT sobre `TomasNati/comprobantes-pago` con permiso
      `Contents: Read and write` **únicamente** sobre ese repo.
- [ ] Agregar las variables de entorno siguiendo el estilo del repo:
      `GITHUB_TOKEN`, `GITHUB_REPO_OWNER=TomasNati`,
      `GITHUB_REPO_NAME=comprobantes-pago`, `GITHUB_REPO_BRANCH=main` — en
      `.env`, `.env.example` y en el panel de Vercel.
- [ ] Definir la identidad de autoría de los commits (name/email) en el payload
      del commit: el repo no tiene un `.gitignore` ni identidad configurada y los
      commits los crea el token, no una persona.
- [ ] Tamaño máximo de upload como variable de entorno. La variable ya existe en
      el repo (`MAX_UPLOAD_BYTES`, hoy en 4.000.000) así que se reutiliza el
      nombre; cambian el default y el clamp:
      - default **2.000.000** bytes (2MB) si no está definida o no parsea;
      - **tope duro de 4.000.000** bytes: si el valor configurado lo supera, se
        usa 4.000.000 y se loguea un warning, porque el body de la función no
        puede pasar de 4.5MB;
      - resolver el valor **una sola vez** al importar el módulo, no en cada
        request;
      - actualizar `.env`, `.env.example` y las variables de Vercel con el
        default nuevo, y dejar el clamp comentado junto a la definición.
- [ ] La UI (paso 2) tiene que leer el límite efectivo para validar en el cliente
      antes de subir, y no un número hardcodeado en el componente.

### 1.2 Cliente de GitHub

- [ ] `github.py` (raíz, reemplaza a `drive.py`) con `httpx`, replicando el patrón
      de import protegido de `drive.py` para que la app arranque igual si falta
      la librería.
- [ ] Operaciones de **escritura** sobre la **Git Data API**, con la rama
      resuelta en cada write (read → tree → commit → ref), para que una subida
      múltiple y un rename sean **un solo commit** cada uno:
      - `obtener_sha_de_rama()`
      - `crear_blob(contenido: bytes) -> sha` (binario va en base64)
      - `crear_arbol(base_tree_sha, entradas) -> sha` (alta: blob; baja:
        `sha: null`; rename: delete + add en el mismo árbol, atómico)
      - `crear_commit(parents, tree) -> sha`
      - `actualizar_ref(sha)`
- [ ] Lectura con la Contents API y `Accept: application/vnd.github.raw`: un
      request, bytes directos, sin base64. 404 si el archivo ya no está.
- [ ] Funciones de dominio: `subir_archivos(rutas, datos)` (un commit para N
      archivos), `leer_archivo(ruta)`, `borrar_archivo(ruta)`,
      `renombrar_archivo(ruta_anterior, ruta_nueva)`.
- [ ] Las escrituras de un mismo request se ejecutan **en serie**: GitHub
      documenta que `PUT` y `DELETE` de Contents en paralelo entran en
      conflicto. El rollback de una subida parcial va por el camino de Git Data,
      que no sufre ese conflicto.
- [ ] `map_http_error` copiado del patrón de `drive.py` (404 → 404, 403 → 403,
      resto → 502) y log en el borde.
- [ ] Chequeo de tamaño contra el valor resuelto de `MAX_UPLOAD_BYTES` (default
      2MB, clamp 4MB) **antes** de llegar a memoria: `Content-Length` primero,
      después conteo por chunks de 256KB abortando con 413. Es el patrón exacto
      del upload que se borró de Drive.
- [ ] Exponer el límite efectivo en la respuesta del listado (o en un endpoint de
      config) para que el cliente de la UI valide antes de subir y muestre el
      error en el mismo mensaje, en vez de recibir un 413 seco.
- [ ] Smoke test manual: crear un blob de prueba, leerlo, renombrarlo y borrarlo
      en el repo real.

### 1.3 Construcción de rutas

- [ ] `comprobantes.py` (raíz, junto a `drive.py`) con el armado del `subpath`
      según el diseño: `{año}/{mes}{-comentario}.{ext}`, tomado de
      `vencimiento.fecha`.
- [ ] Comentario slugificado (sin acentos, sin espacios ni caracteres raros),
      omitido cuando está vacío y se sube un solo archivo.
- [ ] Sufijo numérico ante colisión de nombre dentro del mismo `path`.
- [ ] Allowlist de extensiones (pdf, jpg, png, heic) y deducción de MIME con
      `mimetypes.guess_type` como fallback cuando el cliente manda
      `application/octet-stream` (React Native/Expo).
- [ ] Recorte del subpath para no exceder el `varchar(256)` de
      `comprobantes_path` ni la longitud de path de GitHub.
- [ ] `path` completo = `subcategoria.comprobantesPath` + `subpath`, normalizado
      sin barras duplicadas.

### 1.4 Base de datos

- [ ] DDL idempotente documentado en `docs/comprobantes.md` del repo del backend
      (patrón de `docs/inversiones.md`): `CREATE SCHEMA IF NOT EXISTS
      misgestiones`, `pgcrypto`, `CREATE TABLE IF NOT EXISTS`, índice por
      `vencimiento_id` y único parcial sobre `(vencimiento_id, subpath)` con
      `active = true`. Aplicar a mano.
- [ ] Modelo `ComprobantePago` en `structure.py`: `id`, `vencimientoId`
      (FK a `misgestiones.finanzas_vencimiento`), `subpath`, `comentarios`,
      `active`, `__table_args__ = {'schema': 'misgestiones'}`.
- [ ] Desvío deliberado respecto del doc: **no** se agrega `path` a
      `finanzas_movimientogasto`. El doc dice una cosa y después la supera; la
      raíz sale de `Subcategoria.comprobantesPath`, que ya existe. Sí se agrega
      `comentarios TEXT`, porque el rename necesita persistir el comentario y la
      lista de campos del doc lo omite.
- [ ] Queries en `db/comprobantes.py` con la convención de `db/gestiones.py`
      (`obtener_*`, `crear_*`, `actualizar_*`, `eliminar_*`; un
      `with Session(database.engine)` por función; baja lógica con `active =
      False`; `selectinload` para la relación con `Vencimiento`).
- [ ] DTOs Pydantic en `models/comprobantes.py` con `Config.from_attributes`, y
      los wrappers de lista que usa el resto de la API.

### 1.5 Autenticación

- [ ] Extraer `require_api_key` de `api/routers/drive.py` a `api/security.py` para
      que el router nuevo lo reutilice en vez de duplicarlo (y quede listo para el
      paso 3, que borra el de Drive).

### 1.6 Endpoints

Router nuevo `api/routers/comprobantes.py` con
`APIRouter(prefix="/api/comprobantes", tags=["Comprobantes"])`, **sin** repetir el
prefijo en los decoradores (el router de Drive tiene ese bug y expone
`/api/drive/api/drive/...`). Registrarlo en `main.py` (import + `include_router`).

- [ ] `POST /api/comprobantes` — `multipart/form-data` con `vencimiento_id`,
      `comentario` opcional y `files: List[UploadFile]`. Valida en el server:
      vencimiento existente y `active`, `pagoId IS NOT NULL` (regla dura del
      diseño), `comprobantesPath` no vacío, tamaño por archivo contra
      `MAX_UPLOAD_BYTES` y extensiones. Sube a GitHub y recién después inserta
      las filas; ante un fallo parcial borra los archivos ya subidos y revierte
      lo insertado.
- [ ] `GET /api/comprobantes?vencimiento_ids=a,b,c` — lectura por lote, para que la
      grilla resuelva en un solo request cuántos comprobantes tiene cada
      vencimiento. La respuesta incluye el `max_upload_bytes` efectivo.
- [ ] `GET /api/comprobantes/{id}/descargar` — `def` (no `async def`) con
      `StreamingResponse`, `Content-Disposition` con el nombre URL-quoteado y
      `media_type` deducido. Resuelve `path + subpath`; 404 si el archivo ya no
      está en GitHub.
- [ ] `PATCH /api/comprobantes/{id}` — body con el nuevo `comentario`: calcula el
      subpath nuevo, renombra en GitHub y actualiza la fila. 409 si el nombre
      destino ya existe.
- [ ] `DELETE /api/comprobantes/{id}` — baja lógica de la fila + borrado del
      archivo en GitHub.
- [ ] Shape de errores `{ "error": ..., "message": ... }` con 400/401/404/409/413/415/502,
      como en el router de Drive.

### 1.7 Documentación

- [ ] Actualizar `docs/ECOSYSTEM_OVERVIEW.md` de este repo para listar el grupo
      `comprobantes` entre los endpoint groups del backend y volver a citar Drive
      donde corresponda.
- [ ] Documentar los endpoints nuevos en `docs/` del repo del backend (el
      `/docs` de FastAPI se regenera solo, pero el README del repo de
      comprobantes conviene mantenerlo como spec).

### 1.8 Verificación

- [ ] `python -c "import main"` y `uvicorn main:app --reload --port 5001`.
- [ ] Matriz con `curl` contra los 5 endpoints con `X-API-Key`: subida simple,
      subida múltiple, listado, descarga (verificar bytes y `Content-Disposition`),
      rename, delete; y los casos de error: sin key, sin pago, path vacío,
      archivo demasiado grande, extensión no permitida, nombre destino repetido.
- [ ] Confirmar en el repo `TomasNati/comprobantes-pago` que quedaron los commits
      esperados y que no hay basura de las pruebas.
- [ ] Recién ahí, commit y push a `main` (despliegue a producción).

---

## Paso 2 — UI en este repo (solo mención, no se ejecuta en esta tanda)

- [ ] Proxy server-side en `src/app/api/comprobantes/**/route.ts` que reenvía al
      backend agregando `X-API-Key` desde el server. Route Handler, no server
      action, por el límite de 1MB. El secreto nunca llega al browser.
- [ ] Tipo `ComprobantePago` en `src/lib/definitions.ts`.
- [ ] Columna de comprobantes en `VencimientoGrilla.tsx`: ícono de descarga si
      hay uno solo, ícono de lista si hay varios.
- [ ] `ComprobantesModal` con la lista y la descarga de cada uno.
- [ ] Selector de archivos + validación de tamaño en `CrearPagoModal.tsx`.
- [ ] Sección de comprobantes en `AgregarEditarModal.tsx` con descargar, eliminar,
      cambiar el comentario y agregar nuevos.
- [ ] Hooks `src/hooks/useComprobantes.ts`, siguiendo el precedente de
      `src/hooks/inversiones`.

Depende de que los endpoints del paso 1 queden con el contrato congelado.

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
2. **Nombre de la tabla.** Recomendación: `misgestiones.finanzas_comprobante_pago`
   (la de `Design.md`, que es la más descriptiva). Choca con la convención de
   nombres de casa sin underscores.
3. **Origen de `{año}/{mes}`.** `vencimiento.fecha` o `pago.fecha`: difieren
   cuando una factura se paga con atraso. El plan asume `vencimiento.fecha`.
4. **Repo y PAT.** `TomasNati/comprobantes-pago` está definido; falta confirmar
   quién crea el token y si el repo sigue siendo privado.
5. **Paso 3.** Interpretado como la limpieza de los endpoints de Drive. Confirmar
   que ese era el alcance buscado.
