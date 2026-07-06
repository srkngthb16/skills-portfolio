// api/skills/remove.ts
// DELETE /api/skills/remove?id=12 → yeteneği sil (token gerekli)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../lib/auth.js';
import { applyCors } from '../../lib/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const idParam = req.query.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return res.status(400).json({ error: 'id parametresi zorunludur' });
  }

  try {
    const { data, error } = await auth.supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Yetenek bulunamadı' });
    }

    res.status(200).json({ message: 'Yetenek silindi', deleted: data[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Supabase hatası:', message);
    res.status(500).json({ error: 'Yetenek silinemedi' });
  }
}
