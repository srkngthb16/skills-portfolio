// lib/types.ts
// Projede tekrar tekrar kullanılan veri şekillerini burada tanımlıyoruz.
// Böylece "bir yetenek nasıl görünür" sorusunun cevabı tek bir yerde durur —
// değişirse sadece burayı güncellemek yeterli olur.

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
  created_at?: string;
}

// Yeni bir yetenek eklerken id ve created_at henüz yok (Supabase otomatik verir),
// bu yüzden Skill tipinden bu iki alanı çıkarıyoruz (Omit).
export type NewSkill = Omit<Skill, 'id' | 'created_at'>;

// Güncelleme sırasında hiçbir alan zorunlu değil (kısmi güncelleme) —
// Partial<Skill>, Skill'in tüm alanlarını "opsiyonel" yapar.
export type SkillUpdate = Partial<NewSkill>;

// GitHub'dan bize gelen bir repo objesinin (kullandığımız alanlar için) şekli
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  html_url: string;
  created_at: string;
  stargazers_count: number;
  fork: boolean;
}

// Bizim frontend'e döndüğümüz, sadeleştirilmiş proje şekli
export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  date: string;
  stars: number;
}
