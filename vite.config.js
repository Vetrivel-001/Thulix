import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    allowedHosts: ['.ngrok-free.dev'],
  },

  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion') || id.includes('/motion/')) return 'framer'
          if (id.includes('gsap') || id.includes('/ScrollTrigger')) return 'gsap'
          if (id.includes('recharts') || id.includes('d3-') || id.includes('/victory-')) return 'charts'
          if (id.includes('react-icons')) return 'icons'
        },
      },
    },
  },
})