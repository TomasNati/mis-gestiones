# APIs de Cotizaciones - Comandos cURL

## 🎯 EJEMPLOS PRÁCTICOS CON INSTRUMENTOS REALES

### 1. CEDEAR: SPY (S&P 500 ETF)
```bash
# Cotización del ETF SPY en mercado USA (base para CEDEAR argentino)
curl "https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0"

# Respuesta incluye:
# - regularMarketPrice: 714.02 USD
# - currency: USD
# - previousClose: Cierre anterior
# Nota: En Argentina el CEDEAR cotiza como SPY o SPY.BA en IOL
```

### 2. FCI LOCAL: AL.LATAM.A DIV (Allaria Latam A Dividendos)
```bash
# Los FCIs argentinos requieren IOL API (con autenticación)
curl "https://api.invertironline.com/api/v2/Cotizaciones/fondos" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filtrar por nombre o buscar en la respuesta:
# {
#   "simbolo": "AL.LATAM.A",
#   "descripcion": "Allaria Latam Acc Clase A",
#   "cuotaParte": 1234.56,
#   "variacion": 0.25
# }

# Alternativa: CAFCI (requiere web scraping)
# https://www.cafci.org.ar/estadisticas.html
```

### 3. ON (Obligación Negociable): TLCPD (Telecom)
```bash
# Búsqueda en BymaData
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/search?query=TLCPD" \
  -H "accept: application/json"

# O consultar panel completo y filtrar
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/latest" \
  -H "accept: application/json" | jq '.[] | select(.symbol | contains("TLCP"))'

# Con IOL (más confiable):
curl "https://api.invertironline.com/api/v2/Cotizaciones/bonos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. FCI (US): P.IF.E o ETF similar
```bash
# Buscar fondos/ETFs internacionales en Yahoo Finance
# Nota: P.IF.E puede no existir, alternativas comunes: VWO, EEM, INDA
curl "https://query1.finance.yahoo.com/v8/finance/chart/VWO?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0"

# Para fondos mutuales específicos, usar ticker del fondo
curl "https://query1.finance.yahoo.com/v8/finance/chart/VWIGX?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0"
```

### 5. CRIPTO: Bitcoin
```bash
# A) CoinGecko (Recomendado - múltiples monedas)
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ars&include_24hr_change=true&include_market_cap=true"

# Respuesta:
# {
#   "bitcoin": {
#     "usd": 77776,
#     "ars": 109261697,
#     "usd_24h_change": -0.2,
#     "usd_market_cap": 1556718107669
#   }
# }

# B) Binance (más actualizado)
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
# Respuesta: {"symbol":"BTCUSDT","price":"77752.99"}

# C) Estadísticas 24h completas
curl "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
```

### 6. ACCIÓN (US): MSFT (Microsoft)
```bash
# Método 1: Yahoo Finance - Datos completos
curl "https://query1.finance.yahoo.com/v8/finance/chart/MSFT?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0"

# Respuesta incluye:
# - regularMarketPrice: 420.50 USD
# - currency: USD
# - marketCap: Capitalización
# - volume: Volumen

# Método 2: Múltiples acciones en una llamada
curl "https://query1.finance.yahoo.com/v7/finance/quote?symbols=MSFT,AAPL,GOOGL" \
  -H "User-Agent: Mozilla/5.0"
```

---

## 1. COTIZACIÓN DEL DÓLAR EN ARGENTINA 🇦🇷

### A) DolarAPI - Todas las cotizaciones
```bash
# Obtener todas las cotizaciones del dólar
curl "https://dolarapi.com/v1/dolares"

# Respuesta incluye: Oficial, Blue, MEP (Bolsa), CCL, Mayorista, Cripto, Tarjeta
```

### B) Dólar MEP (Mercado Electrónico de Pagos)
```bash
# Específicamente el dólar bolsa/MEP
curl "https://dolarapi.com/v1/dolares/bolsa"

