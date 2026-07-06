// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // backend testleri — tarayıcı ortamı gerekmiyor
    include: ['tests/**/*.test.ts'],
  },
});
