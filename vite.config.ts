import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { createHtmlPlugin } from 'vite-plugin-html';
// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
    createHtmlPlugin({
      inject: {
        data: loadEnv(mode, process.cwd())
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        ws: false,
        changeOrigin: true
      }
    }
  },
});