# Respuesta ejemplo:
# {
#   "moneda": "USD",
#   "casa": "bolsa",
#   "nombre": "Bolsa",
#   "compra": 1437,
#   "venta": 1441.4,
#   "fechaActualizacion": "2026-04-27T12:56:00"
# }
```

### C) Dólar Oficial
```bash
curl "https://dolarapi.com/v1/dolares/oficial"
```

### D) Dólar Blue
```bash
curl "https://dolarapi.com/v1/dolares/blue"
```

### E) Contado con Liquidación (CCL)
```bash
curl "https://dolarapi.com/v1/dolares/contadoconliqui"
```

---

## 2. INSTRUMENTOS FINANCIEROS LOCALES (Argentina) 📊

### A) InvertirOnline (IOL) API
**Nota:** Requiere autenticación con API Key (registro gratuito en https://www.invertironline.com/)

```bash
# 1. Obtener token de autenticación
curl -X POST "https://api.invertironline.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=TU_USUARIO&password=TU_PASSWORD&grant_type=password"

# 2. CEDEARs
curl "https://api.invertironline.com/api/v2/Cotizaciones/CEDEARs" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Acciones Argentina
curl "https://api.invertironline.com/api/v2/Cotizaciones/acciones" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Bonos (Obligaciones Negociables)
curl "https://api.invertironline.com/api/v2/Cotizaciones/bonos" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Fondos Comunes de Inversión (FCI)
curl "https://api.invertironline.com/api/v2/Cotizaciones/fondos" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Obtener cotización específica por ticker
curl "https://api.invertironline.com/api/v2/Cotizaciones/AAPL/argentina" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### B) BymaData - Mercado de Valores Argentino
**Nota:** API pública sin necesidad de autenticación

```bash
# Panel completo con últimas cotizaciones
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/latest" \
  -H "accept: application/json"

# Tabla de negociación (snapshot actual)
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/table" \
  -H "accept: application/json"

# Buscar instrumento específico
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/search?query=AAPL" \
  -H "accept: application/json"
```

### C) Ámbito Financiero
```bash
# Dólar informal con variación
curl "https://mercados.ambito.com/dolar/informal/variacion"

# Respuesta: {"compra":"1400,00","venta":"1420,00","fecha":"24/04/2026 - 10:35","variacion":"0,35%"}
```

---

## 3. BOLSAS DE ESTADOS UNIDOS 🇺🇸

### A) Yahoo Finance API (Sin API Key requerida)
```bash
# Múltiples acciones en una sola llamada
curl "https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,GOOGL,TSLA,MSFT,AMZN" \
  -H "User-Agent: Mozilla/5.0"

# Cotización individual con más detalle
curl "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0"

# Datos históricos
curl "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1mo" \
  -H "User-Agent: Mozilla/5.0"

# Respuesta incluye:
# - regularMarketPrice: Precio actual
# - regularMarketChange: Cambio absoluto
# - regularMarketChangePercent: Cambio porcentual
# - regularMarketVolume: Volumen
# - marketCap: Capitalización de mercado
```

### B) Alpha Vantage (Requiere API Key gratuita)
**Registro:** https://www.alphavantage.co/support/#api-key

```bash
# Cotización en tiempo real
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY"

# Serie temporal diaria
curl "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_API_KEY"

# Serie temporal intradiaria (5min)
curl "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=YOUR_API_KEY"

# API Key demo (limitada):
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo"
```

### C) Finnhub (Requiere API Key gratuita)
**Registro:** https://finnhub.io/register

```bash
# Cotización en tiempo real
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY"

# Perfil de compañía
curl "https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=YOUR_API_KEY"

# Noticias de mercado
curl "https://finnhub.io/api/v1/news?category=general&token=YOUR_API_KEY"

# Candlestick data
curl "https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=1672531200&to=1704067200&token=YOUR_API_KEY"
```

### D) Polygon.io (Requiere API Key gratuita)
**Registro:** https://polygon.io/

```bash
# Cotización agregada
curl "https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=YOUR_API_KEY"

# Último precio
curl "https://api.polygon.io/v2/last/trade/AAPL?apiKey=YOUR_API_KEY"

# Snapshot de todos los tickers
curl "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=YOUR_API_KEY"
```

