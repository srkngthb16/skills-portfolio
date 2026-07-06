// api/skills/update/[id].ts
// PUT /api/skills/update/:id → mevcut yeteneği güncelle (token gerekli)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../../lib/auth.js';
import { applyCors } from '../../../lib/cors.js';
import { validateSkillUpdateInput } from '../../../lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const idParam = req.query.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const result = validateSkillUpdateInput(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const { data, error } = await auth.supabase
      .from('skills')
      .update(result.data)
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
