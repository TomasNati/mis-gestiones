# Inversiones - Documentación de Diseño

**Versión:** 1.0  
**Fecha:** 2026-04-24  
**Autor:** Sistema Mis Gestiones

---

## 1. Resumen Ejecutivo

### 1.1 Propósito
Agregar una nueva sección de **Inversiones** a la aplicación Mis Gestiones que permita a los usuarios administrar y visualizar su portafolio de inversiones tanto locales como internacionales, incluyendo CEDEARs, FCIs, Obligaciones Negociables y Acciones.

### 1.2 Alcance
- Gestión CRUD de inversiones (crear, ver, editar, eliminar)
- Dashboard con visualización de precios actualizados
- Cálculo de totales en ARS y USD (dólar MEP)
- Soporte para múltiples tipos de activos
- Sincronización con APIs de precios externos
- Reportes y gráficos de performance

### 1.3 Objetivos
- Centralizar la gestión de inversiones en un solo lugar
- Visualizar el rendimiento del portafolio en tiempo real
- Facilitar el seguimiento de diferentes tipos de activos
- Permitir análisis histórico de inversiones

---

## 2. Arquitectura de la Solución

### 2.1 Estructura de Carpetas

**Frontend (mis-gestiones - Next.js):**
```
src/
├── app/
│   └── inversiones/                    # Nueva sección
│       ├── page.tsx                    # Dashboard principal
│       ├── administrar/                # Gestión de activos
│       │   └── page.tsx
│       └── detalles/
│           └── [id]/                   # Vista de detalle por activo
│               └── page.tsx
├── components/
│   └── inversiones/                    # Componentes específicos
│       ├── DashboardInversiones.tsx    # Dashboard principal
│       ├── TablaInversiones.tsx        # Tabla de activos
│       ├── FormularioInversion.tsx     # Formulario alta/edición
│       ├── TarjetaActivo.tsx           # Card individual de activo
│       ├── GraficoPortafolio.tsx       # Gráficos de distribución
│       ├── ResumenTotales.tsx          # Totales ARS/USD
│       ├── FiltrosInversiones.tsx      # Filtros y búsqueda
│       └── HistorialPrecios.tsx        # Gráfico histórico
└── lib/
    └── inversiones/                    # Client-side logic
        ├── types.ts                    # Tipos TypeScript compartidos
        ├── api.ts                      # Llamadas HTTP al backend
        ├── hooks.ts                    # React Query hooks
        └── utils.ts                    # Utilidades del cliente
```

**Backend (mis-gestiones-backend - FastAPI):**
```
app/
├── routers/
│   └── inversiones.py                  # Endpoints de inversiones
├── models/
│   └── inversion.py                    # SQLAlchemy models
├── schemas/
│   └── inversion.py                    # Pydantic schemas
├── services/
│   ├── inversiones_service.py          # Business logic
│   └── cotizaciones_service.py         # External APIs integration
└── database/
    └── connection.py                   # Database connection
```

### 2.2 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    Inversiones Page                          │
│                   (app/inversiones/page.tsx)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────────┐ ┌──────────┐  ┌─────────────┐
│ Resumen      │ │ Gráfico  │  │   Tabla     │
│ Totales      │ │Portafolio│  │ Inversiones │
└──────────────┘ └──────────┘  └──────┬──────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  Formulario    │
                              │   Inversión    │
                              └────────────────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  API Routes    │
                              │  /api/inv...   │
                              └────────┬───────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  Drizzle ORM   │
                              └────────┬───────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │   PostgreSQL   │
                              └────────────────┘
```

---

## 3. Modelo de Datos

### 3.1 Esquema de Base de Datos (Backend)

**Nota:** Las tablas serán creadas y gestionadas por `mis-gestiones-backend` usando SQLAlchemy.

#### Tabla: `inversiones`

```sql
-- Tabla principal de inversiones (gestionada por backend)
CREATE TABLE inversiones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_activo       VARCHAR(50) NOT NULL,          -- 'CEDEAR', 'FCI', 'ON', 'ACCION_LOCAL', 'ACCION_INTERNACIONAL', 'BONO', 'FCI_EXTERIOR', 'ETF'
  ticker            VARCHAR(50) NOT NULL,          -- Símbolo del activo (ej: 'AAPL', 'AL30')
  nombre            VARCHAR(255) NOT NULL,         -- Nombre completo del activo
  mercado           VARCHAR(50) NOT NULL,          -- 'LOCAL', 'INTERNACIONAL'
  cantidad          DECIMAL(18,4) NOT NULL,        -- Cantidad de unidades
  broker            VARCHAR(100),                  -- Broker utilizado
  comentarios       TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_tipo_activo CHECK (tipo_activo IN ('CEDEAR', 'FCI', 'ON', 'ACCION_LOCAL', 'ACCION_INTERNACIONAL', 'BONO', 'FCI_EXTERIOR', 'ETF')),
  CONSTRAINT chk_mercado CHECK (mercado IN ('LOCAL', 'INTERNACIONAL')),
  CONSTRAINT chk_cantidad_positiva CHECK (cantidad > 0)
);