---

## 4. CRIPTOMONEDAS 🪙

### A) CoinGecko (Sin API Key para uso básico)
```bash
# Precio simple de múltiples criptos
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true"

# Top criptos por capitalización de mercado
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"

# Información detallada de una cripto
curl "https://api.coingecko.com/api/v3/coins/bitcoin"

# Datos históricos
curl "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"

# Respuesta incluye:
# - current_price: Precio actual
# - market_cap: Capitalización
# - total_volume: Volumen 24h
# - price_change_percentage_24h: Cambio 24h
```

### B) Binance (Sin API Key para precios públicos)
```bash
# Precio de un par específico
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

# Múltiples pares
curl "https://api.binance.com/api/v3/ticker/price?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22BNBUSDT%22]"

# Estadísticas 24h
curl "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"

# Libro de órdenes
curl "https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=5"

# Todos los precios
curl "https://api.binance.com/api/v3/ticker/price"
```

### C) CoinCap (Sin API Key)
```bash
# Top 100 assets
curl "https://api.coincap.io/v2/assets?limit=100"

# Asset específico
curl "https://api.coincap.io/v2/assets/bitcoin"

# Histórico
curl "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1"

# Markets
curl "https://api.coincap.io/v2/assets/bitcoin/markets"
```

### D) Coinbase (API Pública)
```bash
# Precio spot
curl "https://api.coinbase.com/v2/prices/BTC-USD/spot"

# Precio de compra
curl "https://api.coinbase.com/v2/prices/BTC-USD/buy"

# Precio de venta
curl "https://api.coinbase.com/v2/prices/BTC-USD/sell"

# Múltiples monedas
curl "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
```

### E) CryptoCompare (Requiere API Key gratuita)
**Registro:** https://min-api.cryptocompare.com/

```bash
# Precio múltiples criptos vs múltiples fiat
curl "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,ARS"

# Precio completo con datos de mercado
curl "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD"

# Histórico por día
curl "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30"
```

---

## 5. FONDOS COMUNES DE INVERSIÓN (FCI) - Argentina

### A) Cafci (Cámara Argentina de Fondos Comunes de Inversión)
```bash
# Endpoint público (puede requerir navegación web)
# https://www.cafci.org.ar/estadisticas.html
```

### B) IOL - Fondos (Requiere autenticación)
```bash
curl "https://api.invertironline.com/api/v2/Cotizaciones/fondos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. OBLIGACIONES NEGOCIABLES (ON) - Argentina

### A) BymaData - Bonos Corporativos
```bash
# Buscar ONs específicas
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/search?query=YPF" \
  -H "accept: application/json"
```

### B) IOL - Bonos (Requiere autenticación)
```bash
curl "https://api.invertironline.com/api/v2/Cotizaciones/bonos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 7. EJEMPLOS DE INTEGRACIÓN EN TYPESCRIPT

### Ejemplo 1: Obtener dólar MEP
```typescript
async function obtenerDolarMEP() {
  const response = await fetch('https://dolarapi.com/v1/dolares/bolsa');
  const data = await response.json();
  return {
    compra: data.compra,
    venta: data.venta,
    fecha: new Date(data.fechaActualizacion)
  };
}
```

### Ejemplo 2: Obtener precio de CEDEAR desde Yahoo
```typescript
async function obtenerPrecioCedear(ticker: string) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await response.json();
  return data.quoteResponse.result[0].regularMarketPrice;
}
```

### Ejemplo 3: Obtener precio de criptomoneda
```typescript
async function obtenerPrecioCripto(id: string) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    precio: data[id].usd,
    cambio24h: data[id].usd_24h_change
  };
}
```

---

## 8. CONSIDERACIONES IMPORTANTES ⚠️

