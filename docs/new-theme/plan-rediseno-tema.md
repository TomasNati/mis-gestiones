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

### 0.1 Tokens → `src/components/ThemeRegistry/theme-tokens.css` — ✅ **hecho**

Ampliar el bloque `:root` (tenía 14 vars) con los de `assets/app.css`, **conservando los nombres existentes** y agregando los faltantes (78 tokens, `color-scheme: dark`, agrupados por comentario):

- [x] Fondos: `--bg-inset: #010409`, `--bg-overlay: #1c2129`, `--bg-emphasis: #3d444d`; **ajustar** `--bg-elevated: #212830` (el `#3d444d` que era "elevated" ahora es `--bg-emphasis`) y `--bg-row-hover: #1f252e` (era `#262c36`).
- [x] Bordes: `--border-muted: #262c36`.
- [x] Texto: `--text-on-emphasis: #ffffff`.
- [x] Acento extra: `--accent-emphasis`, `--accent-hover`, `--accent-ring`.
- [x] Semánticos (base + soft + border + emphasis): `--success`, `--attention`, `--severe`, `--danger`, `--done`, `--neutral-*`.
- [x] Series de gráficos: `--series-1..8`, `--series-muted`.
- [x] Tipos/espaciado/radio/sombras: `--font-display/body/mono`, `--fs-11..32`, `--space-1..6`, `--gutter`, `--radius*`, `--shadow-overlay`, `--shadow-focus`, `--sidebar-w` (232), `--sidebar-w-collapsed` (56), `--control-h` (32), `--control-h-sm`, `--row-h` (40), `--ease`.

