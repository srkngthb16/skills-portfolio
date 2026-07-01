// api/skills/create.js
// POST /api/skills/create → yeni yetenek ekle
//
// Body olarak şunu bekliyoruz:
// { "name": "TypeScript", "category": "Frontend", "level": "Başlangıç" }

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, category, level } = req.body;

  // Gelen veriyi doğrula — üç alan da zorunlu
  if (!name || !category || !level) {
    return res.status(400).json({
      error: 'name, category ve level alanları zorunludur',
    });
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .insert({ name, category, level }) // SQL INSERT INTO skills (...) VALUES (...)
      .select()                           // eklenen satırı geri döndür
      .single();

    if (error) throw error;

    // 201 Created — yeni kaynak başarıyla oluşturuldu
    res.status(201).json(data);
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Yetenek eklenemedi' });
  }
}
