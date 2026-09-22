# Mockups · rediseño con tema GitHub dark

Mockups HTML estáticos para llevar el estilo de `finanzas/movimientosDelMes` al resto de la app. Abrí `index.html` en el navegador: lista las páginas, las reglas del sistema visual, los tokens y una tabla de correspondencia con el código actual.

## Archivos

| Archivo | Página que reemplaza |
|---|---|
| `index.html` | Guía del sistema visual y mapa hacia el código |
| `finanzas-movimientos.html` | `/finanzas/movimientosDelMes` (referencia, con mejoras) |
| `finanzas-presupuesto.html` | `/finanzas/presupuestoDelMes` |
| `finanzas-vencimientos.html` | `/finanzas/vencimientos` |
| `finanzas-buscar.html` | `/finanzas/buscarMovimientos` |
| `finanzas-dashboard.html` | `/finanzas` |
| `inversiones.html` | `/inversiones` |
| `tomi.html` | `/tomi` |
| `importar.html` | `/importar` y `/finanzas/importar` (unificadas) |
| `settings.html` | `/settings/admin` y `/settings/api` |
| `assets/app.css` | Tokens y componentes compartidos |
| `assets/shell.js` | Barra lateral, íconos SVG y comportamientos de demo |

## Cómo se usan

- Todo el estilo compartido está en `assets/app.css`. Cada página agrega un `<style>` corto solo para su contenido.
- La barra lateral y los íconos los inyecta `assets/shell.js` a partir de `<body data-page="…">`. Los íconos se declaran como `<i data-icon="nombre">`; la lista de nombres está en el objeto `ICONS`.
- Los mockups son interactivos donde ayuda a revisar: tabs de mes, grupos plegables, selección con suma parcial, modales (`data-modal-open`), secciones plegables (`data-toggle`).
- Los gráficos son SVG generados por un script al pie de cada página a partir de arrays de datos, para poder ajustar valores sin dibujar a mano.

## Decisiones

- Paleta GitHub Primer dark, con el acento azul que la app ya tenía. Los semánticos (verde, ámbar, rojo, violeta) se usan solo para estado y siempre junto a texto o ícono.
- Space Grotesk para títulos y números de día, IBM Plex Sans para el cuerpo, IBM Plex Mono para todo número.
- Profundidad por bordes y dos tonos de fondo; sombra solo en modales.
- Las filas nunca se pintan enteras: el estado va en una etiqueta (`.pill`).
- La paleta de series para gráficos (`--series-1` … `--series-8`) está validada para daltonismo y contraste sobre `#0d1117`.
