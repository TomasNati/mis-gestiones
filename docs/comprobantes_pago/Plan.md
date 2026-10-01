# Plan de implementación — comprobantes de pago

> **Estado (2026-10-01, verificado contra el código):** pasos 1 y 3 **hechos**,
> paso 2 a medias. **Lo único que falta es el rename por comentario.**
>
> | | Estado |
> |---|---|
> | Almacenamiento (GitHub) | Hecho, en producción |
> | Tabla `finanzas_comprobante_pago` | DDL aplicado, modelo y queries en producción |
> | Endpoints | 5 de 6. Falta `PATCH` (rename) |
> | UI: ver comprobantes | Hecho (grilla + modal de edición) |
> | UI: subir comprobantes | Hecho |
> | UI: eliminar comprobante | Hecho — pide confirmación, borra el archivo y da de baja el registro |
> | UI: renombrar | **No empieza** |
> | Limpieza de Drive | Hecho |
>
> Commits del backend: `db30dc8` (subir/descargar por path) → `05a1ce3`
> (modelo) → `fb87577` (subir por `vencimiento_id`) → `53c9c19` (`/buscar`) →
> `fc95bd3` (se saca la API key) → **baja de comprobantes, sin pushear todavía**.
> Este repo: `d515703` → `6112f82` → `a91acb5` → `9402fbc`.

Documento derivado de [Design.md](./Design.md). El diseño original proponía hacer
todo desde la app web; la implementación definitiva se reparte así:

| Repo | Rol en esta feature |
|---|---|
| `TomasNati/comprobantes-pago` | Almacenamiento. Repo privado, los archivos son blobs de git |
| `../mis-gestiones-backend` (Python/FastAPI) | **Toda** la lógica: conexión con GitHub, tabla, endpoints, validaciones |
| `mis-gestiones` (este repo, Next.js) | Toda la UI. Le pega **al backend desde el browser**, sin proxy |

Motivo: el backend ya es el dueño del storage de comprobantes (hoy Google
Drive), ya tiene los modelos SQLAlchemy de `finanzas_vencimiento` y
`finanzas_subcategoria`. Además el upload a Drive ya había sido implementado y
eliminado por cuota (`docs/2026-04-20-google-drive-endpoints.md` en el repo del
backend, ya borrado), así que sus decisiones de tamaño, streaming y errores se
reutilizan tal cual.

> **El proxy server-side que exigía la primera versión del plan ya no existe ni
> tiene sentido.** Ese proxy era obligatorio solo porque el `BACKEND_SHARED_SECRET`
> no podía ir al bundle del browser; con la API key eliminada del router
> (backend `fc95bd3`) no queda ningún secreto que proteger, y la UI llama al
> backend directo con `NEXT_PUBLIC_BACKEND_BASE_URL`. Ver "Decisiones pendientes"
> §8, que es ahora el punto más delicado de la feature.

## Contexto técnico

### Del backend (`../mis-gestiones-backend`)

- FastAPI + SQLAlchemy 2.x, schemas `misgestiones` e `inversiones`, deploy en
  Vercel por integración con git sobre `main` (sin CI, sin tests, sin linter:
  **lo que se mergea a `main` es producción**).
- Los modelos SQLAlchemy viven en `structure.py` (raíz); `models/` es solo
  Pydantic DTOs; las queries en `db/gestiones.py`; los routers en
  `api/routers/`. Las tablas de finanzas se nombran `finanzas_<nombre sin
  underscore>` en el schema `misgestiones`.
- `Vencimiento` ya tiene `pagoId`/`pago` → `MovimientoGasto`. **El vencimiento
  está pagado** == `pagoId IS NOT NULL`. Hoy eso no se usa para nada: se decidió
  dejar adjuntar comprobantes a vencimientos impagos.
- `Subcategoria.comprobantesPath` (`comprobantes_path`, varchar 256) ya existe en
  la base, en `structure.py` y en el modelo Pydantic, y ya se edita desde
  `mis-gestiones-admin`.
- `httpx` y `python-multipart` ya están en `requirements.txt`. **No hace falta
  PyGithub.**
- No hay migraciones: el DDL se documenta en `docs/*.md` y se aplica a mano.
  Precedente: `docs/inversiones.md`.
- `main.py` ya tiene CORS con el origen de esta web app
  (`https://mis-gestiones-opal-kappa.vercel.app`) y
  `expose_headers=["Content-Disposition"]`.
