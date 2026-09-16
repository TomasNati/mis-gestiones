# Plan: Migrar la grilla de Movimientos a Material React Table (MRT)

Source doc: `docs/new-theme/movimientos-refactor.md`
Mock de referencia: `docs/new-theme/finanzas-rediseno-propuesta.html`

## Decisiones tomadas

- **Librería:** `material-react-table` v3.2.1 (ya es dependencia, usada en `BuscarMovimientosResultadosMRT`). Nota: el doc decía "material-react-grid", no existe; es MRT, "as in other pages".
- **Paginación:** se elimina — el mock muestra el mes completo. `enablePagination: false`.
- **Filtros de columna** (Fecha/Concepto custom): se descartan por ahora.
- **Agrupación por día:** grouping nativo de MRT.
- **Estilo:** seguir el patrón de `BuscarMovimientosResultadosMRT` (`.styles.ts` separado, `useMaterialReactTable` + `MaterialReactTable`, columnas con `useMemo`, hooks de sx `mui*Props`). Los colores ya usan CSS vars del tema.

## Fases

La migración se separa en fases para reducir riesgo. La **Fase 1** es la única prevista para hoy: reemplazar la grilla por MRT solo en modo lectura (add/edit desactivados), enfocada en el display de datos. Las fases posteriores habilitan edición/creación y las acciones del toolbar.

---

### Fase 1 — MRT en modo lectura (display data)

**Objetivo:** la grilla muestra los mismos movimientos, agrupados por día con subtotal, con selección por checkbox y el toolbar desplegado — sin funcionalidad de agregar/editar todavía.

**1.4 Data mapping (filas)**
- [x] Agregar campo derivado `dia` (del `fecha`, ya normalizado `setDateAsUTC` en la página) — derivado con `getUTCDate()` sobre la fecha UTC; se usa como columna oculta para agrupar.
- [x] Conservar el orden actual del mes: primero movimientos no-crédito, luego crédito (`obtenerMovimientos` en la página ya lo ordena; no tocar). **Nota:** se respeta el orden planificado del doc (sin reordenar créditos al final, decisión del usuario: solo agrupar por día).

**1.5 Componente nuevo `MovimientosDelMesGrillaMRT` + `MovimientosDelMesGrillaMRT.styles.ts`**
- [x] Crear `src/components/Movimientos/MovimientosDelMesGrilla/MovimientosDelMesGrillaMRT.tsx` + `.styles.ts` (patrón idéntico a `BuscarMovimientosResultadosMRT`).
- [x] Columnas en modo vista:
  - Categoría → `Cell: <EntidadNombre {...}/>`
  - Concepto → `valueFormatter` con `mapearSubcategoriasATiposDeConceptoExcel`, `Cell: <EntidadNombre/>` (mock: concepto con detalle debajo)
  - Tipo de pago → `Cell: <TipoDePagoVista/>` (mock: etiqueta con glyph)
  - Monto → `Cell: <TextWithCopy displayText={transformNumberToCurrenty} copyText/>`, alineado a la derecha, mono
  - Detalle (comentarios) → `TextWithCopy`
  - Columna oculta `dia` usada solo para agrupar
  - Columna de acciones (marginal) reservada para la Fase 2 — no renderizada aún
- [x] `enablePagination: false`, `enableSorting: false`, `enableColumnFilters: false`, `enableColumnActions: false`.
- [x] `mui*Props` de estilo equivalente a la grilla actual (fondo/padding/bordes por CSS vars).

**1.6 Agrupación por día (point 3 del doc)**
- [x] `enableGrouping: true` con `state.grouping = ['dia']`.
- [x] `groupedColumnMode: 'remove'` (la columna `dia` no se muestra).
- [x] `aggregationFn: 'sum'` / `MRT_AggregationFns.sum` en Monto → subtotal del día en `AggregatedCell` (nombre real de la render prop en v3, no `Aggregated`).
- [x] Estilado de filas de grupo vía `muiTableBodyRowProps` (`row.getIsGrouped()`): header del día (número + mes a la izquierda, "subtotal $ x" a la derecha).
- [x] `enableExpanding: false` + `enableExpandAll: false`, `groupedColumnMode: 'remove'` para ocultar el toggle de expandir.
- [x] Nota usuario (override del doc): **no** reordenar créditos al final; solo agrupar por día con días nuevos arriba.

**1.7 Selección + Suma parcial**
- [x] `getRowId: (row) => row.id`, `enableRowSelection` (solo una vez — sin duplicar): `(row) => !row.getIsGrouped()` (filas de grupo no seleccionables).
- [x] `onRowSelectionChange` → `rowSelection` de MRT; suma parcial de las filas seleccionadas vía `rowSelection` en `renderBottomToolbarCustomActions`.

