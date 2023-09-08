import {resolve} from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'plusauthweb',
      // the proper extensions will be added
      fileName: 'plusauth-web'
    },
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: [
        {
          name: 'plusauth-web',
          format: 'cjs',
          entryFileNames: "plusauth-web.js",
        },
        {
          name: 'plusauth-web',
          format: 'es',
          entryFileNames: "plusauth-web.[format].js",
        },
        {
          name: 'plusauth-web',
          format: 'umd',
          entryFileNames: "plusauth-web.[format].js",
        },
      ]
    }
  },
  plugins: [
    dts({
      outDir: 'types'
    })
  ]
})
