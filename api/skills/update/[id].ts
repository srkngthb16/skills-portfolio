// api/skills/update/[id].ts
// PUT /api/skills/update/:id → mevcut yeteneği güncelle (token gerekli)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../../lib/auth.js';
import type { SkillUpdate } from '../../../lib/types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const idParam = req.query.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { name, category, level } = req.body as SkillUpdate;

  if (!name && !category && !level) {
    return res.status(400).json({ error: 'En az bir alan gerekli' });
  }

  // updates'i SkillUpdate tipiyle tanımlıyoruz — böylece TypeScript
  // "updates.name = ..." satırlarının geçerli olduğunu biliyor.
  const updates: SkillUpdate = {};
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
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Supabase hatası:', message);
    res.status(500).json({ error: 'Yetenek güncellenemedi' });
  }
}
