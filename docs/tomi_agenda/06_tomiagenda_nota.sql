-- Ensure schema and extension exist
CREATE SCHEMA IF NOT EXISTS misgestiones;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: misgestiones.tomiagenda_nota
CREATE TABLE IF NOT EXISTS misgestiones.tomiagenda_nota (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  tiponota_id UUID NOT NULL REFERENCES misgestiones.tomiagenda_tiponota(id),
  dia_id UUID NOT NULL REFERENCES misgestiones.tomiagenda_dia(id),
  comentarios TEXT
);


-- Backfill: por cada tomiagenda_dia con comentarios, generar una _nota de tipo 'General'
-- con _nota.comentarios = tomiagenda_dia.comentarios.
-- Idempotente: no duplica notas si se re-ejecuta.
INSERT INTO misgestiones.tomiagenda_nota (active, tiponota_id, dia_id, comentarios)
SELECT
  TRUE,
  tn.id,
  d.id,
  d.comentarios
FROM misgestiones.tomiagenda_dia d
JOIN misgestiones.tomiagenda_tiponota tn
  ON tn.tipo = 'General' AND tn.active = TRUE
WHERE d.comentarios IS NOT NULL
  AND d.comentarios <> ''
  AND d.active = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM misgestiones.tomiagenda_nota n
    WHERE n.dia_id = d.id
      AND n.comentarios = d.comentarios
  );
