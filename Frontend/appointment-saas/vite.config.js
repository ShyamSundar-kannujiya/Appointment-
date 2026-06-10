import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      cleanupOutdatedCaches: true,
      includeAssets: ["Logo1.svg"],

      manifest: {
        name: "AppointmentPro",
        short_name: "AppointmentPro",
        description: "Appointment booking system for shop owners",
        theme_color: "#4f46e5",
        background_color: "#020617",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/Logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
