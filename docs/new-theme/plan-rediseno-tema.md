# Plan: llevar el tema GitHub dark a toda la app

**Fuente de verdad:** `docs/mockups/` (guía visual en `index.html`, tokens y componentes en `assets/app.css`, sidebar/íconos en `assets/shell.js`, tabla mockup→código en `README.md` + sección "De aquí al código" de `index.html`).

**Objetivo:** reemplazar el estilo actual por el sistema de diseño de los mockups, **respetando el orden del menú, de arriba hacia abajo**, e **ignorando Importar** (se eliminará la opción del menú y sus páginas no entran en este plan).

**Reglas del sistema (resumen, detalle en `docs/mockups/index.html`):**
- Un solo acento (`--accent: #4493f8`, `--accent-emphasis: #1f6feb`); los semánticos (verde/ámbar/rojo/violeta) solo para **estado** y siempre junto a texto o ícono.
- Filas **nunca** pintadas enteras: el estado va en etiquetas (`.pill`).
- Números en IBM Plex Mono tabular; títulos y números de día en Space Grotesk; cuerpo en IBM Plex Sans.
- Profundidad por bordes y dos tonos de fondo; sombra **solo** en modales/tooltips.
- Frame compartido por página: breadcrumb (topbar) + tira de meses/tabs + clúster de stats + toolbar + tabla.
- Acciones de fila solo en hover; gráficos sobrios con una sola paleta `--series-1..8` y un solo eje.
- Todo el CSS compartido se porta desde `assets/app.css`; cada página solo aporta su contenido.

---

## Orden de implementación

Menú de los mockups (`shell.js` → `NAV` / `NAV_FOOTER`), de arriba hacia abajo:

1. ~~Fundamentos (prerequisito, fuera del menú)~~ → **Fase 0**
2. **Tomi** → `/tomi`
3. **Finanzas** (submenú):
   - Resumen → `/finanzas` *(nuevo)*
   - Movimientos → `/finanzas/movimientosDelMes`
   - Presupuesto → `/finanzas/presupuestoDelMes`
   - Vencimientos → `/finanzas/vencimientos`
   - Buscar → `/finanzas/buscarMovimientos`
4. **Inversiones** → `/inversiones`
5. **Configuración** (pie) → Categorías `/settings/admin` y API `/settings/api`

> ~~Importar~~ **excluido** del alcance: se quita del menú y no se replica su mockup.

---

## Fase 0 — Fundamentos (prerequisito, no sigue el orden de menú)

Base sobre la que se apoyan todas las páginas. Se hace una sola vez, antes de tocar contenido.

### 0.1 Tokens → `src/components/ThemeRegistry/theme-tokens.css`

Ampliar el bloque `:root` (hoy 14 vars) con los de `assets/app.css`, **conservando los nombres existentes** y agregando los faltantes:

- [ ] Fondos: `--bg-inset: #010409`, `--bg-overlay: #1c2129`, `--bg-emphasis: #3d444d`; **ajustar** `--bg-elevated: #212830` (hoy `#3d444d` es el elevated y ahora es `--bg-emphasis`) y `--bg-row-hover: #1f252e` (hoy `#262c36`).
- [ ] Bordes: `--border-muted: #262c36`.
- [ ] Texto: `--text-on-emphasis: #ffffff`.
- [ ] Acento extra: `--accent-emphasis`, `--accent-hover`, `--accent-ring`.
- [ ] Semánticos (base + soft + border + emphasis): `--success`, `--attention`, `--severe`, `--danger`, `--done`, `--neutral-*`.
- [ ] Series de gráficos: `--series-1..8`, `--series-muted`.
- [ ] Tipos/espaciado/radio/sombras: `--font-display/body/mono`, `--fs-11..32`, `--space-1..6`, `--gutter`, `--radius*`, `--shadow-overlay`, `--shadow-focus`, `--sidebar-w` (232), `--sidebar-w-collapsed` (56), `--control-h` (32), `--control-h-sm`, `--row-h` (40), `--ease`.
- [ ] Verificar que ningún valor actual usado en `globals.css`/componentes quede roto (buscar `var(--bg-elevated)` y `var(--bg-row-hover)`).

### 0.2 Tema MUI → `src/components/ThemeRegistry/theme.ts`

