-- Ensure schema and extension exist
CREATE SCHEMA IF NOT EXISTS inversiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: inversiones.precio
CREATE TABLE IF NOT EXISTS inversiones.precio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  monto NUMERIC(12,2) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  instrumento_id UUID NOT NULL REFERENCES inversiones.instrumento(id) ON DELETE CASCADE,
  moneda VARCHAR(10) NOT NULL CHECK (moneda IN ('PESO','DOLAR')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_precio_instrumento_fecha ON inversiones.precio(instrumento_id, fecha DESC);
