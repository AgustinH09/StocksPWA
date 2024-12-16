import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      components: '/src/components',
      hooks: '/src/hooks',
      providers: '/src/providers',
      types: '/src/types',
      utils: '/src/utils',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Stock PWA',
        short_name: 'StockPWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#003366',
        icons: [
          {
            src: 'stock-market-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'stock-market-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/finnhub\.io\/api\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'finnhub-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60
              }
            }
          }
        ]
      }
    })
  ],
});
