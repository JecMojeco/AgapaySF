import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "pregame-custodian-munchkin.ngrok-free.dev",
    ],
  },
})