CREATE INDEX idx_inversiones_tipo ON inversiones(tipo_activo);
CREATE INDEX idx_inversiones_ticker ON inversiones(ticker);
```

### 3.2 SQLAlchemy Model (Backend)

```python
# app/models/inversion.py (mis-gestiones-backend)

from sqlalchemy import Column, String, Numeric, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

class Inversion(Base):
    __tablename__ = "inversiones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo_activo = Column(String(50), nullable=False)
    ticker = Column(String(50), nullable=False, index=True)
    nombre = Column(String(255), nullable=False)
    mercado = Column(String(50), nullable=False)
    cantidad = Column(Numeric(18, 4), nullable=False)
    broker = Column(String(100), nullable=True)
    comentarios = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint(
            "tipo_activo IN ('CEDEAR', 'FCI', 'ON', 'ACCION_LOCAL', 'ACCION_INTERNACIONAL', 'BONO', 'FCI_EXTERIOR', 'ETF')",
            name='chk_tipo_activo'
        ),
        CheckConstraint("mercado IN ('LOCAL', 'INTERNACIONAL')", name='chk_mercado'),
        CheckConstraint("cantidad > 0", name='chk_cantidad_positiva'),
    )
```

### 3.3 Pydantic Schemas (Backend)

```python
# app/schemas/inversion.py (mis-gestiones-backend)

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoActivo(str, Enum):
    CEDEAR = "CEDEAR"
    FCI = "FCI"
    ON = "ON"
    ACCION_LOCAL = "ACCION_LOCAL"
    ACCION_INTERNACIONAL = "ACCION_INTERNACIONAL"
    BONO = "BONO"
    FCI_EXTERIOR = "FCI_EXTERIOR"
    ETF = "ETF"

class Mercado(str, Enum):
    LOCAL = "LOCAL"
    INTERNACIONAL = "INTERNACIONAL"

class InversionCreate(BaseModel):
    tipo_activo: TipoActivo
    ticker: str = Field(..., min_length=1, max_length=50)
    nombre: str = Field(..., min_length=1, max_length=255)
    mercado: Mercado
    cantidad: float = Field(..., gt=0)
    broker: Optional[str] = Field(None, max_length=100)
    comentarios: Optional[str] = None

class InversionUpdate(BaseModel):
    tipo_activo: Optional[TipoActivo] = None
    ticker: Optional[str] = None
    nombre: Optional[str] = None
    mercado: Optional[Mercado] = None
    cantidad: Optional[float] = Field(None, gt=0)
    broker: Optional[str] = None
    comentarios: Optional[str] = None

class InversionResponse(BaseModel):
    id: str
    tipo_activo: str
    ticker: str
    nombre: str
    mercado: str
    cantidad: float
    broker: Optional[str]
    comentarios: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

### 3.4 Tipos TypeScript (Frontend)

```typescript
// src/lib/inversiones/types.ts (mis-gestiones frontend)

export enum TipoActivo {
  CEDEAR = 'CEDEAR',
  FCI = 'FCI',
  ON = 'ON',
  ACCION_LOCAL = 'ACCION_LOCAL',
  ACCION_INTERNACIONAL = 'ACCION_INTERNACIONAL',
  BONO = 'BONO',
  FCI_EXTERIOR = 'FCI_EXTERIOR',
  ETF = 'ETF',
}

export enum Mercado {
  LOCAL = 'LOCAL',
  INTERNACIONAL = 'INTERNACIONAL',
}

export enum Moneda {
  ARS = 'ARS',
  USD = 'USD',
}



export interface Inversion {
  id: string;
  tipoActivo: TipoActivo;
  ticker: string;
  nombre: string;
  mercado: Mercado;
  cantidad: number;
  broker?: string;
  comentarios?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cotizacion {
  ticker: string;
  mercado: Mercado;
  precio: number;
  moneda: Moneda;
  fechaHora: Date;
}

export interface InversionConCotizacion extends Inversion {
  precioActual: number;
  monedaActual: Moneda;
  valorTotal: number;
  gananciaAbsoluta: number;
  gananciaRelativa: number; // Porcentaje
  ultimaActualizacion: Date;
}

export interface ResumenPortafolio {
  totalInvertidoARS: number;
  totalInvertidoUSD: number;
  valorActualARS: number;
  valorActualUSD: number;
  gananciaTotalARS: number;
  gananciaTotalUSD: number;
  rendimientoTotal: number; // Porcentaje
  distribucionPorTipo: DistribucionActivo[];
  ultimaActualizacion: Date;
}

export interface DistribucionActivo {
  tipoActivo: TipoActivo;
  cantidad: number;
  valorTotal: number;
  porcentaje: number;
}
```

