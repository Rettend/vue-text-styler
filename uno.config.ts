import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { insertShadow } from 'icon-shadow'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        shadow: FileSystemIconLoader(
          './playground/public',
          svg => insertShadow(svg, {
            stdDeviation: 2,
            opacity: 0.3,
            viewBoxScale: 1.5,
          }),
        ),
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Ubuntu',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