- **No hay `api/security.py` ni `require_api_key`**: se borraron junto con la
  dependencia del router. El contrato vigente está en `docs/comprobantes.md`.

### De esta app web

- Server actions de Next.js tienen body máximo de 1MB, así que una subida no
  podría ir por server action. Irrelevante mientras no haya proxy: el browser
  sube con `FormData` directo al backend.
- El secreto del backend **no** puede ir al browser: nada de
  `NEXT_PUBLIC_BACKEND_SHARED_SECRET`. hoy no hay tal secreto (ver arriba).
- No hay tests; verificación con `yarn lint`, `yarn tsc --noEmit`, `yarn build` y
  prueba manual.

### Restricciones que condicionan la solución

| Restricción | Consecuencia |
|---|---|
| La Contents API devuelve el contenido en base64: por `GET` el límite por defecto es 1MB (se resuelve con `Accept: application/vnd.github.raw`, hasta 100MB) y por `PUT` acepta hasta 100MB | El tamaño **no** obliga a usar la Git Data API. Lo que sí pesa es la atomicidad: `PUT`/`DELETE` es un commit por archivo, así que una subida múltiple quedaría N commits (con rollback manual) y un rename son dos commits con una ventana sin archivo. Por eso la **escritura** va por la Git Data API y la **lectura** usa el media type `raw` |
| Vercel corta el body de las funciones serverless en **4.5MB**, tanto de request como de response (`413 FUNCTION_PAYLOAD_TOO_LARGE`) | El tamaño de upload sale de `MAX_UPLOAD_BYTES`, default **2.000.000** (2MB) y tope duro de **4.000.000** (4MB). El cap vale también para la **descarga**, que es una response |
| El repo es privado | La descarga se proxya desde el server con el PAT; nunca una URL `raw.githubusercontent.com` ni el token al browser |
| `comprobantes_path` es `varchar(256)` | El `subpath` se valida con tope de 256 caracteres en el backend, y `path + subpath` se arma en el cliente |
| `main` del backend deploya a producción sin gate | Verificar en local con `uvicorn` antes de mergear |
| Nombres candidatos para la tabla | **Resuelto**: `finanzas_comprobante_pago` |

---

## Paso 1 — GitHub, base de datos y endpoints (todo en `../mis-gestiones-backend`)

> **Hecho salvo `PATCH` y `DELETE`.** El upload/download "por path crudo" de la
> primera tanda fue **superado**: `POST /api/comprobantes` ahora recibe
> `vencimiento_id` y crea el registro de la tabla en el backend.

### 1.1 Conexión con GitHub — hecho

- [x] Fine-grained PAT sobre `TomasNati/comprobantes-pago` con permiso
      `Contents: Read and write` **únicamente** sobre ese repo.
- [x] Variables de entorno en `.env`, `.env.example` y panel de Vercel:
      `GITHUB_TOKEN`, `GITHUB_REPO_OWNER=TomasNati`,
      `GITHUB_REPO_NAME=comprobantes-pago`, `GITHUB_REPO_BRANCH=main`.
- [x] Identidad de autoría de los commits en el payload del commit, vía
      `GITHUB_COMMIT_AUTHOR_NAME` / `GITHUB_COMMIT_AUTHOR_EMAIL`.
- [x] `MAX_UPLOAD_BYTES` resuelta **una sola vez** al importar `github.py`:
      default **2.000.000**, tope duro de **4.000.000** con warning por log, y
      default también si no parsea o es `<= 0`.
- [x] `GET /api/comprobantes/limites` expone el límite efectivo, y la UI lo
      consume (`maxUploadBytes` en `vencimientos/page.tsx`).

### 1.2 Cliente de GitHub — hecho salvo dos funciones

- [x] `github.py` (raíz) con `httpx`, **reemplaza a `drive.py`**.
- [x] Operaciones de **escritura** sobre la **Git Data API**, con la rama
      resuelta en cada write (read → tree → commit → ref), para que una subida
      múltiple sea **un solo commit**:
      `obtener_sha_de_rama()`, `crear_blob()`, `crear_arbol()`,
      `crear_commit()`, `actualizar_ref()`.
- [x] Lectura con la Contents API y `Accept: application/vnd.github.raw`: un
      request, bytes directos, sin base64.