### 3.5 Validaciones Frontend (Zod)

```typescript
// src/lib/inversiones/validaciones.ts (mis-gestiones frontend)

import { z } from 'zod';
import { TipoActivo, Mercado } from './types';

export const inversionSchema = z.object({
  id: z.string().uuid().optional(),
  tipoActivo: z.nativeEnum(TipoActivo),
  ticker: z.string().min(1).max(50).toUpperCase(),
  nombre: z.string().min(1).max(255),
  mercado: z.nativeEnum(Mercado),
  cantidad: z.number().positive(),
  broker: z.string().max(100).optional(),
  comentarios: z.string().optional(),
});

export type InversionInput = z.infer<typeof inversionSchema>;

export const filtrosInversionesSchema = z.object({
  tipoActivo: z.array(z.nativeEnum(TipoActivo)).optional(),
  mercado: z.nativeEnum(Mercado).optional(),
  broker: z.string().optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  busqueda: z.string().optional(), // Buscar por ticker o nombre
});

export type FiltrosInversiones = z.infer<typeof filtrosInversionesSchema>;
```

---

## 4. Arquitectura Backend

### 4.1 mis-gestiones-backend (FastAPI)

**Base URL:** `process.env.NEXT_PUBLIC_BACKEND_BASE_URL`

El backend centraliza toda la lógica de negocio, acceso a base de datos y integración con APIs externas.

#### Responsabilidades del Backend:

1. **Gestión de Base de Datos:**
   - CRUD de inversiones via SQLAlchemy
   - Migraciones con Alembic
   - Validación de datos con Pydantic

2. **Integración con APIs Externas:**
   - PPI (Portfolio Personal Inversiones) - Mercado local
   - Yahoo Finance - Acciones internacionales
   - DolarAPI - Tipo de cambio
   - Caché de cotizaciones

3. **Business Logic:**
   - Cálculos de rendimiento
   - Conversión de monedas
   - Agregación de datos
   - Reportes

#### Endpoints del Backend (Pendientes de Implementación):

```
Inversiones:
  GET    /api/inversiones          - Listar inversiones
  POST   /api/inversiones          - Crear inversión
  GET    /api/inversiones/{id}     - Obtener detalle
  PUT    /api/inversiones/{id}     - Actualizar inversión
  DELETE /api/inversiones/{id}     - Eliminar inversión
  
Cotizaciones:
  GET    /api/cotizaciones/{ticker}        - Obtener cotización
  POST   /api/cotizaciones/batch           - Múltiples cotizaciones
  GET    /api/cotizaciones/dolar-mep       - Tipo de cambio MEP
  
Reportes:
  GET    /api/inversiones/resumen          - Resumen del portafolio
  GET    /api/inversiones/distribucion     - Distribución por tipo
```

---

## 5. Comunicación Frontend-Backend

### 5.1 Cliente API (Frontend)

```typescript
// src/lib/inversiones/api.ts (mis-gestiones frontend)

import apiClient from '@/lib/api';
import type { Inversion, InversionConCotizacion, ResumenPortafolio } from './types';

export const inversionesApi = {
  /**
   * Obtiene todas las inversiones
   */
  async getAll(filtros?: {
    tipoActivo?: string;
    mercado?: string;
    broker?: string;
  }): Promise<Inversion[]> {
    const response = await apiClient.get('/inversiones', { params: filtros });
    return response.data;
  },

  /**
   * Obtiene una inversión por ID
   */
  async getById(id: string): Promise<Inversion> {
    const response = await apiClient.get(`/inversiones/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva inversión
   */
  async create(data: Omit<Inversion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inversion> {
    const response = await apiClient.post('/inversiones', data);
    return response.data;
  },

  /**
   * Actualiza una inversión existente
   */
  async update(id: string, data: Partial<Inversion>): Promise<Inversion> {
    const response = await apiClient.put(`/inversiones/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una inversión
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/inversiones/${id}`);
  },

  /**
   * Obtiene resumen del portafolio con cotizaciones actuales
   */
  async getResumen(): Promise<ResumenPortafolio> {
    const response = await apiClient.get('/inversiones/resumen');
    return response.data;
  },

  /**
   * Obtiene inversiones con cotizaciones actualizadas
   */
  async getConCotizaciones(): Promise<InversionConCotizacion[]> {
    const response = await apiClient.get('/inversiones/cotizaciones');
    return response.data;
  },
};
```

### 5.2 React Query Hooks (Frontend)

```typescript
// src/lib/inversiones/hooks.ts (mis-gestiones frontend)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inversionesApi } from './api';
import type { Inversion } from './types';

