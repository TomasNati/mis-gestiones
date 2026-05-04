-- Schema and extension (safe to run multiple times)
CREATE SCHEMA IF NOT EXISTS inversiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: inversiones.instrumento
CREATE TABLE IF NOT EXISTS inversiones.instrumento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(256) NOT NULL,
  codigo VARCHAR(50),
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('CEDEAR','FCI','ON','ACCION_LOCAL','ACCION_INTERNACIONAL','BONO','FCI_EXTERIOR','ETF')),
  clase_renta VARCHAR(10) NOT NULL CHECK (clase_renta IN ('FIJA','VARIABLE')),
  broker VARCHAR(256),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: index on codigo for fast lookup
CREATE INDEX IF NOT EXISTS idx_instrumento_codigo ON inversiones.instrumento(codigo);
