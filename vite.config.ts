import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        ssrManifest: true,
        ssrEmitAssets: true
    },
    plugins: [
        splitVendorChunkPlugin(),
        react({
            babel: {
                plugins: [
                    [
                        '@babel/plugin-proposal-class-properties',
                        { legacy: true },
                    ],
                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                ],
            },
        }),
    ],
});
