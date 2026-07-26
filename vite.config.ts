import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    tailwindcss(),
    react(),
    // Bundle visualizer when ANALYZE env var is set
    ...(process.env.ANALYZE === '1' ? [visualizer({ filename: 'dist/bundle-stats.html', gzipSize: true })] : []),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
    // Force all packages to use the same React instance
    dedupe: ['react', 'react-dom', 'three'],
  },
  optimizeDeps: {
    // Pre-bundle R3F packages together so they share the same React instance
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'motion/react',
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  // Build optimizations and manual chunking to reduce initial bundle weight
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500, // in kB, adjust as needed
    // Use Vite's default chunking so React and React Three Fiber remain compatible.
    // Custom manualChunks can split React hooks across unsafe boundaries.
    // Enable brotli size reports for CI visibility
    brotliSize: true,
  },
})

