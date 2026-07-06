import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// document.getElementById bir HTMLElement | null döndürür.
// TypeScript strict modda "null olabilir" uyarısı verir, "!" ile
// "burada kesinlikle null değil" diyoruz (root div'i index.html'de her zaman var).
const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
