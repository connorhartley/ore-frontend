const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  head: {
    title: 'ore-frontend',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'The ore frontend'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  loading: {color: '#f7cf0d'},

  build: {
    babel: {
      plugins: ['transform-decorators-legacy', 'transform-class-properties']
    },

    extend(config, {isDev, isClient, isServer}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^sponge-web-commons/]
          })
        ]
      }

      config.plugins.push(
        new Dotenv({
          path: './.env',
          safe: true
        })
      );
    },

    extractCSS: {
      allChunks: true
    },

    render: {
      bundleRenderer: {
        shouldPreload: (file, type) => {
          return ['script', 'style', 'font'].includes(type)
        }
      }
    },

    vendor: ['axios', 'vue-i18n', 'qs']
  },

  router: {
    middleware: 'i18n'
  },

  css: [
    '@fortawesome/fontawesome/styles.css'
  ],

  sassResources: [
    path.resolve(__dirname, 'node_modules/sponge-web-commons/styles/_variables.scss'),
    path.resolve(__dirname, 'assets/color-palette.scss')
  ],

  modules: [
    'bootstrap-vue/nuxt',
    'nuxt-sass-resources-loader'
  ],

  plugins: [
    '~/plugins/sponge-vue',
    '~/plugins/bootstrap-vue',
    '~/plugins/font-awesome',
    '~/plugins/axios',
    '~/plugins/i18n'
  ]
};