**Verificación y notas:**
- [x] Script que cruza todos los `var(--x)` usados en `src/**` contra los definidos: **sin tokens faltantes** (los `--font-*` que ya usaba `globals.css` antes no estaban definidos; ahora sí).
- [x] `npx tsc --noEmit` → exit 0.
- [x] Se **eliminó `--bg-row-alt`** (definido pero sin ningún uso en `src/`).
- Efecto inmediato de los dos cambios de valor (superficies que ya se ven afectadas):
  - `--bg-elevated` (#3d444d → #212830): headers de `MuiDataGrid` (`theme.ts`), chips de MRT, fila de grupo de Movimientos, track de `MuiLinearProgress` y de `StatsCluster` — todos en el sentido del mockup (`.chip`, `.meter` usan `--bg-elevated`).
  - `--bg-row-hover` (#262c36 → #1f252e): hover de filas MRT/DataGrid y del sidebar.
  - Los headers de tabla quedarán en `--bg-page`/`--bg-panel` (como `.table thead th`) en las fases de cada página.
- 64 de los tokens nuevos todavía no se consumen: los usan 0.3 (componentes), 0.4 (sidebar) y las fases de páginas.

### 0.2 Tema MUI → `src/components/ThemeRegistry/theme.ts` — ✅ **hecho**

- [x] Mapear semánticos a `palette.success / warning / error / info` con los valores nuevos: `success #3fb950` (+ `dark #238636`), `warning #d29922` (+ `dark #9e6a03`), `error #f85149` (+ `dark #da3633`), `info #a371f7` (el violeta `--done` del sistema). Se agregó `contrastText: #FFFFFF` a cada uno.
  - **Necesario** para `VencimientoGrilla.tsx`, que ya usaba `theme.palette.success/warning/error.{main,dark}`; antes caía en los defaults de MUI y ahora toma los colores del tema.
- [x] Actualizar `background` (`default #0d1117`, `paper #151b23`) y `divider` → `var(--border-muted)`; se agregó `text: { primary, secondary, disabled }` con los tokens.
- [x] **`MuiDialog` global**: paper `--bg-overlay`, borde `--border-soft`, radius `--radius-lg`, `boxShadow: var(--shadow-overlay)`, `backgroundImage: none`; inputs dentro del modal en `--bg-inset` (como `.modal .input`). Se estilaron `MuiDialogTitle` (padding 14/16, borde inferior, Space Grotesk 16/600), `MuiDialogContent` (16) y `MuiDialogActions` (12/16, borde superior, alineado a la derecha, gap 8) para replicar `.modal-header/body/footer`.
- [x] `MuiCssBaseline`: se **conservan** los overrides de `.MuiDataGrid-*` y `MuiLinearProgress` (siguen haciendo falta mientras queden grillas con `@mui/x-data-grid`: Presupuesto y Vencimientos). No se migró nada acá.
- [x] Unificar botones: `textTransform: none`, `fontFamily: Space Grotesk`, `fontSize: 13/500`, `height: var(--control-h)` (`--control-h-sm` + 12.5px en `size="small"`), `borderRadius: var(--radius)`, `padding: 0 12px` (10px en small) y `disableElevation` por defecto. `containedPrimary` pasó a `--accent-emphasis` con texto `--text-on-emphasis` y hover `--accent-hover` (como `.btn.primary`); `outlinedPrimary` usa borde `--border-soft`/hover `--border-strong`.
- [x] **`MuiChip`: se deja para el componente `Pill` (0.3).** Decisión: el pill del mockup (`success/attention/danger/done/outline/accent`) lleva lógica de variantes; conviene resolverlo una sola vez en el componente y no forzar alturas/colores en todos los `Chip` existentes. Mientras tanto los chips ya toman `--bg-elevated` con el valor nuevo.
- [x] Extras de consistencia: se reemplazaron hex hardcodeados por tokens (`--accent`, `--accent-emphasis`, `--text-tertiary`, `--border-soft`, `--bg-emphasis`, `--text-primary`, `--accent-soft`) en `MuiAlert`, `MuiSelect` y `MuiToggleButton` (selected pasa de `accent-soft` a `bg-emphasis`, como el `.segmented` del mockup). En el `Alert` de `severity="info"` se fijó texto/ícono en `--text-on-emphasis` porque el fondo es el acento sólido (antes el ícono tomaba el color de `palette.info` y quedaba azul sobre azul).

**Verificación:** `npx tsc --noEmit` → exit 0; `npx eslint theme.ts` → sin errores. `git diff HEAD` confirma que no se perdió ningún override previo (solo agregados/cambios).

> Nota: los cambios de `MuiButton` (altura fija 32/28, `containedPrimary` más oscuro `#1f6feb`, sin elevación) y de `MuiDialog` se ven en TODA la app desde ya, antes de migrar cada página.

### 0.3 Componentes compartidos nuevos → `src/components/ui/` — ✅ **hecho**

Piezas que el mockup define una sola vez y reutiliza en todas las páginas (mapeo de `index.html`). Todas exportadas desde `src/components/ui/index.ts` (barrel con un `index.ts` por carpeta, como el resto del repo). **Todavía no las consume ninguna página**: se adoptan en las Fases 1–9.

- [x] **`PageHeader`** — `.topbar` + `.breadcrumb` (raíz + `/` + actual) + `.topbar-actions`. Props: `crumbs: {label, href?}[]` (sin `href` = actual, se pinta `strong`), `actions`, `subtitle`.
- [x] **`MonthStrip`** — tira `.months`: `items: {key, label, year?, count?, current?}[]`, `activeKey` (string **o array**), `onSelect`, `variant: 'underline'|'multi'` (`.months--multi`), `leading` (botón de año), `nav` (`onPrev/onNext` + disabled + titles) y `end` (slot `.strip-end`). El `.count` sólo se muestra en el activo (como el mockup) y el punto `.is-current` sale de `current`.
- [x] **`StatsCluster`** — creado en `src/components/ui/StatsCluster/`. API: `items: StatItem[]` con `label`, `value`, `tone` (`accent|danger|success|attention`), `delta` (`text`, `tone`, `icon`) y `meter` (`value` 0-100, `tone` `accent|warn|over|far-over`, `legend` `{left, pct}`); `wide` para `.stat--wide`. Portados `.stats/.stat/.stat--wide/.label/.value.tone/.delta/.meter/.meter-legend`.
  - **Pendiente (Fase 3 — Movimientos):** migrar `src/components/Movimientos/StatsCluster/` a este genérico y borrarlo. Quedó un `TODO(rediseño-tema, Fase 3 — Movimientos)` en la importación y en el uso (`src/app/finanzas/movimientosDelMes/page.tsx`) y un `@deprecated` en el componente viejo.
- [x] **`Pill`** — `variant: neutral|success|attention|severe|danger|done|accent` + `outline` (fondo transparente, conserva el tono), `method` (`.method`: mono, min-width 62 para métodos HTTP), `dot` e `icon` opcionales. Variantes verificadas contra el uso real en los mockups (108 `success`, 98 `outline`, 26 neutral, más `outline <tono>` con dot).
- [x] **`EmptyState`** — `.empty` (ícono + h3 + p + acción).
- [x] **`SkeletonRows`** — `rows`/`columns` con el shimmer de `.skeleton`. El `@keyframes shimmer` se agregó a `globals.css`.
- [x] **Helper de tabla MRT** — `src/components/ui/table/mrtTable.ts`: `mrtTableProps({ surface })` (spread + override por página), `MRT_SURFACE_PAGE|PANEL|INSET`, `MRT_NUMERIC_CELL_SX` (mono tabular a la derecha) y `MRT_GROUP_ROW_SX`. **Corrección respecto al borrador:** el header NO va con `--bg-elevated` — el mockup usa el **fondo de la propia tabla** (`.table thead th { background: var(--bg-page) }` / `.panel .table thead th { background: var(--bg-panel) }`), borde inferior `--border-soft`, 11.5px `--text-tertiary`; las celdas llevan borde `--border-muted` y las filas `--row-h` / hover `--bg-row-hover` / selección `--accent-soft` + barra `inset` de 2px.
- [x] **Paleta `--series-*`** — `src/components/ui/charts/series.ts`: `SERIES` (1..8), `SERIES_MUTED`, `seriesColor(i)` y `CHART_TONES` (bandas semánticas).

### 0.4 Shell / Sidebar → `src/components/Layout/Layout.tsx` + `Layout.styles.ts` — ✅ **hecho**

- [x] Fondo del sidebar = **`var(--bg-page)`** con `border-right: 1px solid var(--border-soft)`. *Corrección:* el borrador decía `--bg-inset`; el mockup (`.sidebar`) usa `--bg-page` con borde. Se aplicó el mockup.
- [x] **Anchos**: `DRAWER_WIDTH` 232 / `DRAWER_COLLAPSED_WIDTH` 56 (antes 200/85).
- [x] **Marca**: `.brand-mark` `M` (26×26, radius, `--accent-emphasis`, Space Grotesk 700) + "Mis gestiones" + botón de colapso (panel-left). Al colapsar la marca pasa a columna (mark + toggle) y se oculta el nombre.
- [x] **Activo por pathname** (`usePathname()`): el hijo activo lleva `is-active` (fondo `--accent-soft` + barra de 3px a la izquierda, `--accent`); el padre con hijo activo lleva sólo `is-parent-active` (texto en `--text-primary`) — igual que `shell.js`, donde un padre nunca es `is-active`.
- [x] **Desempate del hijo activo**: se elige el hijo con el `href` más largo que matchee, así `Resumen` (`/finanzas`) no queda activo en `/finanzas/movimientosDelMes`.
- [x] **Submenú en línea** (no riel): arranca abierto si hay un hijo activo; el caret (chevron) lo togglea con `preventDefault` para no navegar. `.nav-sub` con riel vertical de 1px (`--border-muted`).
- [x] **Menú final** (`LINKS`), en orden de mockup y **sin Importar**:
  - Tomi → `/tomi`
  - Finanzas → `/finanzas` con hijos: **Resumen** `/finanzas`, Movimientos, Presupuesto, Vencimientos, **Buscar** (label acortado, antes "Buscar Movimientos")
  - Inversiones → `/inversiones`
  - ~~Importar~~ **eliminado del menú** (item + `FileUploadIcon`). La ruta `/importar` sigue existiendo; se limpia en Fase 10.
  - Footer: **Configuración** → **Categorías** `/settings/admin`, **API** `/settings/api` (labels renombrados desde "Admin"/"API Access").
- [x] Íconos MUI equivalentes a `ICONS` de `shell.js`: `smile`→`FaceOutlined`, `wallet`→`AccountBalanceWalletOutlined`, `layout`→`DashboardOutlined`, `receipt`→`ReceiptLongOutlined`, `chart-bar`→`BarChart`, `clock`→`Schedule`, `search`→`ManageSearchOutlined`, `chart-line`→`ShowChart`, `settings`→`Settings`, `folder-tree`→`AccountTreeOutlined`, `plug`→`ApiOutlined`.
- [x] `Divider` sobrantes eliminados; separadores con borde `--border-muted` (`.nav-footer` con `margin-top:auto` + borde superior).
- [x] **Colapsado**: items centrados sin padding ni etiqueta. **Desvío deliberado del mockup:** en colapsado se **mantiene el caret** en los items con submenú y los hijos se pintan como íconos centrados (`navItemSubCollapsed` / `navSubCollapsed`), así el submenú queda accesible sin expandir la barra. El único indicador de sección activa pasa a ser el **hijo activo** (fondo `--accent-soft` + ícono acento): como el submenú se auto-abre, no se duplica el resaltado en el padre. Los items colapsados llevan `title` + `aria-label` porque no se ve la etiqueta. (El mock, en cambio, hace `display:none` del `.nav-sub` al colapsar.)
- [ ] **Pendiente:** el bloque de usuario del mockup (`.sidebar-user`, avatar "A" / "Andrés") **no se implementó** — es chrome de mockup, no datos reales de la app. Definir si se agrega (Fase 10).
- [ ] **Pendiente:** `styles.main` conserva `p: 3` (padding 24px) a propósito para no dejar sin aire las páginas todavía no migradas; **quitarlo cuando cada página aporte su propio `--gutter`** (`.topbar` / `.section` del mockup). Quedó un `TODO(rediseño-tema)` en `Layout.styles.ts`.

### 0.2b Correcciones detectadas durante 0.3/0.4 (no estaban en el plan)

- [x] **`palette.divider` no acepta `var()`**: MUI pasa los valores de paleta por `alpha()`/`decomposeColor()` (`Divider` rompía en runtime: *"MUI: Unsupported `var(--border-muted)` color"*). Se cambió a `#262C36` (literal, = `--border-muted`) con un comentario. Los `var()` sí son válidos dentro de `styleOverrides` (CSS crudo).
- [x] **`--font-display/body/mono` no deben redefinirse en `:root`**: las define **next/font** en `<html>` (`src/app/layout.tsx`). Mi 0.1 las había agregado a `theme-tokens.css` con la misma especificidad → riesgo de pisarlas y perder el self-hosting. Se quitaron y se dejó un comentario.
- [x] **Tipografía MUI**: `typography.fontFamily` y las variantes usaban el **nombre literal** (`'IBM Plex Sans'`, `'Space Grotesk'`), que no coincide con la familia generada por next/font → el texto MUI caía al fallback del sistema. Ahora usan `var(--font-body)` / `var(--font-display)` (también en `MuiButton` y `MuiDialogTitle`).
  - **Queda pendiente** (se arregla en la fase de cada página): `sx` con nombre literal en `Layout` (ya corregido), `components/Movimientos/StatsCluster/StatsCluster.styles.ts`, `comun/SeleccionadorPeriodo/SeleccionadorPeriodo.styles.ts`, `MovimientosDelMesGrillaMRT.tsx` y `app/finanzas/movimientosDelMes/page.tsx`.


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

**Decisiones del 2.º repaso del mockup (aplicadas en `docs/mockups/tomi.html`):**
- [x] **Topbar sin Exportar ni Agregar nota**: quedó solo **Gráficos**. (En código nunca se agregaron: no hay export de Tomi y "Agregar nota" no tiene flujo global.) *El "Agregar nota" del **modal** de día se mantiene: agrega una nota al día, no es el del topbar.*
- [x] **Sin botón "Registrar"** en los días sin registro (se quitó de las 8 filas `is-empty` + el CSS muerto `.register`). Queda solo la etiqueta `Sin registro`.
- [x] **Lápiz de edición a la izquierda**: la columna `actions` pasó de ser la última a estar **entre `Día` y el timeline** (`Día · actions · tl-col`), coincidiendo con la app (que ya lo tiene ahí). *Mockup only por ahora.*
- [x] **Columna de contenido a 1000px**: `.page` (contenedor que tiene la tira de meses y la grilla de días) ahora es `max-width: 1000px` en vez de 100% del ancho. Verificado por medición headless: a 1280/1920/2560 la `.page`, `.months`, `.table`, `.stats`, `.charts` y `.topbar` miden **1000px** (antes 1020/1660/2300 y crecían con la ventana), alineadas a la izquierda (x=232, junto al sidebar). Es una **prueba**.
  - **Pendiente de confirmar:** si el tope debe incluir el topbar/stats/charts (hoy sí, están en el mismo contenedor) o solo meses+tabla; y si va alineado a la izquierda (hoy) o centrado.
  - **A llevar a la app** en Fase 1 (junto con el reemplazo de la tabla) o antes si se pide.

**Cambios a código:**
- [x] Aplicar `PageHeader` (breadcrumb Tomi) y el frame general.
  - Breadcrumb `Tomi / Agenda de sueño`; se eliminó el título "Dashboard de Agenda de Tomi" y el `<Container>`.
  - **Frame:** `Box` flex-column con `m: -3` para cancelar el `p: 3` de `styles.main` (ver Fase 0) y que la página use `--gutter` con bordes a todo el ancho. `TODO(rediseño-tema, Fase 10)` en `src/app/tomi/page.tsx`: borrar el `m: -3` cuando se quite el padding de `main`.
  - **Acción "Gráficos"** (`.btn.ghost.is-on` del mockup) movida al `PageHeader`, reemplaza el `Divider`+`IconButton` que toggleaba los gráficos (`onDividerClicked` → `onToggleGraficos`). Se mantuvo el comportamiento actual (grilla visible por defecto → el botón no arranca "encendido", a diferencia del mockup).
  - El `SeleccionadorPeriodo` (modo exclusivo) ya es la tira de meses del mockup (`px: 28px` + borde inferior), así que se renderiza directo bajo el header. Su reemplazo por `MonthStrip` queda para una fase posterior.
  - **Exportar / Agregar nota del topbar: descartados.** Se quitaron del mockup (2.º repaso) y no se agregaron a la app: no existe export de Tomi y "Agregar nota" no tiene flujo global (el modal se abre por día). El "Agregar nota" del **modal** de día se mantiene.
- [x] **Grilla de días: `<Table>` nativa con las clases del mockup** (no MRT) → nuevo componente `src/components/tomi/TablaDiasSuenio.tsx`; `src/app/tomi/page.tsx` sólo lo usa. Columnas `Día` · `actions` · timeline, **sin columna `Total`**.
  - Número de día en `--font-display` (Space Grotesk) + día de semana en `--text-tertiary`; bordes de fila tokenizados (`--border-muted`, antes `rgba(81,81,81,1)`), alto `--row-h`, hover `--bg-row-hover`, filas de fin de semana con `rgba(255,255,255,.015)`.
  - **Lápiz a la izquierda, sólo al hover**: columna `actions` entre `Día` y el timeline, `opacity: 0` y se revela con `tr:hover` o `:focus-visible` (teclado). *Corrección:* con `tr:focus-within` (como el mockup) el lápiz quedaba pegado tras el click hasta clickear otra fila (el botón conserva el foco); se pasó a `:focus-visible` + `blur()` al clickear, en la app **y en el mockup**. *Nota:* en táctil (sin hover) el lápiz no aparece — si molesta, agregar fallback `@media (hover: none)`.
  - Días sin registro: timeline punteado con `Sin registro` (sin botón Registrar). Se quitó el `<TableContainer component={Paper}>` (el mockup no usa tarjeta).
  - **Timeline reescrito** (`BarraSuenio.tsx`): fondo `--bg-elevated` = despierto, tramos `--series-1` = dormido, ticks al 25/50/75 %, marcas horarias (`HH:MM`) arriba, duración centrada (mono) sólo si el tramo ≥ 2 h (los tramos cortos, como la siesta de 80 min, no la llevan — igual que el mockup); `title` "Dormido HH:MM → HH:MM". Antes eran `LinearProgress`.
  - **Badges de notas** (`NotasTooltip.tsx`): pastilla neutra (`--neutral-soft` + `--neutral-border`) con punto de color de la serie por tipo (General `--series-1`, Orina `--series-4`, Cambio de medicación `--series-8`, Crisis `--series-7`, Malhumor `--series-2`, = leyenda del mockup); antes rectángulos de color con hex hardcodeado.
  - **Tope de 1000px llevado a la app**: `CONTENT_MAX_WIDTH = 1000` (const local) como `maxWidth` del frame `Box` en `page.tsx`. Sigue la "prueba" del mockup y **sigue pendiente de confirmar** (¿incluye topbar/stats/charts? ¿centrado?).
  - Verificado: `npx tsc --noEmit` exit 0 y `npx eslint` exit 0 sobre los 4 archivos.
- [ ] Modal `EditarDiaModal` → estilo `MuiDialog` global (header + subtítulo + footer).
- [ ] Gráficos: `SuenioTomi` → 4 bandas de color (`--danger` / `--attention` / `--accent` / `--success` en `colorMap.thresholds` de `SuenioTomi.tsx`, hoy `#df5e5e`/`orange`/`#199db3`/`#58ff58bf`) + leyenda de 4 bandas; `SuenioAnualTomi` con `--series-*`; un solo eje.
- [ ] Stats: 4 stats, sin meter de progreso ni delta vs. mes anterior. Usar el `StatsCluster` de `@/components/ui` (ya creado en 0.3).
- [ ] Verificar tabs/sección de días y estados (pill) según mockup.

---

## Fase 2 — Finanzas · Resumen → `/finanzas` *(página nueva)*

Mockup: `docs/mockups/finanzas-dashboard.html`. **Hoy no existe** (`src/app/finanzas/` no tiene `page.tsx`; el enlace `/finanzas` del sidebar no resuelve).

- [ ] Crear `src/app/finanzas/page.tsx` (dashboard Resumen).
- [ ] `PageHeader` "Finanzas / Resumen" + acción principal.
- [ ] `MonthStrip` de meses.
- [ ] `StatsCluster` con N stats + meter (estados ámbar/rojo/violeta) — **usar el de `@/components/ui`** (ya creado en 0.3).
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
- [ ] **Migrar el `StatsCluster` viejo** (`src/components/Movimientos/StatsCluster/`) al genérico de `@/components/ui` y borrar el viejo (quitando los `TODO(rediseño-tema, Fase 3 — Movimientos)` de `src/app/finanzas/movimientosDelMes/page.tsx` en la importación y en el uso). Stats del mockup: Presupuesto / Ingresos / Egresos (`danger`) / Balance (`accent`) / Presupuesto usado / Vencimientos pendientes (`attention`).
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
