-- BiziBilbao — Schema Supabase
-- Ejecutar en: Supabase → SQL Editor → New query → pegar y Run

-- Tabla principal de barrios con indicadores reales
CREATE TABLE IF NOT EXISTS barrios (
  id TEXT PRIMARY KEY,                    -- ej: 'Indautxu'
  nombre TEXT NOT NULL,
  distrito TEXT NOT NULL,

  -- Indicadores normalizados 0-10 (calculados del ETL)
  verde NUMERIC(4,2) DEFAULT 0,           -- m² zona verde per cápita
  colegios NUMERIC(4,2) DEFAULT 0,        -- nº colegios / superficie
  tranquilidad NUMERIC(4,2) DEFAULT 0,   -- inverso del nivel de ruido
  metro NUMERIC(4,2) DEFAULT 0,           -- nº paradas metro cercanas
  precio NUMERIC(4,2) DEFAULT 0,          -- inverso precio alquiler
  ocio NUMERIC(4,2) DEFAULT 0,            -- equipamientos ocio / hab

  -- Valores brutos reales
  m2_verde_per_capita NUMERIC(10,2),
  num_colegios INTEGER,
  nivel_ruido_db NUMERIC(5,1),
  num_paradas_metro INTEGER,
  precio_alquiler_m2 NUMERIC(8,2),
  num_equipamientos_ocio INTEGER,
  poblacion INTEGER,
  edad_media NUMERIC(4,1),

  -- Metadata
  pros TEXT[],
  contras TEXT[],
  resumen TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de log de actualizaciones ETL
CREATE TABLE IF NOT EXISTS etl_log (
  id SERIAL PRIMARY KEY,
  fuente TEXT NOT NULL,
  registros_procesados INTEGER,
  status TEXT,
  mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: lectura pública (los datos son open data)
ALTER TABLE barrios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "barrios_public_read" ON barrios FOR SELECT USING (true);

ALTER TABLE etl_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "etl_log_public_read" ON etl_log FOR SELECT USING (true);

-- Índice
CREATE INDEX IF NOT EXISTS barrios_distrito_idx ON barrios(distrito);