### Rate Limits
- **DolarAPI:** Sin límites para uso razonable
- **CoinGecko:** 10-50 llamadas/minuto (sin key)
- **Yahoo Finance:** No documentado oficialmente, usar con moderación
- **Binance:** 1200 requests/minuto (sin key)
- **Alpha Vantage:** 5 llamadas/minuto, 500/día (free tier)
- **Finnhub:** 60 llamadas/minuto (free tier)

### Caché Recomendado
- Dólar: 15 minutos
- Acciones (horario de mercado): 1-5 minutos
- Acciones (fuera de horario): 1 hora
- Criptomonedas: 1-2 minutos
- FCIs: 1 día (cierran una vez al día)

### Headers Recomendados
```bash
-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
-H "Accept: application/json"
-H "Accept-Language: es-AR,es;q=0.9"
```

### Horarios de Mercado
- **Merval (Argentina):** 11:00 - 17:00 ART
- **NYSE/NASDAQ:** 9:30 - 16:00 EST (14:30 - 21:00 ART)
- **Criptomonedas:** 24/7
- **Dólar MEP:** Sigue horario Merval

---

## 9. RECOMENDACIONES PARA TU PROYECTO

### APIs Gratuitas Recomendadas (sin registro):
1. **Dólar:** DolarAPI ✅
2. **Criptomonedas:** CoinGecko ✅
3. **Acciones USA:** Yahoo Finance ✅
4. **Mercado Local:** BymaData ✅

### APIs con Registro Gratuito (mejor calidad):
1. **Mercado Local Completo:** InvertirOnline (IOL) 🔑
2. **Acciones USA Detalladas:** Alpha Vantage o Finnhub 🔑
3. **Criptos Avanzadas:** CryptoCompare 🔑

### Estrategia de Implementación:
1. Comenzar con APIs sin autenticación para MVP
2. Implementar caché agresivo (15 min)
3. Agregar APIs con autenticación para features avanzadas
4. Implementar fallback entre múltiples proveedores
5. Monitorear rate limits y errores

---

## 10. GUÍA RÁPIDA - RESUMEN DE COMANDOS POR INSTRUMENTO

### Tabla de Referencia Rápida

| Instrumento | Tipo | API Recomendada | Comando |
|-------------|------|----------------|---------|
| **SPY** | CEDEAR | Yahoo Finance | `curl "https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1d"` |
| **AL.LATAM.A DIV** | FCI Local | IOL (requiere auth) | `curl "https://api.invertironline.com/api/v2/Cotizaciones/fondos" -H "Authorization: Bearer TOKEN"` |
| **TLCPD** | ON Local | BymaData / IOL | `curl "https://open.bymadata.com.ar/.../search?query=TLCPD"` |
| **Bitcoin** | Cripto | CoinGecko | `curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ars"` |
| **MSFT** | Acción USA | Yahoo Finance | `curl "https://query1.finance.yahoo.com/v8/finance/chart/MSFT?interval=1d&range=1d"` |
| **Dólar MEP** | Tipo Cambio | DolarAPI | `curl "https://dolarapi.com/v1/dolares/bolsa"` |

### Comandos Completos Copy-Paste

```bash
# 1. CEDEAR SPY
curl "https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0" | jq '.chart.result[0].meta | {symbol, price: .regularMarketPrice, currency}'

# 2. FCI Local (requiere IOL token)
curl "https://api.invertironline.com/api/v2/Cotizaciones/fondos" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.[] | select(.simbolo | contains("AL.LATAM"))'

# 3. ON TLCPD
curl "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/senebi/latest" \
  -H "accept: application/json" | jq '.[] | select(.symbol | contains("TLCP"))'

# 4. Bitcoin (USD y ARS)
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ars&include_24hr_change=true" \
  | jq '.bitcoin'

# 5. MSFT (Microsoft)
curl "https://query1.finance.yahoo.com/v8/finance/chart/MSFT?interval=1d&range=1d" \
  -H "User-Agent: Mozilla/5.0" | jq '.chart.result[0].meta | {symbol, price: .regularMarketPrice}'

# 6. Dólar MEP
curl "https://dolarapi.com/v1/dolares/bolsa" | jq '{compra, venta, fecha: .fechaActualizacion}'

# 7. Múltiples acciones USA en una llamada
curl "https://query1.finance.yahoo.com/v7/finance/quote?symbols=MSFT,AAPL,GOOGL,TSLA,AMZN" \
  -H "User-Agent: Mozilla/5.0" | jq '.quoteResponse.result[] | {symbol, price: .regularMarketPrice, change: .regularMarketChangePercent}'

# 8. Top 5 Criptomonedas
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5" \
  | jq '.[] | {symbol, name, price: .current_price, change_24h: .price_change_percentage_24h}'
```

