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
    chunkSizeWarningLimit: 1800,
    brotliSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split pre-rendered Open Doodles SVG data into its own lazy-loaded chunk
          if (id.includes("openDoodleSvgs")) return "open-doodles-svgs";
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("@react-three")) return "three-vendor";
          if (id.includes("framer-motion") || id.includes("motion")) return "motion-vendor";
          if (id.includes("@sanity") || id.includes("sanity")) return "sanity-vendor";
          if (id.includes("lucide-react")) return "icons-vendor";
        },
      },
    },
  },
})
