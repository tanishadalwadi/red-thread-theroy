import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration: enable source maps in build and CSS dev sourcemaps
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
});