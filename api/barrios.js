/**
 * BiziBilbao — API /api/barrios
 * Vercel Serverless Function
 *
 * GET /api/barrios?verde=3&colegios=5&tranquilidad=2&metro=4&precio=5&ocio=1
 * Devuelve los 35 barrios con scores calculados según los pesos del usuario
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // CORS para que el frontend pueda llamar a la API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Pesos del usuario (1-5 estrellas, default 3)
    const pesos = {
      verde:        parseInt(req.query.verde)        || 3,
      colegios:     parseInt(req.query.colegios)     || 3,
      tranquilidad: parseInt(req.query.tranquilidad) || 3,
      metro:        parseInt(req.query.metro)        || 3,
      precio:       parseInt(req.query.precio)       || 3,
      ocio:         parseInt(req.query.ocio)         || 3,
    };

    // Validar que los pesos estén en rango 1-5
    for (const [key, val] of Object.entries(pesos)) {
      if (val < 1 || val > 5) {
        return res.status(400).json({ error: `Peso '${key}' debe estar entre 1 y 5` });
      }
    }

    // Obtener datos de Supabase
    const { data: barrios, error } = await supabase
      .from('barrios')
      .select('*')
      .order('id');

    if (error) throw error;
    if (!barrios || barrios.length === 0) {
      return res.status(503).json({ error: 'Base de datos no inicializada. Ejecuta el seed.' });
    }

    // Calcular score ponderado para cada barrio
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
        // Valores normalizados por criterio
        criterios: {
          verde:        b.verde,
          colegios:     b.colegios,
          tranquilidad: b.tranquilidad,
          metro:        b.metro,
          precio:       b.precio,
          ocio:         b.ocio,
        },
        // Datos brutos para la ficha
        datos: {
          m2_verde_per_capita: b.m2_verde_per_capita,
          num_colegios:        b.num_colegios,
          nivel_ruido_db:      b.nivel_ruido_db,
          num_paradas_metro:   b.num_paradas_metro,
          precio_alquiler_m2:  b.precio_alquiler_m2,
          num_equipamientos_ocio: b.num_equipamientos_ocio,
          poblacion:           b.poblacion,
          edad_media:          b.edad_media,
        },
        pros:    b.pros    || [],
        contras: b.contras || [],
        resumen: b.resumen || '',
      };
    }).sort((a, b) => b.score - a.score); // ordenar por score desc

    return res.status(200).json({
      ok: true,
      pesos,
      total: resultado.length,
      barrios: resultado,
    });

  } catch (err) {
    console.error('Error en /api/barrios:', err);
    return res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
  }
};
