import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  root: "static-site",
  base: mode === "github" ? "/riegointeligente/" : "/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../dist-static",
    emptyOutDir: true,
  },
}));