- [ ] Mapear semánticos a `palette.success / warning / error / info.secondary` con los valores nuevos (verde `#3fb950`, ámbar `#d29922`, rojo `#f85149`, violeta `#a371f7`).
- [ ] Actualizar `background` (`default #0d1117`, `paper #151b23`) y `divider` → `var(--border-muted)`.
- [ ] **`MuiDialog` global** (el mockup pide un único estilo de modal con sombra `--shadow-overlay`, header con subtítulo, footer con acciones a la derecha): paper `bg-overlay`, radius `--radius-lg`, `boxShadow: var(--shadow-overlay)`.
- [ ] Revisar `MuiCssBaseline`: los overrides de `.MuiDataGrid-root` siguen siendo necesarios solo en tanto queden grillas con x-data-grid (Presupuesto/Vencimientos); no migrar acá.
- [ ] Unificar botones: `textTransform: none`, `fontFamily: var(--font-display)`, alturas `--control-h`/`--control-h-sm` para `size="small"`.
- [ ] Mapear `MuiChip` para que herede `.pill` (si se decide implementar el pill como Chip) o dejarlo para el componente `Pill`.

### 0.3 Componentes compartidos nuevos → `src/components/` (carpeta nueva p.ej. `src/components/ui/`)

Piezas que el mockup define una sola vez y reutiliza en todas las páginas (mapeo de `index.html`):

- [ ] **`PageHeader`** — topbar con `breadcrumb` (raíz + `/` + actual) y `topbar-actions` a la derecha (botón primary). Sustituye los headers hechos a mano por página.
- [ ] **`MonthStrip` / `TabStrip`** — la tira `.months` con `.month-tab` (meses o tabs), `.count`, `.spacer`, `strip-end` (chips/segmented/switch según página). Se comporta como tabs (mock: `data-tabs`). Unificar con `docs/mockups` month tabs y con el segmented de Settings.
- [ ] **`StatsCluster`** — clúster generalizado de N stats (valor + label) con **meter** opcional y estados ámbar/rojo/violeta.
- [ ] **`Pill`** — etiqueta de estado/tipo: variantes `success`, `attention`, `danger`, `done`, `outline`, `accent` (+ `method` para API), con ícono opcional. Reemplaza los `Chip`/`label` dispersos.
- [ ] **`EmptyState`** — bloque `.empty` (ícono + h3 + p + acción).
- [ ] **`SkeletonRows`** — estado de carga consistente (Buscar pide skeleton).
- [ ] **Helper de tabla MRT** — `muiTableProps` compartido (densidad, bordes `--border-muted`, header `--bg-elevated`, fila hover `--bg-row-hover`, selección `--accent-soft`, mono alineado a derecha) para que Todas las grillas MRT luzcan igual. Referencia: el patrón ya usado en `BuscarMovimientosResultadosMRT` / `MovimientosDelMesGrillaMRT`.
- [ ] **Paleta `--series-*`** para `@mui/x-charts` (constante compartida) — un solo eje, sin múltiples colores por serie.

### 0.4 Shell / Sidebar → `src/components/Layout/Layout.tsx` + `Layout.styles.ts`

- [ ] Fondo del sidebar = `var(--bg-inset)` (mockup: sidebar separado por borde, no `--bg-panel`).
- [ ] **Anchos**: `--sidebar-w: 232` / `--sidebar-w-collapsed: 56` (hoy `200`/`85`).
- [ ] **Marca** con botón de colapso (brand-mark `M` + nombre; al colapsar solo el mark), como `shell.js`.
- [ ] **Activo por pathname** con `usePathname()` (hoy no resalta el actual): clase `is-active` en el item exacto e `is-parent-active` cuando un hijo está activo.
- [ ] **Submenú de Finanzas como riel**: el menú muestra Finanzas con su hija activa; el despliegue de Resumen/Movimientos/Presupuesto/Vencimientos/Buscar se resuelve según `shell.js` (nivel raíz + hijos). Definir si se expande en línea (como hoy) o como riel secundario — preferencia: mantener hijos visibles bajo el padre cuando un hijo está activo.
- [ ] **Menú final** (`LINKS`), en orden de mockup y **sin Importar**:
  - Tomi → `/tomi`
  - Finanzas → `/finanzas` con hijos: **Resumen** `/finanzas`, Movimientos, Presupuesto, Vencimientos, Buscar
  - Inversiones → `/inversiones`
  - ~~Importar~~ **eliminar** (item + `FileUploadIcon` import + rutas — ver Fase 10).
  - Footer: Configuración → Categorías `/settings/admin`, API `/settings/api` (renombrar labels desde "Admin/API Access").
- [ ] Íconos: reemplazar MUI icons por la correspondencia de `ICONS` (`shell.js`) donde aporte, o mantener MUI equivalentes (`smile`, `wallet`, `receipt`, `chart-bar`, `clock`, `search`, `chart-line`, `settings`, `folder-tree`, `plug`).
- [ ] Quitar `Divider` sobrantes; usar `--border-muted`.

