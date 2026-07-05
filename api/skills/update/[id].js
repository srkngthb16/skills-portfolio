// api/skills/update/[id].js
// PUT /api/skills/update/:id → mevcut yeteneği güncelle (token gerekli)

import { verifyToken } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const { id } = req.query;
  const { name, category, level } = req.body;

  if (!name && !category && !level) {
    return res.status(400).json({ error: 'En az bir alan gerekli' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (category) updates.category = category;
  if (level) updates.level = level;

  try {
    const { data, error } = await auth.supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
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
