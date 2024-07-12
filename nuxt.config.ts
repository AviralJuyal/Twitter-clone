import {resolve} from "path"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  build: {
    analyze: true, // This is optional but helps to visualize your bundles
    extend(config, { isDev, isClient }) {
      if (isClient && !isDev) {
        // Merge composables and utils into a single chunk
        config.optimization.splitChunks = {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              enforce: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            composablesUtils: {
              name: 'composables-utils',
              test: /[\\/]composables[\\/]|[\\/]utils[\\/]/,
              chunks: 'all',
              priority: 10,
              enforce: true,
            },
          },
        };
      }
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