/**
 * BiziBilbao — API /api/barrio/[id]
 * Vercel Serverless Function
 *
 * GET /api/barrio/Indautxu
 * Devuelve la ficha completa de un barrio específico
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Falta el parámetro id' });

  try {
    const { data, error } = await supabase
      .from('barrios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: `Barrio '${id}' no encontrado` });
    }

    return res.status(200).json({ ok: true, barrio: data });

  } catch (err) {
    return res.status(500).json({ error: 'Error interno', detail: err.message });
  }
};
