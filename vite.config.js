import { defineConfig } from "vite";

// Local-first dev server. Honors the PORT env var so tooling can pick a port;
// falls back to Vite's default 5173.
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 5173,
  },
  preview: {
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 4173,
  },
});
