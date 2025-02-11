// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-phosphor-icons',
    'v-wave/nuxt',
    '@pinia/nuxt',
    'nuxt-viewport',
    'pinia-plugin-persistedstate',
    'nuxt-tiptap-editor'
  ],


  plugins: [
    '@/plugins/animXyz'
  ],

  colorMode: {
    preference: 'dark'
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },

  runtimeConfig: {
    public: {
      SERVER_URL: process.env.NUXT_PUBLIC_SERVER_URL, // can be overridden by NUXT_API_SECRET environment variable
    }
  },
 
})