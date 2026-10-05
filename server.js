/**
 * BiziBilbao — Servidor local Express
 * Uso: node server.js
 * Abre: http://localhost:3000
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Servir el frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/barrios?verde=3&colegios=4&...
app.get('/api/barrios', async (req, res) => {
  const pesos = {
    verde:        parseInt(req.query.verde)        || 3,
    colegios:     parseInt(req.query.colegios)     || 3,
    tranquilidad: parseInt(req.query.tranquilidad) || 3,
    metro:        parseInt(req.query.metro)        || 3,
    precio:       parseInt(req.query.precio)       || 3,
    ocio:         parseInt(req.query.ocio)         || 3,
  };

  try {
    const { data: barrios, error } = await supabase.from('barrios').select('*');
    if (error) throw error;

    const sumaPesos = Object.values(pesos).reduce((a, b) => a + b, 0);

    const resultado = barrios.map(b => {
      const score = (
        pesos.verde        * b.verde +
        pesos.colegios     * b.colegios +
        pesos.tranquilidad * b.tranquilidad +
        pesos.metro        * b.metro +
        pesos.precio       * b.precio +
        pesos.ocio         * b.ocio
      ) / sumaPesos;

      return {
        id: b.id,
        nombre: b.nombre,
        distrito: b.distrito,
        score: parseFloat(score.toFixed(2)),
        criterios: {
          verde: b.verde, colegios: b.colegios, tranquilidad: b.tranquilidad,
          metro: b.metro, precio: b.precio, ocio: b.ocio,
        },
        datos: {
          m2_verde_per_capita:    b.m2_verde_per_capita,
          num_colegios:           b.num_colegios,
          nivel_ruido_db:         b.nivel_ruido_db,
          num_paradas_metro:      b.num_paradas_metro,
          precio_alquiler_m2:     b.precio_alquiler_m2,
          num_equipamientos_ocio: b.num_equipamientos_ocio,
          poblacion:              b.poblacion,
          edad_media:             b.edad_media,
        },
        pros:    b.pros    || [],
        contras: b.contras || [],
        resumen: b.resumen || '',
      };
    }).sort((a, b) => b.score - a.score);

    res.json({ ok: true, pesos, total: resultado.length, barrios: resultado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/barrio/:id
app.get('/api/barrio/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('barrios').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'No encontrado' });
  res.json({ ok: true, barrio: data });
});

app.listen(PORT, () => {
  console.log(`✅ BiziBilbao corriendo en http://localhost:${PORT}`);
});
