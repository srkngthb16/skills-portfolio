// src/types.ts
// Frontend'de kullanılan veri şekilleri. Backend'deki lib/types.ts ile
// kavramsal olarak aynı şeyi temsil ediyor ama ayrı tutuyoruz çünkü
// frontend (Vite/tsconfig.json) ve backend (Vercel/tsconfig.api.json)
// farklı derleme kapsamlarına (scope) sahip.

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  date: string;
  stars: number;
}

export type Theme = 'light' | 'dark';
export type Page = 'home' | 'login' | 'admin';
