# Estado actual de los cambios — Inversiones

**Fecha:** 2026-11-17
**Repositorios involucrados:** `mis-gestiones`, `mis-gestiones-backend`, `mis-gestiones-admin`
**Estado general:** La base de datos está actualizada (columna `nombre_corto` `NOT NULL`), y el backend y el admin ya implementan el nuevo campo. El backend también soporta el filtro por moneda. Queda pendiente el frontend (`mis-gestiones`).

## Resumen

| # | Paso | Repositorio | Estado |
|---|------|-------------|--------|
| a | Scripts de la nueva columna `nombre_corto`, inicializada con `codigo` y luego `NOT NULL` | mis-gestiones (`docs/cambios`) | ✅ Aplicados en BD |
| b.1 | Endpoints de creación/edición de instrumentos manejan `nombreCorto` | backend | ✅ Implementado |
| b.2 | Endpoints que retornan instrumentos incluyen `nombreCorto` | backend | ✅ Implementado |
| b.3 | Filtro opcional por moneda en `/api/inversiones/inversiones-historico` | backend | ✅ Implementado |
| c.1 | Grilla de instrumentos muestra el nombre corto | admin | ✅ Implementado |
| c.2 | Modal de creación/edición maneja el nuevo campo | admin | ✅ Implementado |
| d.1 | Pantalla de Inversiones muestra `nombreCorto` en lugar de `codigo` | mis-gestiones | ⬜ Pendiente |
| d.2 | Filtro de grilla por tipo de moneda | mis-gestiones | ⬜ Pendiente |
| d.3 | Filtro de moneda enviado al gráfico *Evolución del total* | mis-gestiones | ⬜ Pendiente |

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

### d. mis-gestiones ⬜

- `src/lib/definitions.ts`: interfaz `Instrumento` (agregar `nombreCorto`).
- `src/app/inversiones/page.tsx`: reemplazar `instrumento.codigo` por `instrumento.nombreCorto` en la columna y en la búsqueda visual (líneas ~427, ~434-435 y ~712). La búsqueda de precios debe seguir usando `codigo`.
- `src/components/inversiones/InversionesFiltros.tsx` y `InversionesToolbar.tsx`: filtro por tipo de moneda.
- `src/components/inversiones/HistorialInversiones.tsx` y `HistorialInversionesGrafico.tsx`: propagar la moneda al gráfico *Evolución del total*.

## Notas

- Cambio solo visual en el frontend: `codigo` sigue siendo la clave para buscar precios.
- `instrumento.moneda` ya existe en backend (`structure.py`, `enums.py`), así que el filtro no requiere otro cambio de esquema.
- Este documento se actualiza a medida que se avance en cada paso.
