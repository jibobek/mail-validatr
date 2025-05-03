import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts', 'src/cli/cli.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    target: 'node18',
    outDir: 'dist',
})
