// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: 2025
  },
  app: {
    head: {
      title: 'FCMVN — Prototype',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/styles/main.scss'   // giữ các style custom của bạn
  ],
  runtimeConfig: {
    public: {
      // Read from process.env at runtime (or default values)
      USE_MOCK: process.env.USE_MOCK ?? '1',
      API_BASE_URL: process.env.API_BASE_URL ?? 'https://fcmvn.com/api'
    }
  },
  nitro: {
    routeRules: {
      // Allow CORS during local dev for API routes
      '/api/**': { cors: true }
    }
  },
  vite: {
    server: {
      strictPort: true
    },
  }
})
