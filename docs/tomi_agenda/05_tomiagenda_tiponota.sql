-- Ensure schema and extension exist
CREATE SCHEMA IF NOT EXISTS misgestiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: misgestiones.tomiagenda_tiponota
CREATE TABLE IF NOT EXISTS misgestiones.tomiagenda_tiponota (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  tipo VARCHAR(255) NOT NULL
);

-- Backfill: valores iniciales de tipos de nota, todos activos
INSERT INTO misgestiones.tomiagenda_tiponota (tipo, active) VALUES
  ('General', TRUE),
  ('Orina', TRUE),
  ('Cambio de medicación', TRUE),
  ('Crisis', TRUE),
  ('Malhumor', TRUE)
ON CONFLICT DO NOTHING;
