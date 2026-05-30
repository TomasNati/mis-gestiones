I want a page to admin entities Inversion.
Location of page: src/app/inversiones
Backend: accessed through src\lib\api.ts
Locally, you can find the backend's repository in ../mis-gestiones-backend/
Definition of Inversion in the backend: structure.py
Endpoints to use:
/api/inversiones/inversiones (GET for search, POST to create). For now do not allow edition

- Actions:
  . on nthe main page, implement a grid gettign all inversiones .
  The payload for get is
  [
  {
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "active": true,
  "cantidad": 0,
  "instrumento": {
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nombre": "string",
  "codigo": "string",
  "tipo": "string",
  "clase_renta": "string",
  "moneda": "string"
  },
  "broker": "string",
  "fecha": "2026-05-18T02:31:40.599Z",
  "created_at": "2026-05-18T02:31:40.599Z"
  }
  ]

The payload for POST, request body, is:
{
"cantidad": 0,
"instrumento_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"broker": "string",
"fecha": "2026-05-18T02:33:50.283Z"
}

To get all possible Instrumentos, call api/inversiones/instrumentos?limit_precios=50' Responnse sample:
[{
"nombre": "Spdr Dow Jones Industrial",
"codigo": "DIA",
"tipo": "CEDEAR",
"clase_renta": "VARIABLE",
"moneda": "PESO",
"id": "026ed56c-e984-4a7e-b34b-e1beee4f566c",
"active": true,
"created_at": "2026-05-05T19:11:35.276194Z",
"updated_at": "2026-05-05T19:11:35.276199Z",
"precios": [
{
"id": "18cd54e6-ec93-4cdf-8095-a60a471320d0",
"fecha": "2026-05-17T00:00:00Z",
"monto": 36800
},
{
"id": "c868e352-2efc-4799-8f9e-10d3471b0b83",
"fecha": "2026-05-16T00:00:00Z",
"monto": 36800
}
]
},]

For Create popup, allow entering:

- Instrumento: Autocomplete, required. Show Nombre - tipo
- Cantidad: numeric input, greater or equal to 0, allow float numbers
- Broker: autocomplete, get possible values from enndpoint https://mis-gestiones-backend.vercel.app/api/inversiones/inversiones/meta, brokers property:
  {
  "tipo": [
  "CEDEAR",
  "FCI",
  "ON",
  "ACCION_LOCAL",
  "ACCION_INTERNACIONAL",
  "BONO",
  "FCI_EXTERIOR",
  "ETF",
  "CRIPTO"
  ],
  "clase_renta": [
  "FIJA",
  "VARIABLE",
  "MIXTA"
  ],
  "moneda": [
  "PESO",
  "DOLAR",
  "DOLAR_CCL"
  ],
  "brokers": [
  "PPI",
  "BALANZ"
  ]
  }

  For technologies, use material-react-table with @tanstack/react-query', like in C:\Users\Andres\Proyectos\mis-gestiones\src\app\finanzas\buscarMovimientos\page.tsx
  and Material UI components