export function useInversiones(filtros?: any) {
  return useQuery({
    queryKey: ['inversiones', filtros],
    queryFn: () => inversionesApi.getAll(filtros),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useInversion(id: string) {
  return useQuery({
    queryKey: ['inversion', id],
    queryFn: () => inversionesApi.getById(id),
    enabled: !!id,
  });
}

export function useResumenPortafolio() {
  return useQuery({
    queryKey: ['resumen-portafolio'],
    queryFn: () => inversionesApi.getResumen(),
    refetchInterval: 15 * 60 * 1000, // Refetch cada 15 min
  });
}

export function useCrearInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Inversion, 'id' | 'createdAt' | 'updatedAt'>) =>
      inversionesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}

export function useActualizarInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inversion> }) =>
      inversionesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['inversion', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}

export function useEliminarInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => inversionesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}
```

### 5.2 Actualización Periódica de Precios

```typescript
// api/inversiones/actualizar-cotizaciones.ts (Cron Job)

export async function actualizarTodasLasCotizaciones() {
  // Obtener todos los tickers únicos de las inversiones
  const tickers = await db
    .selectDistinct({ ticker: inversiones.ticker, mercado: inversiones.mercado })
    .from(inversiones);
  
  for (const { ticker, mercado } of tickers) {
    try {
      const cotizacion = await servicioCotizaciones.obtenerPrecio(ticker, mercado);
      await db.insert(cotizacionesCache).values(cotizacion);
    } catch (error) {
      console.error(`Error actualizando ${ticker}:`, error);
    }
  }
  
  // Actualizar dólar MEP
  try {
    const dolarMEP = await servicioCotizaciones.obtenerDolarMEP();
    // Guardar en caché local si es necesario
    await db.insert(cotizacionesCache).values({
      ticker: 'DOLAR_MEP',
      mercado: 'LOCAL',
      precio: dolarMEP.venta,
      moneda: 'ARS',
      fechaHora: new Date(),
    });
  } catch (error) {
    console.error('Error actualizando dólar MEP:', error);
  }
}

// Vercel Cron Job (ejecutar cada 15 minutos en horario de mercado)
export const config = {
  schedule: '*/15 9-17 * * 1-5', // Cada 15 min, 9am-5pm, lunes a viernes
};
```

---

## 5. Interfaz de Usuario

### 5.1 Dashboard Principal

**Ruta:** `/inversiones`

**Componentes:**

```tsx
// app/inversiones/page.tsx

export default function InversionesPage() {
  const { data: inversiones } = useInversiones();
  const { data: resumen } = useResumenPortafolio();
  
  return (
    <Container>
      <Typography variant="h4">Mi Portafolio de Inversiones</Typography>
      
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <TarjetaTotal 
            titulo="Total Invertido (ARS)"
            valor={resumen.totalInvertidoARS}
            moneda="ARS"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TarjetaTotal 
            titulo="Valor Actual (ARS)"
            valor={resumen.valorActualARS}
            moneda="ARS"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TarjetaTotal 
            titulo="Ganancia (ARS)"
            valor={resumen.gananciaTotalARS}
            moneda="ARS"
            color={resumen.gananciaTotalARS >= 0 ? 'success' : 'error'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TarjetaTotal 
            titulo="Rendimiento"
            valor={`${resumen.rendimientoTotal.toFixed(2)}%`}
            color={resumen.rendimientoTotal >= 0 ? 'success' : 'error'}
          />
        </Grid>
      </Grid>
      
      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Distribución por Tipo</Typography>
            <GraficoTorta data={resumen.distribucionPorTipo} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Evolución Temporal</Typography>
            <GraficoLinea />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabla de inversiones */}
      <Paper sx={{ mt: 3 }}>
        <TablaInversiones inversiones={inversiones} />
      </Paper>
    </Container>
  );
}
```

### 5.2 Tabla de Inversiones (Material React Table)

```tsx
// components/inversiones/TablaInversiones.tsx

