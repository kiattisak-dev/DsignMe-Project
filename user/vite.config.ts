import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// โหลด .env
dotenv.config();

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // กำหนดให้ Vite รู้จักตัวแปร
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://dsignme-project.onrender.com'),
  },
});
