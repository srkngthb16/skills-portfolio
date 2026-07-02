// api/skills/update/[id].js
// PUT /api/skills/update/:id → mevcut bir yeteneği güncelle
//
// Body olarak şunu bekliyoruz (hepsi opsiyonel, sadece değişeni gönder):
// { "name": "TypeScript", "category": "Frontend", "level": "Orta" }

import { supabase } from '../../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { name, category, level } = req.body;

  // En az bir alan gönderilmiş olmalı
  if (!name && !category && !level) {
    return res.status(400).json({
      error: 'Güncellenecek en az bir alan gerekli (name, category veya level)',
    });
  }

  // Sadece gönderilen alanları güncelle
  const updates = {};
  if (name) updates.name = name;
  if (category) updates.category = category;
  if (level) updates.level = level;

  try {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)        // SQL: UPDATE skills SET ...
      .eq('id', id)           // SQL: WHERE id = :id
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Yetenek bulunamadı' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Yetenek güncellenemedi' });
  }
}
