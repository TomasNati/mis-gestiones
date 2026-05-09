# Documentación de APIs de Cotizaciones

### FCI locales (usando código CAFCI)

**Endpoint:** [https://mis-gestiones-backend.vercel.app/api/cotizaciones/fondos?codigo_cafci=2096](https://mis-gestiones-backend.vercel.app/api/cotizaciones/fondos?codigo_cafci=2096)

```json
[
  {
    "nombre": "Balanz Ahorro en Dólares - Clase A",
    "moneda": "USD",
    "precio_actual": 1.411096,
    "codigo_cnv": 876,
    "codigo_cafci": 2096
  }
]
```

---

### Acciones / ETF / FCI del exterior

**Endpoint:** [https://mis-gestiones-backend.vercel.app/api/cotizaciones/cotizaciones/us/KO](https://mis-gestiones-backend.vercel.app/api/cotizaciones/cotizaciones/us/KO)

```json
{
  "symbol": "KO",
  "price": 78.41999816894531
}
```

Referencia: [Yahoo Finance](https://finance.yahoo.com/quote/0P0000XAMN/)

**Endpoint:** [https://mis-gestiones-backend.vercel.app/api/cotizaciones/cotizaciones/us/0P0000XAMN](https://mis-gestiones-backend.vercel.app/api/cotizaciones/cotizaciones/us/0P0000XAMN)

```json
{
  "symbol": "0P0000XAMN",
  "price": 17.86
}
```

| Element                               | Symbol     |
| ------------------------------------- | ---------- |
| Coca Cola                             | KO         |
| Google                                | GOOG       |
| Microsoft                             | MSFT       |
| Ethereum                              | ETH-USD    |
| Bitcoin                               | BTC-USD    |
| iShares LifePath Target Date 2045 ETF | ITDE       |
| PIMCO GIS Income E USD Acc            | 0P0000XAMN |

### Ordenes negociables / CEDEARS

**Endpoint:** [https://mis-gestiones-backend.vercel.app/api/cotizaciones/instrumento/tlcpd](https://mis-gestiones-backend.vercel.app/api/cotizaciones/instrumento/tlcpd)

```json
{
  "ticker": "ACWI",
  "precio": 8880,
  "precio_raw": "8.880,00",
  "simbolo_moneda": "$",
  "moneda": "ARS",
  "fuente": "iol.invertironline.com",
  "url": "https://iol.invertironline.com/titulo/cotizacion/BCBA/ACWI",
  "fecha_consulta": "2026-05-09T22:37:04"
}
```

---

### Dólar (todos los tipos)

**Endpoint:** [https://mis-gestiones-backend.vercel.app/api/cotizaciones/dolar](https://mis-gestiones-backend.vercel.app/api/cotizaciones/dolar)

```json
[
  {
    "tipo": "oficial",
    "moneda": "USD",
    "casa": "oficial",
    "nombre": "Oficial",
    "compra": 1370,
    "venta": 1420,
    "fecha_actualizacion": "2026-05-08T15:03:00.000Z"
  },
  {
    "tipo": "blue",
    "moneda": "USD",
    "casa": "blue",
    "nombre": "Blue",
    "compra": 1380,
    "venta": 1400,
    "fecha_actualizacion": "2026-05-09T20:58:00.000Z"
  },
  {
    "tipo": "bolsa",
    "moneda": "USD",
    "casa": "bolsa",
    "nombre": "Bolsa",
    "compra": 1427,
    "venta": 1434.3,
    "fecha_actualizacion": "2026-05-09T20:58:00.000Z"
  },
  {
    "tipo": "contadoconliqui",
    "moneda": "USD",
    "casa": "contadoconliqui",
    "nombre": "Contado con liquidación",
    "compra": 1482,
    "venta": 1483.1,
    "fecha_actualizacion": "2026-05-09T20:58:00.000Z"
  },
  {
    "tipo": "mayorista",
    "moneda": "USD",
    "casa": "mayorista",
    "nombre": "Mayorista",
    "compra": 1389,
    "venta": 1398,
    "fecha_actualizacion": "2026-05-08T16:05:00.000Z"
  },
  {
    "tipo": "cripto",
    "moneda": "USD",
    "casa": "cripto",
    "nombre": "Cripto",
    "compra": 1475.9,
    "venta": 1476,
    "fecha_actualizacion": "2026-05-09T20:58:00.000Z"
  },
  {
    "tipo": "tarjeta",
    "moneda": "USD",
    "casa": "tarjeta",
    "nombre": "Tarjeta",
    "compra": 1781,
    "venta": 1846,
    "fecha_actualizacion": "2026-05-08T15:03:00.000Z"
  }
]
```