- [x] Funciones de dominio: `escribir_paths(entradas, mensaje)` (**un commit
      para N archivos**) y `leer_archivo(ruta)`.
- [x] `borrar_archivo(ruta)` — borra **un** archivo en un commit, por la Git
      Data API con `sha: None` en el árbol, y devuelve si existía. Por la misma
      razón que `escribir_paths` y no por el `DELETE` de la Contents API: la
      Contents API resuelve el ref en cada llamada, así que un borrado compite
      con una subida concurrente. Si el path no está devuelve `False` sin
      escribir nada, porque el llamador puede estar limpiando un registro que ya
      quedó huérfano.
- [ ] `renombrar_archivo(ruta_anterior, ruta_nueva)` — **no implementada**, falta
      para el `PATCH`.
- [x] `escribir_paths` y `leer_archivo` se ejecutan **en serie**.
- [x] `map_http_error` (404 → 404, 403 → 403, 401 → 502, resto → 502) y helper
      `_check()` delante de cada `raise_for_status()`, más el mapeo de errores de
      transporte en el router.
- [x] Chequeo de tamaño contra `MAX_UPLOAD_BYTES` **antes** de llegar a memoria:
      `Content-Length` primero, después conteo por chunks de 256KB → 413.

### 1.3 Construcción de rutas — resuelto, pero en el cliente

- [x] ~~`comprobantes.py` (raíz)~~ — **no se hizo y no se va a hacer**: el
      armado del `subpath` quedó en la UI (`prefijoAnioMes` +
      `nombreComprobanteArchivo` en `AgregarEditarModal.tsx` y
      `ComprobantesSection.tsx`). El backend recibe `base_path` y `subpath` ya
      armados y solo los valida.
- [x] Sanitización del path (`normalizar_path`): separadores Windows y Unix,
      descarta barras duplicadas, y **rechaza** `..`, segmentos ocultos, `:` y
      globbing, con tope de 1000 caracteres.
- [x] Allowlist de extensiones (`.pdf`, `.jpg`, `.jpeg`, `.png`, `.heic`) → 415.
- [x] Tope de 256 caracteres del `subpath`, y que termine en nombre de archivo.
- [x] Colisión de nombre: **409**, no sufijo numérico. Ver "Decisiones" §6.

### 1.4 Base de datos — hecho

- [x] Nombre decided: **`finanzas_comprobante_pago`** (la de `Design.md`).
- [x] Script `docs/comprobantes.sql` en el backend, idempotente, siguiendo el
      precedente de `docs/inversiones.md`. **Aplicado a la base** y verificado
      contra `information_schema`.
      - `id UUID PK`, `active BOOLEAN`, `vencimiento_id UUID NOT NULL` → FK a
        `finanzas_vencimiento`, `subpath VARCHAR(256) NOT NULL`.
      - FK **sin `ON DELETE`**, como las demás de finanzas: nada se borra hard.
      - Índice parcial en `vencimiento_id` y **único parcial** en
        `(vencimiento_id, subpath)` con `WHERE active`: refleja el 409 por
        colisión y deja reusar un nombre después de dar de baja el anterior.
- [x] Modelo `ComprobantePago` en `structure.py`.
- [x] DTOs Pydantic en `models/comprobantes.py`.
- [x] Queries en `db/gestiones.py`: `crear_comprobante_pago()`,
      `obtener_comprobante_pago_por_id()`, `obtener_comprobantes_por_vencimientos()`
      (solo `active`, con `selectinload` de `vencimiento.subcategoria`) y
      `dar_de_baja_comprobante_pago()`.
      - `crear_comprobante_pago` se llama **después** del commit de git, no
        antes: si la escritura falla no queda un registro apuntando a un blob que
        nunca se escribió.
      - `obtener_comprobante_pago_por_id` carga la relación con `selectinload`
        porque el llamador necesita el `comprobantes_path` de la subcategoría,
        y sin eso la relación es lazy y revienta con `DetachedInstanceError` al
        cerrarse la sesión.

### 1.5 Autenticación — **revertida a propósito**

- [x] ~~`require_api_key` en `api/security.py`~~. Se implementó y después se
  **sacaron**: el router `comprobantes` ya no tiene
  `dependencies=[Depends(require_api_key)]`, `api/security.py` no existe y
  `BACKEND_SHARED_SECRET` se borró del `.env`, del `.env.example` y de Vercel.
  Los tres endpoints son públicos, igual que `finanzas`, `inversiones` y
  `cotizaciones`. El razonamiento está en `docs/comprobantes.md` del backend y en
  "Decisiones pendientes" §8.