**1.8 Toolbar (display)**
- [x] Toolbar custom como `renderTopToolbarCustomActions` con el layout actual (botones + Divider vertical + footer de acciones + spacer).
- [x] Botones Agregar / Agregar grupo / Eliminar renderizados pero **deshabilitados** (Fase 2 los conecta); Refrescar (funciona) + Exportar CSV (nuevo util, botón "Exportar", reemplaza `GridToolbarExport`).
- [x] Suma parcial en toolbar (bottom) con `transformNumberToCurrenty`.

**1.9 Wiring en la página**
- [x] `src/app/finanzas/movimientosDelMes/page.tsx` ahora importa/usar `MovimientosDelMesGrillaMRT` desde el barrel (`index.ts`), sin cambio de props (add/edit quedan opcionales/sin uso).
- [ ] Pendiente (Fase 3): borrar/desusar `MovimientosDelMesGrilla.tsx` viejo.

**1.A Verificación**
- [x] `tsc --noEmit` ✓ y lint ✓ (ambos pasan).
- [ ] Chequeo manual pendiente: cambio de tema, agrupación por día + subtotales, check-all + checkbox por movimiento, suma parcial, export CSV, refrescar.

---

### Fase 2 — Edición inline + Agregar (add/edit habilitados)

**2.1 Decoplar editores de MUI X (pre-requisito)**
- `editores/Fecha/Fecha.tsx`: eliminar `FechaEditInputCell`, `fechaOperators`, `FechaFilterInput`, `applyFilterFecha` y los imports de `@mui/x-data-grid`; conservar `Fecha` controlado (props: `value`, `onChange`, `onTabPressed`, `label`, `size`).
- `editores/Concepto/Concepto.tsx`: eliminar `conceptoOperators`, `ConceptoFilterInput` + imports de grid; conservar `Concepto` controlado.
- `editores/Monto/Monto.tsx`: eliminar `MontoEditInputCell`, `renderMontoEditInputCell`; conservar `NumberInput`.
- `editores/TipoDePago/TipoDePago.tsx` ya está libre de grid — sin cambios.
- Verificar que `GrupoModal`/`FilaGrupoModal` sigan compilando (usan `Concepto`/`TipoDePagoEdicion`).

**2.2 Edición inline (points 4 y 5 del doc)**
- `enableEditing: true` + `editDisplayMode: 'row'`.
- Celdas de edición custom vía prop `Edit` de cada columna, usando los editores extraídos (Fecha, Concepto, TipoDePagoEdicion, NumberInput). Fecha por defecto: hoy (si mes actual) o día 1 (portar lógica actual).
- Columna de acciones con ícono de editar que aparece en hover (mock `.edit-trigger`) + Guardar/Cancelar inline (mock `.save-btn`/`.cancel-btn`, similar a `MRT_EditActionButtons`).
- Portar la validación actual (`id && fecha && concepto && tipoDeGasto !== null && monto > 0.01`) a `onEditingRowSave`; si inválido, revertir (no commitear) — equivalente a `processRowUpdate` (MovimientosDelMesGrilla.tsx:203).
- Commit a través de `onMovimientoActualizado` (no cambia la API desde la página).

**2.3 Agregar fila top (point 6 del doc)**
- `creatingRow` + `onCreatingRowChange` (row de creación arriba en modo edición).
- Init del row: `isNew: true`, fecha = hoy si mes actual sino día 1.
- Commit en `onCreatingRowSave` por el mismo `onMovimientoActualizado`; luego actualizar `rows` (portar Flujo de `processRowUpdate`).

---

### Fase 3 — Acciones del toolbar + limpieza

- **Agregar** → conectar el botón del toolbar a `onCreatingRowChange` (habilitar).
- **Agregar grupo** → conectar `GrupoModal` (ya usado hoy, `GrillaToolbar.tsx:94`) en el toolbar de MRT.
- **Eliminar** → conectar `eliminarMovimientos` con `movimientosElegidos` (portar `handleEliminarMovimientos`).
- Quitar `@mui/x-data-grid` de `GrillaToolbar` únicamente (las otras grillas — Vencimiento/Presupuesto — siguen usándolo; la dependencia se mantiene).
- Eliminar el componente viejo `MovimientosDelMesGrilla.tsx` (o su archivo de estilos) si quedó sin uso.
- Verificación final completa: agregar, editar, eliminar, grupo, export, themes, notificaciones (`ConfiguracionNotificacion`).