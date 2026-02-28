import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        electron([
            {
                // Main process entry
                entry: 'electron/main/index.ts',
                onstart: function (options) {
                    options.startup();
                },
                vite: {
                    build: {
                        sourcemap: true,
                        minify: false,
                        outDir: 'dist-electron/main',
                        lib: {
                            entry: 'electron/main/index.ts',
                            formats: ['cjs']
                        },
                        rollupOptions: {
                            external: ['electron', 'better-sqlite3'],
                            output: {
                                entryFileNames: '[name].js'
                            }
                        }
                    }
                }
            },
            {
                // Preload scripts
                entry: 'electron/preload/index.ts',
                onstart: function (options) {
                    options.reload();
                },
                vite: {
                    build: {
                        sourcemap: true,
                        minify: false,
                        outDir: 'dist-electron/preload',
                        lib: {
                            entry: 'electron/preload/index.ts',
                            formats: ['cjs']
                        },
                        rollupOptions: {
                            external: ['electron'],
                            output: {
                                entryFileNames: '[name].js'
                            }
                        }
                    }
                }
            }
        ]),
        renderer()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@stores': path.resolve(__dirname, './src/stores'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@services': path.resolve(__dirname, './src/services'),
            '@types': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@constants': path.resolve(__dirname, './src/constants'),
            '@assets': path.resolve(__dirname, './src/assets')
        }
    },
    server: {
        port: 5173,
        strictPort: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});
