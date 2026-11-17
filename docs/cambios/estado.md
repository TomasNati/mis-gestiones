# Estado actual de los cambios — Inversiones

**Fecha:** 2026-11-17
**Repositorios involucrados:** `mis-gestiones`, `mis-gestiones-backend`, `mis-gestiones-admin`
**Estado general:** Todos los pasos del plan están implementados: base de datos actualizada (columna `nombre_corto` `NOT NULL`), backend, admin y frontend. Falta únicamente la verificación en ambiente corriendo (integración con la BD y prueba manual de UI).

## Resumen

| # | Paso | Repositorio | Estado |
|---|------|-------------|--------|
| a | Scripts de la nueva columna `nombre_corto`, inicializada con `codigo` y luego `NOT NULL` | mis-gestiones (`docs/cambios`) | ✅ Aplicados en BD |
| b.1 | Endpoints de creación/edición de instrumentos manejan `nombreCorto` | backend | ✅ Implementado |
| b.2 | Endpoints que retornan instrumentos incluyen `nombreCorto` | backend | ✅ Implementado |
| b.3 | Filtro opcional por moneda en `/api/inversiones/inversiones-historico` | backend | ✅ Implementado |
| c.1 | Grilla de instrumentos muestra el nombre corto | admin | ✅ Implementado |
| c.2 | Modal de creación/edición maneja el nuevo campo | admin | ✅ Implementado |
| d.1 | Pantalla de Inversiones muestra `nombreCorto` en lugar de `codigo` | mis-gestiones | ✅ Implementado |
| d.2 | Filtro de grilla por tipo de moneda | mis-gestiones | ✅ Implementado |
| d.3 | Filtro de moneda enviado al gráfico *Evolución del total* | mis-gestiones | ✅ Implementado |

## Detalle

### a. Base de datos

- Script `05_instrumento_nombre_corto.sql`: **ejecutado**. Agregó `inversiones.instrumento.nombre_corto VARCHAR(50)`, lo inicializó con `codigo` y creó el índice.
- Script `06_instrumento_nombre_corto_not_null.sql`: **ejecutado**. Completó los valores NULL restantes con `LEFT(nombre, 50)` y aplicó `SET NOT NULL`.
- **Estado:** base de datos actualizada. El diagrama de `docs/ECOSYSTEM_OVERVIEW.md` ya incluye la columna.
- **Impacto:** los futuros `INSERT`/`UPDATE` de instrumentos deben enviar siempre el nombre corto (el backend lo expone como `nombreCorto` y acepta también `nombre_corto`).

### b. mis-gestiones-backend ✅

Cambios aplicados:

- `structure.py`: modelo ORM `Instrumento` con la columna `nombre_corto`.
- `models/inversiones.py`: `nombreCorto` en `InstrumentoCrear` / `InstrumentoOut` / `InstrumentoConPreciosOut` / `InstrumentoSimple` (acepta `nombreCorto` o `nombre_corto` en la entrada, responde siempre `nombreCorto`). `GetInversionesHistoricoParams` incorpora `moneda` como lista opcional.
- `db/inversiones.py`: `crear_instrumento` y `actualizar_instrumento` persisten el valor; `obtener_historico_inversiones` filtra por `Instrumento.moneda`.
- `api/routers/inversiones.py`: `POST /api/inversiones/instrumento`, `PUT /api/inversiones/instrumento/{id}`, `GET /api/inversiones/instrumento/{id}`, `POST /api/inversiones/instrumentos` y `POST /api/inversiones/inversiones-historico`.
- Validado con `py_compile` y pruebas de los modelos Pydantic (alias y serialización). Falta prueba de integración contra la BD.

Convención: columna en BD `nombre_corto` ↔ campo en API `nombreCorto` (igual que `instrumento_id` ↔ `instrumentoId`).

### c. mis-gestiones-admin ✅

Cambios aplicados:

- `src/model/types.ts` y `src/model/models.ts`: `nombreCorto` en el tipo `Instrumento` y en el schema (obligatorio, máximo 50 caracteres).
- `src/components/inversiones/Instrumentos.tsx`: nueva columna "Nombre corto" en la grilla (se conserva "Código").
- `src/dialogs/InstrumentoCreateEditDialog.tsx`: campo "Nombre corto" en el modal de creación/edición.
- Validado con `yarn build` (tsc + vite). `yarn lint` sigue con 4 errores preexistentes (`any` en `api.ts` / `Instrumentos.tsx` y `e` sin usar en el modal), no introducidos por estos cambios.

### d. mis-gestiones ✅

Cambios aplicados:

- `src/lib/definitions.ts`: `nombreCorto` en `Instrumento` y `moneda` en `HistorialInversionesPayload`.
- `src/app/inversiones/page.tsx`: la columna Instrumento muestra `nombreCorto`; la grilla filtra por moneda y el selector de opciones incluye las monedas presentes.
- `src/components/inversiones/CrearEditarInversion.tsx` y `EditarInversion.tsx`: etiquetas visibles con `nombreCorto`. El selector mantiene la búsqueda por código/ticker mediante `filterOptions`.
- `src/components/inversiones/InversionesFiltros.tsx`: nueva faceta "Moneda" (opciones, chips y valores por defecto).
- `src/components/inversiones/HistorialInversiones.tsx`: envía `moneda` al endpoint del histórico y la incluye en el resumen de filtros aplicados.
- Validado con `yarn build` (Next.js + TypeScript) y `yarn lint`, ambos sin errores.

### Fix de error de runtime en la barra de filtros

Se corrigió un `Maximum update depth exceeded` que aparecía al usar por primera vez la barra de filtros (el popover *Filtros* y el cuadro de búsqueda). El problema no venía de la faceta "Moneda" sino de la incorporación previa de esa barra:

- `InversionesFiltros.tsx`: el `Popover` usa `disableEnforceFocus`. El *focus trap* de MUI Modal entra en conflicto con el manejo de foco de Material React Table cuando ambos conviven en la misma página (caso reportado por MUI) y provocaba un ciclo de cambios de foco/estado.
- `page.tsx`: se memoiza el array `state.grouping` (`agrupamientoState`) con `useMemo`. Antes se creaba un array nuevo en cada render; como MRT lo usa como dependencia de efectos internos, cualquier actualización (como cambiar un filtro) podía derivar en un ciclo `setState → render → array nuevo → setState`.

## Notas

- Cambio solo visual en el frontend: `codigo` sigue siendo la clave para buscar precios (`src/lib/inversiones/precios.ts` no se modificó). El filtro de texto de la grilla también sigue buscando por nombre/código.
- `instrumento.moneda` ya existe en backend (`structure.py`, `enums.py`), así que el filtro no requiere otro cambio de esquema.
- Este documento se actualiza a medida que se avance en cada paso.
