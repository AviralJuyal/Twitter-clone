import {resolve} from "path"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  build: {
    transpile: ['@heroicons/vue'],
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // Define a custom cache group to bundle all composables and utils
          common: {
            test: /[\\/]composables[\\/]|[\\/]utils[\\/]/,
            name: 'common',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  alias:{
    "@":resolve(__dirname,"/")
  },
  app:{
    head:{
      title:"Twitter"
    }
  },
  ssr:true,
  runtimeConfig:{
    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  },
  server: {
    host: '0.0.0.0', // default: localhost
    port: 3000,      // default: 3000
  },

})