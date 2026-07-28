-- Ensure schema and extension exist
CREATE SCHEMA IF NOT EXISTS inversiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: inversiones.dolar_historico
-- Una fila por día con las cotizaciones del dólar de esa fecha, para poder valuar el
-- historial de inversiones con el tipo de cambio que regía ese día.
-- Los nombres de las columnas son los valores de `casa` que devuelve dolarapi (los
-- mismos que usa TIPO_DOLAR en el frontend), así el mapeo es directo.
CREATE TABLE IF NOT EXISTS inversiones.dolar_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  oficial NUMERIC(12,2) NOT NULL,
  blue NUMERIC(12,2) NOT NULL,
  bolsa NUMERIC(12,2) NOT NULL,
  contadoconliqui NUMERIC(12,2) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Una sola cotización por fecha. El backend normaliza `fecha` a medianoche antes de
-- insertar, igual que los snapshots de inversiones.inversion, así que la unicidad del
-- timestamp equivale a la unicidad del día.
-- Este índice también cubre los listados y los rangos ordenados por fecha.
CREATE UNIQUE INDEX IF NOT EXISTS ux_dolar_historico_fecha ON inversiones.dolar_historico(fecha);