**Verificación Fase 0:** `tsc --noEmit` ✓, lint ✓, y que la app compile viendo cualquier página con los tokens nuevos y el sidebar rediseñado.

---

## Fase 1 — Tomi → `/tomi`

Mockup: `docs/mockups/tomi.html`. Archivos actuales: `src/components/tomi/*` (`BarraSuenio.tsx`, `EditarDiaModal.tsx`, …) y `src/components/graficos/SuenioTomi.tsx`, `SuenioAnualTomi.tsx`.

**Decisiones sobre el mockup (aplicadas en `docs/mockups/tomi.html`):**
- [x] **Sin barra de progreso** en la fila de stats: se eliminó el `stat--wide` con meter "22 de 30 días registrados / 73 %". La fila queda con 4 stats.
- [x] **"Sueño nocturno promedio" sin comparación con el mes anterior**: se eliminó el delta `−8 m vs. agosto` (queda solo label + valor).
- [x] **Gráfico "Horas de sueño por día" = últimos 30 días**, con la última barra en el último día cargado (22 sep): ventana móvil 24 ago → 22 sep, separador punteado entre meses, eje con día de mes + fila de meses (`ago`/`sep`), etiqueta "última carga" sobre la última barra y hint `últimos 30 días · hasta el 22 sep`. **El comportamiento real ya es así** (`src/app/tomi/page.tsx`: `desde = hoy − 30`, `hasta = hoy`; `SuenioTomi.tsx` plotea ese rango) — solo se ajustó el mockup.
- [x] **Grilla de días del mes sin columna `Total`**: se eliminó la columna (header + 30 celdas). *Nota:* con eso se perdió el desglose "8 h 50 m + siesta 1 h 20 m" del día 10 (el tooltip del segmento de siesta en el timeline lo conserva).
- [x] **Gráfico diario con 4 categorías de color según horas dormidas** (no dos): `< 6 h` → `--danger`, `6–8 h` → `--attention`, `8–10 h` → `--accent`, `≥ 10 h` → `--success` (semáforo + leyenda con texto, según la regla "semánticos solo para estado y siempre junto a texto"). La leyenda ahora lista las 4 bandas en lugar de "Horas de sueño / Menos de 6 h". Con los datos actuales hay al menos un ejemplo de cada banda (4 h 45 m → rojo, 7 h 40 m → ámbar, 16 barras azules, 12 verdes). *Equivalente real en código:* el `colorMap` piecewise de `SuenioTomi.tsx` (umbrales 6/8/10 h) — migrarlo a estos tokens.
- [x] **Sin resaltar "hoy" en la grilla**: se quitó la clase `is-today` de la fila 22, sus 4 reglas CSS (fondo `--accent-soft`, barra `inset` de 2 px, texto de día en acento) y el sufijo `· hoy` (la celda vuelve a solo "martes").

**Cambios a código:**
- [ ] Aplicar `PageHeader` (breadcrumb Tomi) y el frame general.
- [ ] Reemplazar la tabla por `<Table>` nativa con las clases del mockup (el mockup **mantiene Table simple**, no MRT): fila de día con número en Space Grotesk, barra de sueño y acciones hover — **sin columna Total**.
- [ ] Modal `EditarDiaModal` → estilo `MuiDialog` global (header + subtítulo + footer).
- [ ] Gráficos: `SuenioTomi` → 4 bandas de color (`--danger` / `--attention` / `--accent` / `--success` en `colorMap.thresholds` de `SuenioTomi.tsx`, hoy `#df5e5e`/`orange`/`#199db3`/`#58ff58bf`) + leyenda de 4 bandas; `SuenioAnualTomi` con `--series-*`; un solo eje.
- [ ] Stats: 4 stats, sin meter de progreso ni delta vs. mes anterior.
- [ ] Verificar tabs/sección de días y estados (pill) según mockup.

---

## Fase 2 — Finanzas · Resumen → `/finanzas` *(página nueva)*

Mockup: `docs/mockups/finanzas-dashboard.html`. **Hoy no existe** (`src/app/finanzas/` no tiene `page.tsx`; el enlace `/finanzas` del sidebar no resuelve).

- [ ] Crear `src/app/finanzas/page.tsx` (dashboard Resumen).
- [ ] `PageHeader` "Finanzas / Resumen" + acción principal.
- [ ] `MonthStrip` de meses.
- [ ] `StatsCluster` con N stats + meter (estados ámbar/rojo/violeta).
- [ ] Bloques del mockup: resumen de movimientos/presupuesto/vencimientos y gráficos con `--series-*` (un solo eje).
- [ ] Conectar a los datos existentes (queries de movimientos/presupuesto/vencimientos).