### 1.6 Endpoints — 5 de 6

Router `api/routers/comprobantes.py` con
`APIRouter(prefix="/api/comprobantes", tags=["Comprobantes"])`, registrado en
`main.py`.

- [x] `POST /api/comprobantes` — `multipart/form-data` con **`vencimiento_id`,
      `base_path`, `subpath` y `file`** (un archivo por request). Valida el uuid,
      que el vencimiento exista, `base_path` y `subpath` no vacíos, la extensión
      y el largo del `subpath`. Sube a GitHub, recién ahí crea el
      `finanzas_comprobante_pago`, y devuelve `201` con `id`, `commit`, `path`,
      `nombre`, `size`, `subpath` y `max_upload_bytes`.
      **Desvío del plan original:** ya no es por path crudo; `path` es
      `base_path + subpath` y el registro lo crea el backend.
      No hace falta que la carpeta exista: en git las carpetas no son objetos y
      la Git Data API las arma sola a partir del path del blob.
- [x] `POST /api/comprobantes/buscar` — body `["<uuid>", ...]`. Devuelve
      `total` y `comprobantes[]` agrupado por `vencimiento_id`, con un
      `comprobantes: []` por cada id pedido (incluso los que no tienen nada), lo
      que hace que la grilla no tenga que distinguir "sin comprobantes" de
      "no vino en la respuesta".
      - Deduplica ids y tiene tope de **100 por request**
        (`MAX_VENCIMIENTOS_POR_QUERY`), para que un body patológico devuelva un
        400 con nombre en vez de un `IN` enorme y un 500 opaco de postgres.
      - `path` se resuelve con `comprobantes_path` **de la subcategoria del
        vencimiento** (no con el `base_path` que mandaba el cliente al subir), y
        es `null` si la subcategoria no lo tiene o no normaliza. Por eso el
        ícono de descarga puede quedar deshabilitado con el tooltip de que
        falta el `comprobantes_path`.
      - Solo devuelve `active`: los dados de baja no aparecen.
- [x] `GET /api/comprobantes/descargar?path=<path completo>` — `def` (no
      `async def`), `StreamingResponse`, `Content-Disposition` con el nombre
      URL-quoteado y `media_type` deducido. 404 si el archivo no está en GitHub;
      413 si pasa `MAX_UPLOAD_BYTES`. **Sigue siendo por path**, no por `id`.
- [x] `GET /api/comprobantes/limites` — el `max_upload_bytes` efectivo, para que
      la UI valide antes de subir en vez de recibir un 413 seco.
