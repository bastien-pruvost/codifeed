import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import ReactVite from '@vitejs/plugin-react'
import TailwindCssVite from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    ReactVite(),
    TailwindCssVite(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