---

## Fase 3 — Finanzas · Movimientos → `/finanzas/movimientosDelMes`

Mockup: `docs/mockups/finanzas-movimientos.html` (referencia, con mejoras). **Trabajo ya avanzado**: `docs/new-theme/movimientos-refactor-mrt.md` → Fases 1 y 2 completas; **Fase 3 pendiente**.

- [ ] **Completar Fase 3 pendiente** del refactor MRT:
  - Conectar "Agregar grupo" (`GrupoModal`, hoy en `GrillaToolbar.tsx:94`) al toolbar MRT.
  - Conectar "Eliminar" con `movimientosElegidos` (portar `handleEliminarMovimientos`).
  - Quitar `@mui/x-data-grid` de `GrillaToolbar` (la dependencia se mantiene por Presupuesto/Vencimientos).
  - Eliminar `MovimientosDelMesGrilla.tsx` viejo si quedó sin uso.
- [ ] Aplicar `PageHeader` + `MonthStrip` + `StatsCluster` del mockup (mejoras sobre la referencia actual).
- [ ] Migrar toolbar/estados al frame nuevo; usar `Pill` para tipo de pago/estado y `TextWithCopy` con mono alineado a derecha.
- [ ] Adoptar el helper `muiTableProps` compartido (Fase 0.3) para que sea idéntico al resto.
- [ ] Revisar grupos por día + subtotales, selección + suma parcial, export, refrescar.

---

## Fase 4 — Finanzas · Presupuesto → `/finanzas/presupuestoDelMes`

Mockup: `docs/mockups/finanzas-presupuesto.html`. Archivos: `src/components/presupuesto/GastosEstimadosDelMesGrilla.tsx`, `GrillaToolbar.tsx`, `InputPorcentaje.tsx`.

- [ ] **Migrar de `@mui/x-data-grid` a MRT** (hoy es DataGrid): usar el helper `muiTableProps`, sin paginación si el mockup no la muestra.
- [ ] Celdas con **semáforo** (`Pill`/barra) según % ejecutado (verde/ámbar/rojo) — nunca pintando la fila.
- [ ] `MonthStrip` con **chips multi-mes** (mockup: comparación de varios meses).
- [ ] `PageHeader` + `StatsCluster` + toolbar nuevo (`GrillaToolbar` → toolbar MRT compartido).
- [ ] Reusar editores ya desacoplados de x-data-grid (`editores/*`, ver Fase 2.1 del refactor MRT).

---

## Fase 5 — Finanzas · Vencimientos → `/finanzas/vencimientos`

Mockup: `docs/mockups/finanzas-vencimientos.html`. Archivos: `src/components/vencimientos/VencimientoGrilla/VencimientoGrilla.tsx`, `Toolbar/`, `ComprobantesPopover.tsx`.

- [ ] **Migrar de x-data-grid a MRT** (hoy DataGrid) con el helper compartido.
- [ ] **Pills de estado** por fila (pagado/pendiente/vencido…) en vez de pintar filas.
- [ ] Separador **"Hoy"** en la lista (mockup) — equivalente al agrupamiento por día del refactor de Movimientos.
- [ ] Rework del **popover de comprobantes** / slots de comprobante (mapeo de `index.html`).
- [ ] `PageHeader` + `MonthStrip` + `StatsCluster` + toolbar nuevo.

---

## Fase 6 — Finanzas · Buscar → `/finanzas/buscarMovimientos`

Mockup: `docs/mockups/finanzas-buscar.html`. Archivos: `src/components/Movimientos/BuscarMovimientosResultadosMRT.tsx`, `src/components/FiltrosMovimientos.tsx`.

- [ ] Ya es **MRT** (referencia de estilo); falta el frame: `PageHeader`, `MonthStrip`/filtros, `StatsCluster`.
- [ ] **Chips de filtros activos** con validación (mockup).
- [ ] Estados: **skeleton** de carga (`SkeletonRows`), **empty** (`EmptyState`), error.
- [ ] Aplicar `muiTableProps` compartido y `Pill` para estados.

---

## Fase 7 — Inversiones → `/inversiones`

Mockup: `docs/mockups/inversiones.html`. Archivos: `src/components/inversiones/` (`CrearEditarInversion.tsx`, `InversionesToolbar.tsx`, `HistorialInversiones.tsx`, …).

