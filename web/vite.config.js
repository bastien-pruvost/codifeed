/// <reference types="vitest" />
import path from "node:path"
import { fileURLToPath } from "node:url"

import TailwindCssVite from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import ReactVite from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    ReactVite(),
    TailwindCssVite(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
})
