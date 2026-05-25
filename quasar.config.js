import { configure } from 'quasar/wrappers'

export default configure(function (/* ctx */) {
  return {
    boot: [
      'axios',
      'pinia'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'history'
    },

    devServer: {
      open: true
    },

    framework: {
      config: {
        notify: {
          position: 'top-right',
          timeout: 2500
        }
      },
      plugins: [
        'Notify',
        'Dialog',
        'Loading'
      ]
    },

    animations: 'all',

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'GenerateSW'
    }
  }
})
