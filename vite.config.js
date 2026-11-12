import { defineConfig } from 'vite'

// Relative base so the built site works from any folder, including the
// /<repo>/ subpath GitHub Pages serves from. The build goes to docs/, which
// Pages can publish straight from the main branch.
export default defineConfig({
  base: './',
  build: { outDir: 'docs', emptyOutDir: true },
})
