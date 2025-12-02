import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      //   manifest: {
      //     name: 'NutriHealth Gen',
      //     short_name: 'NutriHealth',
      //     description: 'Your AI-powered nutrition and health companion',
      //     theme_color: '#10b981',
      //     icons: [
      //       {
      //         src: 'pwa-192x192.png',
      //         sizes: '192x192',
      //         type: 'image/png'
      //       },
      //       {
      //         src: 'pwa-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png'
      //       }
      //     ]
      //   }
      // })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      // Let Vite handle chunking automatically
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
  };
});
