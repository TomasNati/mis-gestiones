-- Ensure schema and extension exist
CREATE SCHEMA IF NOT EXISTS inversiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: inversiones.inversion
CREATE TABLE IF NOT EXISTS inversiones.inversion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  ultima BOOLEAN NOT NULL DEFAULT FALSE,
  cantidad NUMERIC NOT NULL,
  instrumento_id UUID NOT NULL REFERENCES inversiones.instrumento(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- If only one 'ultima' per instrumento is desired, enforce with partial unique index:
-- CREATE UNIQUE INDEX IF NOT EXISTS ux_inversion_instrumento_ultima ON inversiones.inversion(instrumento_id) WHERE (ultima = true);