### Scripts PowerShell Útiles

```powershell
# Obtener todas las cotizaciones y guardar en variables
$dolarMEP = (curl -s "https://dolarapi.com/v1/dolares/bolsa" | ConvertFrom-Json).venta
$btcUSD = (curl -s "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT" | ConvertFrom-Json).price
$msftPrice = (curl -s "https://query1.finance.yahoo.com/v8/finance/chart/MSFT?interval=1d&range=1d" -H "User-Agent: Mozilla/5.0" | ConvertFrom-Json).chart.result[0].meta.regularMarketPrice

Write-Host "Dólar MEP: ARS $dolarMEP"
Write-Host "Bitcoin: USD $btcUSD"
Write-Host "Microsoft: USD $msftPrice"
Write-Host "Microsoft en ARS: ARS $($msftPrice * $dolarMEP)"
```

### Ejemplo de Script para Actualizar Todo el Portafolio

```bash
#!/bin/bash
# Script para obtener todas las cotizaciones de una vez

echo "=== ACTUALIZANDO COTIZACIONES ==="

# Dólar MEP
DOLAR_MEP=$(curl -s "https://dolarapi.com/v1/dolares/bolsa" | jq -r '.venta')
echo "Dólar MEP: $DOLAR_MEP"

# CEDEARs (SPY, AAPL, etc)
CEDEARS=$(curl -s "https://query1.finance.yahoo.com/v7/finance/quote?symbols=SPY,AAPL,GOOGL" -H "User-Agent: Mozilla/5.0")
echo "$CEDEARS" | jq '.quoteResponse.result[] | "\(.symbol): USD \(.regularMarketPrice)"'

# Criptos
CRIPTOS=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd")
echo "Bitcoin: $(echo $CRIPTOS | jq -r '.bitcoin.usd') USD"
echo "Ethereum: $(echo $CRIPTOS | jq -r '.ethereum.usd') USD"

# Calcular valores en ARS
SPY_USD=$(echo "$CEDEARS" | jq -r '.quoteResponse.result[0].regularMarketPrice')
SPY_ARS=$(echo "$SPY_USD * $DOLAR_MEP" | bc)
echo "SPY en ARS: $SPY_ARS"
```

---

## 11. TROUBLESHOOTING

### Problema: Yahoo Finance devuelve error 401/403
**Solución:** Asegurarse de incluir el header User-Agent
```bash
curl "URL" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

### Problema: BymaData devuelve array vacío
**Solución:** La API puede estar temporalmente no disponible, usar IOL como fallback

### Problema: CoinGecko rate limit
**Solución:** Implementar cache de 1-2 minutos entre llamadas
```typescript
const CACHE_TTL = 60 * 1000; // 1 minuto
let cache = { data: null, timestamp: 0 };

if (Date.now() - cache.timestamp > CACHE_TTL) {
  cache.data = await fetchFromAPI();
  cache.timestamp = Date.now();
}
```

### Problema: IOL API requiere token refresh
**Solución:** Los tokens de IOL expiran, implementar renovación automática
```typescript
async function refreshToken() {
  const response = await fetch('https://api.invertironline.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      username: process.env.IOL_USER,
      password: process.env.IOL_PASS,
      grant_type: 'password'
    })
  });
  return (await response.json()).access_token;
}
```

---

**Última actualización:** 2026-04-27  
**Versión:** 2.0 - Con ejemplos prácticos
