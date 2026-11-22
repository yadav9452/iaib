import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-file build: `npm run build` creates dist/index.html that opens by double-click, fully offline.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
