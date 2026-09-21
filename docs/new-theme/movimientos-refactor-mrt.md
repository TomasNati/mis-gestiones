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
- [x] Chequeo manual pendiente: cambio de tema, agrupación por día + subtotales, check-all + checkbox por movimiento, suma parcial, export CSV, refrescar.

---

### Fase 2 — Edición inline + Agregar (add/edit habilitados)

**2.1 Decoplar editores de MUI X (pre-requisito)**
- `editores/Fecha/Fecha.tsx`: eliminar `FechaEditInputCell`, `fechaOperators`, `FechaFilterInput`, `applyFilterFecha` y los imports de `@mui/x-data-grid`; conservar `Fecha` controlado (props: `value`, `onChange`, `onTabPressed`, `label`, `size`).
- `editores/Concepto/Concepto.tsx`: eliminar `conceptoOperators`, `ConceptoFilterInput` + imports de grid; conservar `Concepto` controlado.
- `editores/Monto/Monto.tsx`: eliminar `MontoEditInputCell`, `renderMontoEditInputCell`; conservar `NumberInput`.
- `editores/TipoDePago/TipoDePago.tsx` ya está libre de grid — sin cambios.
- Verificar que `GrupoModal`/`FilaGrupoModal` sigan compilando (usan `Concepto`/`TipoDePagoEdicion`).

**2.2 Edición por panel que reemplaza la fila (mix inline/modal — decisión del usuario)**
- Click sobre una fila (o su botón hover) → la fila se **oculta** (`display: none` vía `muiTableBodyRowProps`) y en su lugar se renderiza un panel a ancho completo (colSpan) con **todos** los campos: Día (puede cambiar la fecha), Categoría y concepto (autocomplete `Concepto`), Tipo de pago (`TipoDePagoEdicion`), Monto (`NumberInput`), Comentarios (`TextField`) + Guardar/Cancelar.
- Implementado con `renderDetailPanel` + expansión controlada: `state.expanded` pasa a ser un objeto con los ids de grupo `dia:N` (ya no booleano `true`, para que las hojas no abran paneles vacíos). La celda `mrt-row-expand` solo muestra el caret para filas de grupo (override via `displayColumnDefOptions`); en hojas no se renderiza nada.
- `abrirPanel(row)` marca `editandoId` + expande el leaf; `cerrarPanel()` colapsa y limpia `editandoId`; Escape en el paper cierra. Guardar: valida (`id && dia válido && concepto && tipoDeGasto != null && monto > 0.01`), commitea con `onMovimientoActualizado`, actualiza el mirror `filas` y re-expande el día destino si el día cambió.
- El toggle del toolbar de expandir/contraer ahora es un botón custom (`toggleExpandirDias`) que solo alterna las filas de grupo (no las hojas), porque `MRT_ExpandAllButton` expandiría todos los leaves mostrando paneles vacíos.
- Edición agrupada: `FilaMovimientoPanel.tsx` (componente propio).

**2.3 Agregar fila (point 6 del doc) — panel nuevo en el día actual**
- [x] El botón "Agregar" del toolbar (antes deshabilitado) ahora inserta una **fila sintética** (`id: 'nuevo-<timestamp>'`, `isNew: true`) en el tope del mirror `filas` y abre su panel vía el mismo mecanismo (`editandoId` + expansión). La fila nueva queda agrupada bajo el día actual (hoy si el mes mostrado es el actual, si no día 1), primeros en el grupo (días nuevos arriba).
- [x] `FilaMovimientoPanel` detecta `fila.isNew`: concepto inicia `null` (obligatorio elegirlo), botón "Agregar" (vs "Guardar"), label "Agregando movimiento". La validación reusa la misma (`id` es el tempId, válido).
- [x] Guardar nuevo → `onMovimientoActualizado` (isNew) crea vía `crearMovimientos` y devuelve el movimiento con id real; `handleGuardar` reemplaza la fila tempId por la real (`isNew: false`) in-place, re-expande el día destino y cierra el panel.
- [x] Cancelar/Escape/cerrar mientras `isNew` → la fila sintética se **elimina** del mirror (`cerrarPanel` filtra `f.isNew` con el id en edición; portar el flujo de `processRowUpdate`/Escape del grid viejo). El CSV export filtra filas `isNew` (no exportar filas en edición).

---

### Fase 3 — Acciones del toolbar + limpieza

- **Agregar** → conectado en 2.3 (botón → fila sintética + panel). ✔
- **Agregar grupo** → conectar `GrupoModal` (ya usado hoy, `GrillaToolbar.tsx:94`) en el toolbar de MRT.
- **Eliminar** → conectar `eliminarMovimientos` con `movimientosElegidos` (portar `handleEliminarMovimientos`).
- Quitar `@mui/x-data-grid` de `GrillaToolbar` únicamente (las otras grillas — Vencimiento/Presupuesto — siguen usándolo; la dependencia se mantiene).
- Eliminar el componente viejo `MovimientosDelMesGrilla.tsx` (o su archivo de estilos) si quedó sin uso.
- Verificación final completa: agregar, editar, eliminar, grupo, export, themes, notificaciones (`ConfiguracionNotificacion`).

**Estado hoy (canonical git, verificado):** Fase 1 completa — tsc --noEmit exit 0; columnas: Fecha/Categoría/Concepto/Tipo de pago/Monto con anchos 100/100/250/130/150; density dense en initialState; toolbar custom actions con misma altura de la barra derecha. **Fase 2 completa (2.1 + 2.2 + 2.3)** — edición por panel que reemplaza la fila (click o botón hover) y **Agregar** (panel en fila nueva agrupada en el día actual, valor por defecto hoy/día 1). Pendiente verificación manual en navegador. Fase 3 pendiente.