const columnas: MRT_ColumnDef<InversionConCotizacion>[] = [
  {
    accessorKey: 'ticker',
    header: 'Ticker',
    size: 100,
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    size: 200,
  },
  {
    accessorKey: 'tipoActivo',
    header: 'Tipo',
    size: 120,
    Cell: ({ cell }) => (
      <Chip label={cell.getValue()} size="small" />
    ),
  },
  {
    accessorKey: 'cantidad',
    header: 'Cantidad',
    size: 100,
    Cell: ({ cell }) => cell.getValue().toLocaleString('es-AR'),
  },
  {
    accessorKey: 'precioCompra',
    header: 'Precio Compra',
    size: 120,
    Cell: ({ cell, row }) => formatearMoneda(cell.getValue(), row.original.monedaCompra),
  },
  {
    accessorKey: 'precioActual',
    header: 'Precio Actual',
    size: 120,
    Cell: ({ cell, row }) => formatearMoneda(cell.getValue(), row.original.monedaActual),
  },
  {
    accessorKey: 'valorTotal',
    header: 'Valor Total',
    size: 130,
    Cell: ({ cell, row }) => formatearMoneda(cell.getValue(), row.original.monedaActual),
  },
  {
    accessorKey: 'gananciaRelativa',
    header: 'Rendimiento',
    size: 120,
    Cell: ({ cell }) => {
      const valor = cell.getValue() as number;
      const color = valor >= 0 ? 'success' : 'error';
      return (
        <Chip 
          label={`${valor >= 0 ? '+' : ''}${valor.toFixed(2)}%`}
          color={color}
          size="small"
        />
      );
    },
  },
  {
    accessorKey: 'fechaCompra',
    header: 'Fecha Compra',
    size: 120,
    Cell: ({ cell }) => dayjs(cell.getValue()).format('DD/MM/YYYY'),
  },
];

