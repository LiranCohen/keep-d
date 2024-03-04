import { defineConfig, loadEnv } from 'vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser' 
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        // by node-globals-polyfill
        'sodium-native': 'sodium-javascript'
      }
    },
    define: {
      global: 'globalThis',
      'process.env': env,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
        define: {
          global: 'globalThis',
        }
      }
    },
    server: {
      port: 5555,
    },
    plugins: [
      nodePolyfills(),
      react()
    ],
  }
})