- [ ] `PageHeader` + tira/tabs + `StatsCluster`.
- [ ] Unificar la grilla de historial en **MRT** con el helper compartido (si aplica según mockup).
- [ ] Modal `CrearEditarInversion` → `MuiDialog` global.
- [ ] Pills de estado de inversión; gráficos con `--series-*`.

---

## Fase 8 — Configuración · Categorías → `/settings/admin`

Mockup: `docs/mockups/settings.html` (tab Categorías). Archivo actual: `src/app/settings/admin/page.tsx` (**hoy es un iframe** al admin externo → reemplazar por UI nativa).

- [ ] Reemplazar iframe por un **gestor de categorías nativo** siguiendo el mockup:
  - `PageHeader` "Configuración / Categorías" con acción "Nueva categoría".
  - `TabStrip` de Settings (Categorías `count 12` | API) + `strip-end`: segmented `Gestiones | Inversiones` y switch "Solo activas".
  - Toolbar: buscador (`.input sm search-input`), resumen "N categorías · M subcategorías", "Expandir todo".
  - Tabla con **grupos plegables** (fila `row-group` con caret, `cat-name`, mezcla `fijos/variables`, badge de cantidad, `Pill` Activa/Inactiva, acciones hover `editar / agregar sub / eliminar`), filas hija indentadas con `Pill` tipo FIJO/VARIABLE y nº de detalles.
  - Footer de tabla con notas y estado **empty** (`EmptyState` "Sin resultados").
  - Modal `Nueva categoría` (`catModal`) → `MuiDialog` global (nombre, segmented Sección/Tipo, switch Activa).
- [ ] Conectar a las queries/CUD existentes de categorías/subcategorías.

---

## Fase 9 — Configuración · API → `/settings/api`

Mockup: `docs/mockups/settings.html` (tab API, `#api`). Archivo actual: `src/app/settings/api/page.tsx` (**hoy iframe** a Swagger externo → reemplazar por UI nativa; mantener link "Abrir Swagger").

- [ ] Reemplazar iframe por panel nativo:
  - `PageHeader` "Configuración / API".
  - `TabStrip` (activa API).
  - Panel "Acceso a la API": `dl.kv` con URL base (copiable), Autenticación (Basic auth), Versión (`1.0.0 · OAS 3.1`) + botón "Abrir Swagger" (target `_blank`).
  - Panel "Endpoints": tabla densa con `Pill` por método (GET accent, POST success, PUT attention, DELETE danger), ruta en mono, descripción, grupo.
- [ ] Sincronizar breadcrumb y resaltado del menú footer según la tab activa (como el script de `settings.html`).

---

## Fase 10 — Limpieza y verificación global

- [ ] **Eliminar Importar**: quitar el item del menú (si no se hizo en Fase 0.4), decidir destino de `src/app/importar/` y `src/app/finanzas/importar/` (fuera de alcance del mockup → eliminar o dejar inaccesible; **confirmar con el usuario**), quitar `docs/mockups/importar.html` de la tabla del `README.md`.
- [ ] Borrar componentes/grillas viejos sin uso (DataGrid, `MovimientosDelMesGrilla.tsx`, estilos obsoletos).
- [ ] Verificación por página contra su mockup: frame (breadcrumb + strip + stats + toolbar + tabla), `Pill` en todos los estados, mono en números, hover-only en acciones de fila, sombras solo en modales, paleta `--series-*` en gráficos.
- [ ] `tsc --noEmit` ✓, lint ✓, build ✓.

---

## Notas y riesgos

- **No duplicar trabajo ya hecho**: Movimientos ya está en MRT con edición inline (Fases 1–2 del `movimientos-refactor-mrt.md`); este plan solo completa su Fase 3 y lo alinea al frame nuevo.
- **Presupuesto y Vencimientos aún usan `@mui/x-data-grid`** → son las migraciones más pesadas (Fases 4 y 5). `@mui/x-data-grid` sigue siendo dependencia hasta que ambas migraciones terminen.
- **Tokens con nombres en conflicto**: `--bg-elevated` y `--bg-row-hover` cambian de valor entre el código actual y el mockup; revisar todos los `var()` en uso antes de tocarlos (Fase 0.1).
- **Settings pasa de iframe a UI nativa** → implica asegurar que existan endpoints/CUD para categorías y que la info de API sea estática (la del mockup).
- **Resumen (`/finanzas`) es página nueva**: no existe hoy; hay que crearla y decidir qué datos reales mostrar.
- **Colaboración:** `docs/new-theme/` guarda los planes previos; este archivo convive con `movimientos-refactor-mrt.md`.