export function TablaInversiones({ inversiones }: Props) {
  return (
    <MaterialReactTable
      columns={columnas}
      data={inversiones}
      enableColumnFilters
      enableSorting
      enableRowActions
      renderRowActions={({ row }) => (
        <Box>
          <IconButton onClick={() => handleEdit(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      renderTopToolbarCustomActions={() => (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNuevaInversion}
        >
          Nueva Inversión
        </Button>
      )}
    />
  );
}
```

### 5.3 Formulario de Alta/Edición

```tsx
// components/inversiones/FormularioInversion.tsx

export function FormularioInversion({ inversion, onSubmit, onCancel }: Props) {
  const { control, handleSubmit, watch } = useForm<InversionInput>({
    resolver: zodResolver(inversionSchema),
    defaultValues: inversion || {
      cantidad: 1,
      comision: 0,
      monedaCompra: Moneda.ARS,
      fechaCompra: new Date(),
    },
  });
  
  const tipoActivo = watch('tipoActivo');
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="tipoActivo"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Tipo de Activo</InputLabel>
                <Select {...field}>
                  <MenuItem value={TipoActivo.CEDEAR}>CEDEAR</MenuItem>
                  <MenuItem value={TipoActivo.FCI}>Fondo Común de Inversión</MenuItem>
                  <MenuItem value={TipoActivo.ON}>Obligación Negociable</MenuItem>
                  <MenuItem value={TipoActivo.ACCION_LOCAL}>Acción Local</MenuItem>
                  <MenuItem value={TipoActivo.ACCION_INTERNACIONAL}>Acción Internacional</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="mercado"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Mercado</InputLabel>
                <Select {...field}>
                  <MenuItem value={Mercado.LOCAL}>Local</MenuItem>
                  <MenuItem value={Mercado.INTERNACIONAL}>Internacional</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="ticker"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ticker"
                placeholder="Ej: AAPL, AL30"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => buscarTicker(field.value)}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre del Activo"
                placeholder="Ej: Apple Inc."
                fullWidth
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Controller
            name="cantidad"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Cantidad"
                fullWidth
                inputProps={{ step: 0.0001 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Controller
            name="precioCompra"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Precio de Compra"
                fullWidth
                inputProps={{ step: 0.01 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Controller
            name="monedaCompra"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select {...field}>
                  <MenuItem value={Moneda.ARS}>ARS ($)</MenuItem>
                  <MenuItem value={Moneda.USD}>USD (US$)</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="fechaCompra"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha de Compra"
                value={field.value}
                onChange={field.onChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="broker"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Broker"
                placeholder="Ej: IOL, Balanz"
                fullWidth
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Controller
            name="comision"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Comisión"
                fullWidth
                inputProps={{ step: 0.01 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="comentarios"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Comentarios"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {inversion ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
```

### 5.4 Gráficos con MUI X-Charts

```tsx
// components/inversiones/GraficoPortafolio.tsx

export function GraficoTorta({ data }: { data: DistribucionActivo[] }) {
  const chartData = data.map(item => ({
    label: item.tipoActivo,
    value: item.porcentaje,
  }));
  
  return (
    <PieChart
      series={[
        {
          data: chartData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30 },
        },
      ]}
      height={300}
    />
  );
}

export function GraficoLinea() {
  const { data: historico } = useHistoricoPortafolio();
  
  return (
    <LineChart
      xAxis={[
        {
          data: historico.map(h => new Date(h.fecha)),
          scaleType: 'time',
        },
      ]}
      series={[
        {
          data: historico.map(h => h.valorTotal),
          label: 'Valor del Portafolio',
          showMark: false,
        },
      ]}
      height={300}
    />
  );
}
```

---

## 6. API Endpoints

### 6.1 Endpoints RESTful

```typescript
// api/inversiones/index.ts

/**
 * GET /api/inversiones
 * Obtiene todas las inversiones con cotizaciones actuales
 * Query params:
 *   - tipoActivo?: TipoActivo
 *   - mercado?: Mercado
 *   - broker?: string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filtros = {
    tipoActivo: searchParams.get('tipoActivo'),
    mercado: searchParams.get('mercado'),
    broker: searchParams.get('broker'),
  };
  
  const inversiones = await db
    .select()
    .from(inversionesTable)
    .where(buildFilters(filtros));
  
  // Obtener cotizaciones actuales desde el backend
  const servicioCotizaciones = new ServicioCotizaciones();
  
  // Obtener todas las cotizaciones en batch
  const tickersConInfo = inversiones.map(inv => ({
    ticker: inv.ticker,
    mercado: inv.mercado,
    tipoActivo: inv.tipoActivo
  }));
  
  const cotizacionesMap = await servicioCotizaciones.obtenerPreciosBatch(tickersConInfo);
  
  // Mapear inversiones con cotizaciones
  const inversionesConCotizacion = inversiones.map(inv => {
    const cotizacion = cotizacionesMap.get(`${inv.ticker}-${inv.mercado}`);
    if (!cotizacion) {
      return {
        ...inv,
        precioActual: 0,
        monedaActual: inv.mercado === 'LOCAL' ? 'ARS' : 'USD',
        ultimaActualizacion: new Date(),
      };
    }
    
    // Nota: calcularRendimiento ahora requiere precio de compra promedio
    // que debería venir de transacciones
    const rendimiento = {
      valorCompra: 0,
      valorActual: inv.cantidad * cotizacion.precio,
      gananciaAbsoluta: 0,
      gananciaRelativa: 0,
    };
    
    return {
      ...inv,
      precioActual: cotizacion.precio,
      monedaActual: cotizacion.moneda,
      ...rendimiento,
      ultimaActualizacion: cotizacion.fechaHora,
    };
  });
  
  return Response.json(inversionesConCotizacion);
}

/**
 * POST /api/inversiones
 * Crea una nueva inversión
 */
export async function POST(request: Request) {
  const body = await request.json();
  const validado = inversionSchema.parse(body);
  
  const [nuevaInversion] = await db
    .insert(inversionesTable)
    .values(validado)
    .returning();
  
  return Response.json(nuevaInversion, { status: 201 });
}
```

```typescript
// api/inversiones/[id].ts

/**
 * GET /api/inversiones/:id
 * Obtiene detalle de una inversión específica
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const inversion = await db
    .select()
    .from(inversionesTable)
    .where(eq(inversionesTable.id, params.id))
    .limit(1);
  
  if (!inversion.length) {
    return Response.json({ error: 'Inversión no encontrada' }, { status: 404 });
  }
  
  return Response.json(inversion[0]);
}

/**
 * PUT /api/inversiones/:id
 * Actualiza una inversión
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const validado = inversionSchema.parse(body);
  
  const [actualizado] = await db
    .update(inversionesTable)
    .set({ ...validado, updatedAt: new Date() })
    .where(eq(inversionesTable.id, params.id))
    .returning();
  
  return Response.json(actualizado);
}

/**
 * DELETE /api/inversiones/:id
 * Elimina una inversión
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db
    .delete(inversionesTable)
    .where(eq(inversionesTable.id, params.id));
  
  return Response.json({ success: true });
}
```

```typescript
// api/inversiones/resumen.ts

/**
 * GET /api/inversiones/resumen
 * Obtiene resumen completo del portafolio
 */
export async function GET() {
  const inversiones = await db.select().from(inversionesTable);
  
  const servicioCotizaciones = new ServicioCotizaciones();
  
  // Obtener dólar MEP
  const dolarMEP = await servicioCotizaciones.obtenerDolarMEP();
  
  // Obtener todas las cotizaciones en batch
  const tickersInfo = inversiones.map(inv => ({
    ticker: inv.ticker,
    mercado: inv.mercado,
    tipoActivo: inv.tipoActivo
  }));
  const cotizacionesMap = await servicioCotizaciones.obtenerPreciosBatch(tickersInfo);
  
  // Calcular resumen
  const resumen = await CalculadoraInversiones.calcularResumenPortafolio(
    inversiones,
    cotizacionesMap,
    dolarMEP.venta
  );
  
  return Response.json(resumen);
}
```

### 6.2 React Query Hooks

```typescript
// lib/inversiones/api.ts

export function useInversiones(filtros?: FiltrosInversiones) {
  return useQuery({
    queryKey: ['inversiones', filtros],
    queryFn: async () => {
      const params = new URLSearchParams(filtros as any);
      const res = await fetch(`/api/inversiones?${params}`);
      return res.json() as Promise<InversionConCotizacion[]>;
    },
    refetchInterval: 15 * 60 * 1000, // Refetch cada 15 minutos
  });
}

export function useInversion(id: string) {
  return useQuery({
    queryKey: ['inversion', id],
    queryFn: async () => {
      const res = await fetch(`/api/inversiones/${id}`);
      return res.json() as Promise<Inversion>;
    },
  });
}

export function useResumenPortafolio() {
  return useQuery({
    queryKey: ['resumen-portafolio'],
    queryFn: async () => {
      const res = await fetch('/api/inversiones/resumen');
      return res.json() as Promise<ResumenPortafolio>;
    },
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useCrearInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InversionInput) => {
      const res = await fetch('/api/inversiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}

export function useActualizarInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InversionInput }) => {
      const res = await fetch(`/api/inversiones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['inversion', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}

export function useEliminarInversion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/inversiones/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      queryClient.invalidateQueries({ queryKey: ['resumen-portafolio'] });
    },
  });
}
```

---

## 7. Consideraciones de Seguridad

### 8.1 Protección de Datos Sensibles

```typescript
// Nunca exponer API keys en el cliente
// Usar variables de entorno en el servidor
const IOL_API_KEY = process.env.IOL_API_KEY;
const YAHOO_API_KEY = process.env.YAHOO_API_KEY;

// En API routes, verificar autenticación
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  // Continuar con la lógica...
}
```

### 8.2 Validación de Datos

```typescript
// Siempre validar en el servidor con Zod
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validado = inversionSchema.parse(body);
    
    // Continuar...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### 8.3 Rate Limiting en APIs Externas

```typescript
// Implementar rate limiting simple
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filtrar requests dentro de la ventana
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

const limiter = new RateLimiter();

// Usar antes de llamar a API externa
if (!limiter.canMakeRequest('iol-api', 60, 60000)) {
  throw new Error('Rate limit excedido, intente nuevamente en un minuto');
}
```

---

## 8. Testing

### 9.1 Tests Unitarios

```typescript
// __tests__/lib/inversiones/calculadora.test.ts

describe('CalculadoraInversiones', () => {
  describe('calcularRendimiento', () => {
    it('calcula correctamente la ganancia positiva', () => {
      const inversion: Inversion = {
        id: '1',
        cantidad: 10,
        precioCompra: 100,
        comision: 50,
        // ... otros campos
      };
      
      const rendimiento = CalculadoraInversiones.calcularRendimiento(inversion, 150);
      
      expect(rendimiento.valorCompra).toBe(1050); // 10 * 100 + 50
      expect(rendimiento.valorActual).toBe(1500); // 10 * 150
      expect(rendimiento.gananciaAbsoluta).toBe(450);
      expect(rendimiento.gananciaRelativa).toBeCloseTo(42.86, 2);
    });
    
    it('calcula correctamente la pérdida', () => {
      const inversion: Inversion = {
        id: '1',
        cantidad: 10,
        precioCompra: 100,
        comision: 50,
        // ... otros campos
      };
      
      const rendimiento = CalculadoraInversiones.calcularRendimiento(inversion, 80);
      
      expect(rendimiento.gananciaAbsoluta).toBe(-250);
      expect(rendimiento.gananciaRelativa).toBeCloseTo(-23.81, 2);
    });
  });
  
  describe('convertirMoneda', () => {
    it('convierte correctamente USD a ARS', () => {
      const resultado = CalculadoraInversiones.convertirMoneda(100, Moneda.USD, Moneda.ARS, 1000);
      expect(resultado).toBe(100000);
    });
    
    it('convierte correctamente ARS a USD', () => {
      const resultado = CalculadoraInversiones.convertirMoneda(100000, Moneda.ARS, Moneda.USD, 1000);
      expect(resultado).toBe(100);
    });
    
    it('no convierte si las monedas son iguales', () => {
      const resultado = CalculadoraInversiones.convertirMoneda(100, Moneda.USD, Moneda.USD, 1000);
      expect(resultado).toBe(100);
    });
  });
});
```

### 9.2 Tests de Integración

```typescript
// __tests__/api/inversiones.test.ts

describe('API /api/inversiones', () => {
  beforeEach(async () => {
    // Limpiar base de datos de test
    await db.delete(inversionesTable);
  });
  
  describe('GET /api/inversiones', () => {
    it('retorna lista vacía cuando no hay inversiones', async () => {
      const res = await fetch('/api/inversiones');
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
    
    it('retorna inversiones con cotizaciones', async () => {
      // Crear inversión de prueba
      await db.insert(inversionesTable).values({
        tipoActivo: TipoActivo.CEDEAR,
        ticker: 'AAPL',
        nombre: 'Apple Inc.',
        // ... otros campos
      });
      
      const res = await fetch('/api/inversiones');
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty('precioActual');
      expect(data[0]).toHaveProperty('gananciaRelativa');
    });
  });
  
  describe('POST /api/inversiones', () => {
    it('crea una nueva inversión correctamente', async () => {
      const nuevaInversion = {
        tipoActivo: TipoActivo.CEDEAR,
        ticker: 'GOOGL',
        nombre: 'Alphabet Inc.',
        mercado: Mercado.LOCAL,
        cantidad: 5,
        precioCompra: 50000,
        monedaCompra: Moneda.ARS,
        fechaCompra: new Date('2024-01-01'),
      };
      
      const res = await fetch('/api/inversiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaInversion),
      });
      
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.ticker).toBe('GOOGL');
    });
    
    it('retorna error 400 con datos inválidos', async () => {
      const inversionInvalida = {
        tipoActivo: 'INVALIDO',
        // campos faltantes
      };
      
      const res = await fetch('/api/inversiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inversionInvalida),
      });
      
      expect(res.status).toBe(400);
    });
  });
});
```

---

## 9. Roadmap de Implementación

### Fase 1: Fundamentos Backend (Semana 1-2)
- ✅ Diseño de base de datos
- ⬜ Modelos SQLAlchemy (backend)
- ⬜ Schemas Pydantic (backend)
- ⬜ Migraciones con Alembic
- ⬜ Endpoints FastAPI básicos (CRUD)
- ⬜ Service layer con lógica de negocio

### Fase 2: Integración de Cotizaciones Backend (Semana 3)
- ⬜ Servicio de cotizaciones en backend (PPI, Yahoo, DolarAPI)
- ⬜ Sistema de caché de cotizaciones (backend)
- ⬜ Endpoints de cotizaciones en FastAPI
- ⬜ Cálculo de rendimientos y resumen de portafolio
- ⬜ Manejo de errores y fallbacks

### Fase 3: Frontend - Cliente API (Semana 4)
- ⬜ Tipos TypeScript compartidos
- ⬜ Cliente API (axios) para comunicación con backend
- ⬜ React Query hooks (useInversiones, useResumen, etc.)
- ⬜ Validaciones Zod en frontend
- ⬜ Manejo de errores y estados de carga

### Fase 4: Frontend - UI Dashboard (Semana 5)
- ⬜ Componente Dashboard principal
- ⬜ Tarjetas de resumen
- ⬜ Tabla de inversiones (Material React Table)
- ⬜ Gráficos con MUI X-Charts
- ⬜ Filtros y búsqueda

### Fase 5: Frontend - Gestión CRUD (Semana 6)
- ⬜ Formulario de alta/edición
- ⬜ Validaciones en tiempo real
- ⬜ Búsqueda de tickers
- ⬜ Vista de detalle por activo
- ⬜ Eliminación con confirmación

### Fase 6: Automatización (Semana 7)
- ⬜ Cron job para actualizar cotizaciones
- ⬜ Notificaciones de cambios importantes
- ⬜ Export de datos (CSV/Excel)
- ⬜ Backup automático

### Fase 7: Testing y Refinamiento (Semana 8)
- ⬜ Tests unitarios
- ⬜ Tests de integración
- ⬜ Optimización de performance
- ⬜ Documentación técnica
- ⬜ Deploy a producción

---

## 10. Métricas y Monitoreo

### 10.1 KPIs Técnicos
- Tiempo de respuesta API < 500ms
- Cache hit ratio > 80%
- Uptime APIs externas > 95%
- Tiempo de carga dashboard < 2s

### 10.2 Logging

```typescript
// lib/logger.ts

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  },
};

// Uso en servicios
try {
  const cotizacion = await obtenerCotizacion(ticker);
  logger.info('Cotización obtenida', { ticker, precio: cotizacion.precio });
} catch (error) {
  logger.error('Error obteniendo cotización', error as Error);
  throw error;
}
```

---

## 11. Anexos

### 11.1 Glosario

- **CEDEAR:** Certificado de Depósito Argentino (acciones internacionales en mercado local)
- **FCI:** Fondo Común de Inversión
- **ON:** Obligación Negociable (bonos corporativos)
- **Dólar MEP:** Mercado Electrónico de Pagos (tipo de cambio bursátil)
- **Ticker:** Símbolo único que identifica un activo financiero

### 11.2 Referencias

- **mis-gestiones-backend:** Backend API con integración PPI
- **PPI Client:** https://github.com/portfoliopersonal/pyppi
- **Yahoo Finance API:** https://www.yahoofinanceapi.com/
- **Dólar API:** https://dolarapi.com/docs
- **Material-UI Charts:** https://mui.com/x/react-charts/
- **Drizzle ORM:** https://orm.drizzle.team/docs/overview

---

**Última actualización:** 2026-04-24  
**Versión del documento:** 1.0  
**Estado:** Diseño Inicial
