// eslint-disable-next-line import/no-unresolved
import Unfonts from 'unplugin-fonts/vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'

import { pluginExposeRenderer } from './vite.base.config'

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ''

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      Unfonts({
        google: {
          families: [{ name: 'Dongle' }],
        },
      }),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig
})
