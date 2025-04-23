import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            srcDir: "src",
            manifestFilename: "manifest.json",
            includeAssets: [ '/icons/icon-512x512.png' ],
            filename: "sw.js"
            // manifest: {
            //     name: "Dkbldr - Deckbuilding Assistant",
            //     short_name: "Dkbldr",
            //     description: "EDH Deckbuilding Assistant",
            //     theme_color: "#ffffff",
            //     background_color: "#ffffff",
            //     display: "standalone",
            //     orientation: "portrait",
            //     start_url: "/",
            //     scope: "/",
            //     icons: [
            //         {
            //             src: "/icons/icon-192x192.png",
            //             sizes: "192x192",
            //             type: "image/png",
            //             purpose: "any maskable"
            //         },
            //         {
            //             src: "/icons/icon-512x512.png",
            //             sizes: "512x512",
            //             type: "image/png",
            //             purpose: "any maskable"
            //         },
            //     ]
            // }
        })
    ],
    server: {
        host: true,
        allowedHosts: ["*"]
    }
})
