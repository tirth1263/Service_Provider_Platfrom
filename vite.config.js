import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite configuration with the React plugin
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
})