- [x] `DELETE /api/comprobantes/{id}` — da de baja el registro (`active = false`)
      **y borra el archivo** del repo. A diferencia de la descarga, este sí
      consulta la base: el id es del registro y el path se arma con el
      `comprobantes_path` de la subcategoría del vencimiento.
      - **El orden es el inverso del alta y es deliberado: primero el blob,
        después la baja lógica.** Si el borrado del archivo falla, el registro
        sigue `active`, el comprobante sigue en la grilla y se reintenta; al
        revés queda un registro invisible apuntando a un blob huérfano que nadie
        puede volver a encontrar para borrar. Por eso el error de GitHub sale
        antes de tocar la base.
      - **Idempotente**: comprobante ya dado de baja o inexistente → 404; id no
        uuid → 422.
      - Un comprobante activo **cuyo archivo ya no está en el repo** se da de
        baja igual y responde `200` con `borrado: false`. Es el caso de
        reparación que la UI ya anticipa en el mensaje de descarga ("se puede
        haber borrado el archivo sin dar de baja el registro").
      - Sin `comprobantes_path` no hay contra qué borrar el archivo, pero el
        registro se da de baja igual (log por warning).
- [ ] `PATCH /api/comprobantes/{id}` — rename por comentario. **Depende de
      `renombrar_archivo`.**
- [x] Shape de errores `{ "error": ..., "message": ... }` con
      400/404/409/413/415/422/502. El 401 de la primera tanda ya no se emite:
      el router no pide credencial (§1.5).

### 1.7 Documentación — hecho

- [x] `docs/comprobantes.md` en el backend: contrato de los endpoints,
      variables de entorno, tabla de errores, y los detalles de implementación
      que no hay que romper. **Al día**, incluye `/buscar` y la sección de por
      qué no hay auth.
- [x] `docs/ECOSYSTEM_OVERVIEW.md` de este repo: `comprobantes` entre los
      endpoint groups, el repo `TomasNati/comprobantes-pago` como quinto repo del
      ecosistema, la tabla nueva en el ER diagram, y la nota de que es
      backend-only (sin Drizzle).
      **Le falta corregir el bullet de auth**, que todavía dice que
      `comprobantes` es el único grupo detrás de un secreto compartido.

### 1.8 Verificación — hecho

- [x] `python -c "import main"` y `uvicorn main:app --reload`.
- [x] Matriz con `curl` **en local** contra el repo real: subida simple,
      múltiple (1 commit, verificado), round-trip de bytes con `cmp`, 409 por
      path existente, 413 de subida (por `Content-Length` y por el lector por
      chunks) y de descarga, 404 de path inexistente, 415 de extensión, 400 de
      path vacío/traversal/largo, 401 de key inválida, 422 de header ausente.
- [x] Repo `TomasNati/comprobantes-pago` verificado sin basura de pruebas.
- [x] Commiteado y pusheado a `main` → **desplegado en producción**, y verificado
      contra producción.
- [x] `docs/comprobantes.md` § Verificación con la matriz de `curl` de
      `/buscar`: lote mixto (con comprobantes, dados de baja y inexistente),
      dedup que conserva el orden, y errores 400/422.
- [x] Lado web verificado con `yarn lint`, `yarn tsc --noEmit` y `yarn build`.
- [x] **Baja verificada contra la base y el repo reales**, en local con
      `uvicorn`: alta → `DELETE` → `200` con `borrado: true`; `/buscar` ya no lo
      devuelve; el path desaparece de `listar_paths()`; el mismo `subpath` se
      puede volver a subir (el índice único es `WHERE active`); `DELETE` de
      nuevo → 404, id inexistente → 404, id no uuid → 422; y el caso de
      reparación (blob borrado por fuera) → `200` con `borrado: false` y el
      registro igual de baja. Repo verificado sin archivos de prueba y filas de
      prueba borradas de la base.

#### Bugs encontrados y corregidos durante la verificación

Anotados porque son las trampas del diseño, no obvios al leer el código:

1. **Fuga del PAT en la descarga.** `GET /descargar?path=<carpeta>` devolvía
   `200` con el listado JSON de GitHub, que trae un `download_url` de
   `raw.githubusercontent.com` **con el token embebido**. Ahora `leer_archivo`
   descarta cualquier respuesta `application/json` y responde 404. Ese chequeo
   no es opcional: sin él, el endpoint filtra la credencial.
2. **`path` vacío escribía en la raíz del repo** con `201` en vez de `400`,
   porque `normalizar_path` descarta las barras iniciales. Hoy `base_path` y
   `subpath` se validan por separado del path completo.
3. **`map_http_error` era código muerto en el path de escritura.** Los seis
   helpers de la Git Data API usaban `raise_for_status()` crudo → 500 con stack
   trace. Se agregaron `_check()` y el mapeo de errores de transporte en el
   router.
4. **Un archivo en medio de una ruta de carpeta daba 500** (GitHub responde 422
   al crear el árbol). Ahora se detecta antes y devuelve `409` con `"ya hay un
   archivo donde va una carpeta"`.

Bug encontrado al agregar la baja, que no estaba en la lista porque no es un
fallo sino código muerto:

5. **`_path_resuelto` tenía el bloque de `normalizar_path` duplicado**, con el
   segundo copie después del `return` del primero: inalcanzable. No cambiaba
   ningún comportamiento, pero cualquier cambio futuro se aplicaba a una mitad y
   la otra quedaba vieja. Borrado.

---

## Paso 2 — UI en este repo

> **Parcial.** Ver y subir comprobantes está; falta eliminar y renombrar, que es
> justo lo que depende de los endpoints que no existen.

- [x] **Sin proxy server-side.** El browser llama al backend directo con
      `NEXT_PUBLIC_BACKEND_BASE_URL`, sin secreto. `src/app/api` no existe.
      El plan original daba este paso por obligatorio; se cayó junto con la API
      key (§1.5).
- [x] Tipos en `src/lib/definitions.ts`: `ComprobantePago`,
      `ComprobantePagoParaSubir`, `ComprobantePagoBusqueda`,
      `ComprobantesPorVencimiento`, `BusquedaComprobantesPago`,
      `LimitesComprobantes`, `ComprobanteErrorAPI`,
      `ComprobanteDetalleValidacion`, `MAX_VENCIMIENTOS_POR_BUSQUEDA`.
- [x] Llamadas en `src/lib/api.ts`: `subirComprobantePago`,
      `descargarComprobantePago`, `obtenerLimitesComprobantes`,
      `buscarComprobantesPago` y el helper `mensajeErrorComprobante`.
      - `buscarComprobantesPago` **parte los ids en tandas de 100** (el tope del
        backend) y las manda en paralelo con `Promise.allSettled`; si una tanda
        falla, lo loguea y sigue con las otras.
      - `descargarComprobantePago` es la que arma el `<a download>` con un
        `createObjectURL`, y traduce el 404 a un mensaje que dice que el archivo
        puede haberse borrado sin dar de baja el registro.
- [x] Estado en `src/app/finanzas/vencimientos/page.tsx`: `maxUploadBytes`
      (desde `/limites`), `comprobantesPorVencimiento` (desde `/buscar`, que se
      re-pide cada vez que cambian los vencimientos, con un token para que una
      respuesta lenta no pise una más nueva) y `subirComprobantes()` en el
      guardado, que sube **un request por archivo** y reporta los que fallaron
      sin perder los que sí subieron.
- [x] Columna `Comprobantes` en `VencimientoGrilla.tsx`: ícono de
      `AttachFile` si hay al menos uno, que abre `ComprobantesPopover` con la
      lista y la descarga de cada uno.
- [x] `ComprobantesSection` dentro de `AgregarEditarModal` (no de
      `CrearPagoModal`, que era donde el plan lo pedía): 3 lugares para elegir
      archivo (`MAX_COMPROBANTES`), un comentario por lugar, el
      `{año}/{Mes}` como adorno, el nombre final como caption, y
      `subpathsDuplicados` que **deshabilita Guardar** si dos comprobantes van a
      terminar con el mismo nombre.
- [x] Límite de tamaño leído de `/limites` (no hardcodeado), validado en dos
      lugares: al elegir el archivo y otra vez antes de subir.
- [x] `ComprobantesCargadosSection`: collapsible **debajo** del de subida, que
      no se renderiza si el vencimiento no tiene comprobantes. Lista el nombre de
      cada archivo con un botón de eliminar.
- [x] **Eliminar comprobante:** `ConfirmDeleteModal` (el de `components/comun`,
      el mismo que usan las otras bajas de la app) y, al confirmar,
      `eliminarComprobantePago(id)` en `api.ts`. El botón queda en spinner
      mientras corre para que un doble click no dispare dos `DELETE`.
- [x] La baja se refleja en `comprobantesPorVencimiento` de la página, así que
      la grilla actualiza el ícono y el conteo sin volver a pedir la lista: el
      id se saca del mapa y, si era el último, se borra la clave entera para que
      `?? []` siga resolviendo igual en la grilla.
- [ ] Editar el comentario de un comprobante existente, que debe renombrar el
      blob en GitHub y actualizar el `subpath`.
- [ ] Descargar desde la edición (hoy solo se descarga desde la grilla).
- [ ] `src/hooks/useComprobantes.ts` **no se hizo**: el estado quedó en la página
      y las llamadas en `api.ts`. Si alguna vez se quiere agregar estado, el
      precedente a seguir es `src/hooks/inversiones`.

---

## Paso 3 — Limpieza de endpoints que quedan sin uso — hecho

- [x] Confirmado que ningún cliente llama a los endpoints de Drive.
- [x] Borrados `api/routers/drive.py`, `drive.py` (raíz), `models/drive.py` y
      `docs/2026-04-20-google-drive-endpoints.md`.
- [x] Fuera `google-api-python-client` y `google-auth` de `requirements.txt`, y
      `GOOGLE_SA_CLIENT_EMAIL`, `GOOGLE_SA_PRIVATE_KEY`, `GOOGLE_DRIVE_FOLDER_ID`
      de `.env`, `.env.example` y de las variables de Vercel.
- [x] **`BACKEND_SHARED_SECRET` también se fue**, pero por el §1.5 y no por este
      paso: pasó a ser la credencial del router de comprobantes y después se
  eliminó del router. `MAX_UPLOAD_BYTES` se conserva.
- [x] `.env.example` del backend aclara que los comprobantes viven en el repo de
      GitHub, no en Drive.
- [ ] La documentación del ecosistema tiene el bullet de auth desactualizado
      (§1.7).

---

## Decisiones pendientes

1. **Tamaño máximo — resuelto.** `MAX_UPLOAD_BYTES`, default **2MB**
   (2.000.000 bytes) y tope duro de **4MB** (4.000.000) aplicado aunque la
   variable esté miseada, porque el body de una función de Vercel no puede
   pasar de 4.5MB. El mismo cap vale para la descarga, que es una response.
   Los 5MB del diseño original quedan reemplazados por este valor configurable.
2. **Nombre de la tabla — resuelto.** `misgestiones.finanzas_comprobante_pago`.
3. **Origen de `{año}/{mes}` — resuelto, en el cliente.** Se usa
   `vencimiento.fecha` (no `pago.fecha`) y el mes va como **nombre en
   castellano**: el resultado es `2026/Septiembre-factura.pdf`, no
   `2024/06-comprobante.pdf` del diseño. La razón de no usar `pago.fecha` es que
   difieren cuando una factura se paga con atraso y el comprobante debería
   archivarse junto al período al que pertenece, no al mes del pago.
   **Consecuencia a tener en cuenta:** el backend no puede verificar que el
   `subpath` corresponda al vencimiento, porque el `subpath` se arma en el
   cliente y no se cruza contra `vencimiento.fecha`.
4. **Repo y PAT — resuelto.** `TomasNati/comprobantes-pago`, privado, con PAT
   fine-grained de `Contents: Read and write` solo sobre ese repo.
5. **Alcance de "eliminar comprobante" — resuelto.** Es **baja lógica + borrado
   del archivo**: `active = false` en la fila (que no se borra, como el resto de
   finanzas) y el blob desaparece del repo en un commit. El índice único parcial
   de `(vencimiento_id, subpath)` está definido con `WHERE active`, así que la
   baja es además lo que libera el nombre para reutilizarlo. Ver §1.6 para el
   orden y para los casos borde.
6. **Colisión de nombres — resuelto por decisión de producto.** El upload
   **rechaza con 409** si el path destino ya existe, sin inventar nombres. Razón:
   un comprobante con nombre inventado es indistinguible del real en el repo, y
   el 409 obliga a decidir el nombre a propósito. La UI refuerza lo mismo antes de
   llegar al backend: `subpathsDuplicados` deshabilita Guardar.
7. **Contrato por path vs. por `vencimiento_id`.** La subida ya se movió a
   `vencimiento_id` y crea el registro en el backend, pero **la descarga sigue
   siendo por path crudo**, y el path lo arma el cliente a partir de
   `comprobantes_path` de la subcategoria. Quedan dos huecos:
   - No se valida que el `base_path` que manda el cliente sea realmente el
     `comprobantes_path` de la subcategoria del vencimiento: se puede escribir
     en cualquier carpeta del repo. La única defensa es la sanitización del path.
   - Un 404 de descarga no distingue "no existe" de "existe pero inactivo".
8. **Auth: el router de comprobantes quedó sin auth, y eso es lo más delicado
   que queda.** `finanzas`, `inversiones` y `cotizaciones` tampoco tienen auth
   (verificado en producción: `GET /api/categorias` devuelve 200 sin credencial, e
   incluso hay `DELETE` sin protección), así que `comprobantes` ya no es la
   excepción: es la norma. Lo único que separa a cualquiera que conozca
   `mis-gestiones-backend.vercel.app` de los comprobantes de pago es el basic
   auth de la web app, que es de Vercel y el backend ni lo ve (el CORS frena al
   JS del browser, no a un `curl`). El PAT de GitHub sí sigue sin salir del
   backend. Cerrar esto es una tarea aparte que rompe la web app, el móvil y el
   admin, y no es un cambio de una línea: la forma que ya se usó y se
   revirtió es un `dependencies=[Depends(require_api_key)]` a nivel de router,
   más el proxy server-side del lado web que el plan daba por obligatorio.