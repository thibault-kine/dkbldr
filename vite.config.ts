import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { ghPages } from 'vite-plugin-gh-pages'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            srcDir: "src",
            manifestFilename: "manifest.json",
            includeAssets: [ '/icons/icon-512x512.png' ],
            filename: "sw.js",
        }),
        ghPages(),
    ],
    server: {
        host: true,
        allowedHosts: ["*"]
    },
    base: "/dkbldr/",
})
