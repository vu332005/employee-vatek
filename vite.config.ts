import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/main.tsx',
        'src/configs/axiosClient.ts',
        'src/configs/socketClient.ts',
        'src/store/hooks.ts',
        'src/store/store.ts',
        'src/utils/test-utils.tsx',
        'vite.config.ts',
        'tailwind.config.js',
        'postcss.config.js',
        'dist/**',
      ]
    }
  }
})
